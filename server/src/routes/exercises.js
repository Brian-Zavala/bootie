// server/src/routes/exercises.js
const express = require('express');
const { body } = require('express-validator');
const ExerciseController = require('../controllers/exercises');
const { authenticate, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Validate exercise input
const validateExercise = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('instructions').trim().notEmpty().withMessage('Instructions are required'),
  body('type').isIn(['multiple-choice', 'fill-in-blank', 'coding']).withMessage('Invalid exercise type'),
  body('course').isMongoId().withMessage('Valid course ID is required')
];

// Get exercise by ID
router.get('/:id', authenticate, ExerciseController.getExerciseById);

// Create new exercise (admin/instructor)
router.post(
  '/',
  authenticate,
  authorizeRoles('admin', 'instructor'),
  validateExercise,
  ExerciseController.createExercise
);

// Update exercise (admin/instructor)
router.put(
  '/:id',
  authenticate,
  authorizeRoles('admin', 'instructor'),
  ExerciseController.updateExercise
);

// Delete exercise (admin/instructor)
router.delete(
  '/:id',
  authenticate,
  authorizeRoles('admin', 'instructor'),
  ExerciseController.deleteExercise
);

// Submit solution for an exercise
router.post(
  '/:id/submit',
  authenticate,
  body('solution').notEmpty().withMessage('Solution is required'),
  ExerciseController.submitSolution
);

module.exports = router;