// server/src/controllers/exercises.js
const { validationResult } = require('express-validator');
const Exercise = require('../models/Exercise');
const Course = require('../models/Course');
const UserProgress = require('../models/UserProgress');
const CodeExecutionService = require('../services/codeExecution');

// Get exercise by ID
exports.getExerciseById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const exercise = await Exercise.findById(id)
      .populate('course', 'title slug');
    
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    
    // Check if user is enrolled in the course
    const course = await Course.findById(exercise.course);
    
    // If not enrolled and not admin/instructor
    if (!course.enrolledStudents.includes(req.user._id) &&
        req.user.role !== 'admin' && 
        req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }
    
    // Get user's previous attempts
    const progress = await UserProgress.findOne({
      user: req.user._id,
      course: exercise.course
    });
    
    const exerciseProgress = progress ? 
      progress.completedExercises.find(e => e.exercise.toString() === id) :
      null;
    
    // Remove solution from response if not completed yet
    const exerciseData = exercise.toObject();
    
    if (!exerciseProgress || !exerciseProgress.score) {
      delete exerciseData.solution;
      
      // Remove hidden test cases
      if (exerciseData.testCases) {
        exerciseData.testCases = exerciseData.testCases.filter(test => !test.isHidden);
      }
    }
    
    res.json({ 
      exercise: exerciseData,
      progress: exerciseProgress
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new exercise
exports.createExercise = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Check if course exists and user is instructor
    const course = await Course.findById(req.body.course);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the course instructor or admin
    if (course.instructor.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to add exercises to this course' });
    }
    
    const exercise = new Exercise(req.body);
    await exercise.save();
    
    res.status(201).json({ 
      message: 'Exercise created successfully',
      exercise
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update exercise
exports.updateExercise = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find exercise
    const exercise = await Exercise.findById(id);
    
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    
    // Check if user is course instructor or admin
    const course = await Course.findById(exercise.course);
    
    if (course.instructor.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this exercise' });
    }
    
    // Update exercise
    Object.keys(req.body).forEach(key => {
      exercise[key] = req.body[key];
    });
    
    await exercise.save();
    
    res.json({ 
      message: 'Exercise updated successfully',
      exercise
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete exercise
exports.deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find exercise
    const exercise = await Exercise.findById(id);
    
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    
    // Check if user is course instructor or admin
    const course = await Course.findById(exercise.course);
    
    if (course.instructor.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this exercise' });
    }
    
    // Remove exercise from course module lesson
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        const exerciseIndex = lesson.exercises.findIndex(e => e.toString() === id);
        if (exerciseIndex !== -1) {
          lesson.exercises.splice(exerciseIndex, 1);
        }
      }
    }
    
    await course.save();
    
    // Delete exercise
    await exercise.deleteOne();
    
    res.json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit solution for an exercise
exports.submitSolution = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { solution } = req.body;
    const userId = req.user._id;
    
    // Find exercise
    const exercise = await Exercise.findById(id);
    
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    
    // Check if user is enrolled in course
    const course = await Course.findById(exercise.course);
    
    if (!course.enrolledStudents.includes(userId)) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }
    
    // Find or create user progress
    let userProgress = await UserProgress.findOne({
      user: userId,
      course: exercise.course
    });
    
    if (!userProgress) {
      userProgress = new UserProgress({
        user: userId,
        course: exercise.course,
        courseProgress: 0
      });
    }
    
    // Check exercise type and grade accordingly
    let score = 0;
    let results = [];
    
    if (exercise.type === 'coding') {
      // Execute code against test cases
      const executionResults = await CodeExecutionService.executeCode(
        solution, 
        exercise.language, 
        exercise.testCases
      );
      
      // Calculate score based on passing test cases
      const passedTests = executionResults.filter(r => r.passed).length;
      score = (passedTests / exercise.testCases.length) * exercise.points;
      
      results = executionResults;
    } else if (exercise.type === 'multiple-choice') {
      // Check if answer is correct
      const selectedOptions = JSON.parse(solution);
      const correctOptions = exercise.options.filter(o => o.isCorrect).map(o => o.text);
      
      if (selectedOptions.length === correctOptions.length && 
          selectedOptions.every(o => correctOptions.includes(o))) {
        score = exercise.points;
      }
      
      results = [{ correct: score === exercise.points }];
    } else if (exercise.type === 'fill-in-blank') {
      // Check if answer matches solution
      if (solution.trim().toLowerCase() === exercise.solution.trim().toLowerCase()) {
        score = exercise.points;
      }
      
      results = [{ correct: score === exercise.points }];
    }
    
    // Round score to 2 decimal places
    score = Math.round(score * 100) / 100;
    
    // Update user progress
    const existingExerciseIndex = userProgress.completedExercises.findIndex(
      e => e.exercise.toString() === id
    );
    
    if (existingExerciseIndex !== -1) {
      // Update existing attempt if score is higher
      if (score > userProgress.completedExercises[existingExerciseIndex].score) {
        userProgress.completedExercises[existingExerciseIndex].score = score;
        userProgress.completedExercises[existingExerciseIndex].solution = solution;
      }
      
      userProgress.completedExercises[existingExerciseIndex].attempts += 1;
      userProgress.completedExercises[existingExerciseIndex].completedAt = Date.now();
    } else {
      // Add new completed exercise
      userProgress.completedExercises.push({
        exercise: id,
        score,
        attempts: 1,
        completedAt: Date.now(),
        solution
      });
    }
    
    // Recalculate overall course progress
    const totalExercises = course.modules.reduce((sum, module) => {
      return sum + module.lessons.reduce((lessonSum, lesson) => {
        return lessonSum + lesson.exercises.length;
      }, 0);
    }, 0);
    
    userProgress.courseProgress = (userProgress.completedExercises.length / totalExercises) * 100;
    
    await userProgress.save();
    
    // Check if user completed the course
    if (userProgress.courseProgress === 100) {
      userProgress.certificateIssued = {
        status: true,
        issuedAt: Date.now()
      };
      
      await userProgress.save();
      
      // Add to completed courses in user profile
      await User.findByIdAndUpdate(userId, {
        $addToSet: { 'progress.completedCourses': exercise.course }
      });
    }
    
    res.json({
      message: 'Solution submitted successfully',
      score,
      maxPoints: exercise.points,
      passed: score === exercise.points,
      results,
      progress: userProgress.courseProgress
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};