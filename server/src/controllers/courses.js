// server/src/controllers/courses.js
const { validationResult } = require('express-validator');
const Course = require('../models/Course');
const User = require('../models/User');
const UserProgress = require('../models/UserProgress');

// Get all published courses
exports.getAllCourses = async (req, res) => {
  try {
    const { difficulty, tag, search, sort, limit = 10, page = 1 } = req.query;
    
    // Build query
    const query = { isPublished: true };
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (tag) {
      query.tags = tag;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Build sort options
    let sortOptions = {};
    if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'rating-high') {
      sortOptions = { averageRating: -1 };
    } else if (sort === 'rating-low') {
      sortOptions = { averageRating: 1 };
    } else {
      sortOptions = { createdAt: -1 }; // Default
    }
    
    // Count total documents
    const total = await Course.countDocuments(query);
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get courses
    const courses = await Course.find(query)
      .sort(sortOptions)
      .populate('instructor', 'username firstName lastName')
      .skip(skip)
      .limit(parseInt(limit))
      .select('title slug description thumbnail difficulty duration price.free price.amount averageRating tags');
    
    res.json({
      courses,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: courses.length,
        totalItems: total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get course by slug
exports.getCourseBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const course = await Course.findOne({ slug })
      .populate('instructor', 'username firstName lastName bio profileImage')
      .populate({
        path: 'modules.lessons.exercises',
        select: 'title difficulty type points'
      });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if course is not published and user is not admin/instructor
    if (!course.isPublished) {
      // If user is authenticated
      if (req.user) {
        // If user is not admin/instructor or the course creator
        if (req.user.role !== 'admin' && 
            req.user.role !== 'instructor' && 
            course.instructor._id.toString() !== req.user._id.toString()) {
          return res.status(404).json({ message: 'Course not found' });
        }
      } else {
        return res.status(404).json({ message: 'Course not found' });
      }
    }
    
    res.json({ course });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const courseData = {
      ...req.body,
      instructor: req.user._id
    };
    
    const course = new Course(courseData);
    await course.save();
    
    res.status(201).json({ 
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a course
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find course
    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is instructor of this course or admin
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }
    
    // Update course
    Object.keys(req.body).forEach(key => {
      course[key] = req.body[key];
    });
    
    await course.save();
    
    res.json({ 
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find course
    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Delete course
    await course.deleteOne();
    
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Enroll in a course
exports.enrollInCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    // Find course
    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if course is published
    if (!course.isPublished) {
      return res.status(400).json({ message: 'Cannot enroll in unpublished course' });
    }
    
    // Check if user is already enrolled
    if (course.enrolledStudents.includes(userId)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }
    
    // Check if course is paid and user has subscription
    if (!course.price.free && req.user.subscription.status === 'free') {
      return res.status(403).json({ message: 'Subscription required for this course' });
    }
    
    // Add user to enrolled students
    course.enrolledStudents.push(userId);
    await course.save();
    
    // Create user progress entry
    const userProgress = new UserProgress({
      user: userId,
      course: id,
      courseProgress: 0
    });
    
    await userProgress.save();
    
    // Add course to user's progress
    await User.findByIdAndUpdate(userId, {
      $push: { 'progress.enrolledCourses': id }
    });
    
    res.json({ 
      message: 'Successfully enrolled in course',
      course: {
        _id: course._id,
        title: course.title,
        slug: course.slug
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get enrolled courses for current user
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find all user progress entries
    const progressEntries = await UserProgress.find({ user: userId })
      .populate({
        path: 'course',
        select: 'title slug description thumbnail difficulty duration modules',
        populate: {
          path: 'instructor',
          select: 'username firstName lastName'
        }
      });
    
    const enrolledCourses = progressEntries.map(entry => {
      return {
        course: entry.course,
        progress: entry.courseProgress,
        lastAccessed: entry.lastAccessed
      };
    });
    
    res.json({ enrolledCourses });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Rate and review a course
exports.rateCourse = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { rating, review } = req.body;
    const userId = req.user._id;
    
    // Find course
    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is enrolled
    if (!course.enrolledStudents.includes(userId)) {
      return res.status(403).json({ message: 'Must be enrolled to rate this course' });
    }
    
    // Check if user has already rated
    const existingRatingIndex = course.ratings.findIndex(
      r => r.user.toString() === userId.toString()
    );
    
    if (existingRatingIndex !== -1) {
      // Update existing rating
      course.ratings[existingRatingIndex].rating = rating;
      course.ratings[existingRatingIndex].review = review || course.ratings[existingRatingIndex].review;
      course.ratings[existingRatingIndex].date = Date.now();
    } else {
      // Add new rating
      course.ratings.push({
        user: userId,
        rating,
        review,
        date: Date.now()
      });
    }
    
    // Recalculate average rating
    if (course.ratings.length > 0) {
      course.averageRating = course.ratings.reduce((sum, item) => sum + item.rating, 0) / course.ratings.length;
    }
    
    await course.save();
    
    res.json({ 
      message: 'Rating submitted successfully',
      averageRating: course.averageRating
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};