// server/src/routes/courses.js
const express = require('express');
const { body } = require('express-validator');
const CourseController = require('../controllers/courses');
const { authenticate, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Validate course input
const validateCourse = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('slug').trim().notEmpty().withMessage('Slug is required')
];

// Get all published courses (public)
router.get('/', CourseController.getAllCourses);

// Get course by slug (public)
router.get('/:slug', CourseController.getCourseBySlug);

// Create new course (admin/instructor)
router.post(
  '/', 
  authenticate, 
  authorizeRoles('admin', 'instructor'), 
  validateCourse,
  CourseController.createCourse
);

// Update course (admin/instructor)
router.put(
  '/:id', 
  authenticate, 
  authorizeRoles('admin', 'instructor'), 
  CourseController.updateCourse
);

// Delete course (admin only)
router.delete(
  '/:id', 
  authenticate, 
  authorizeRoles('admin'), 
  CourseController.deleteCourse
);

// Enroll in a course
router.post(
  '/:id/enroll', 
  authenticate, 
  CourseController.enrollInCourse
);

// Get enrolled courses for current user
router.get(
  '/user/enrolled', 
  authenticate, 
  CourseController.getEnrolledCourses
);

// Submit rating and review for a course
router.post(
  '/:id/rate', 
  authenticate, 
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1-5'),
  CourseController.rateCourse
);

module.exports = router;