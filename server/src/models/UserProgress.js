// server/src/models/UserProgress.js
const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course',
    required: true
  },
  completedLessons: [{
    moduleId: { type: String },
    lessonId: { type: String },
    completedAt: { type: Date, default: Date.now }
  }],
  completedExercises: [{
    exercise: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Exercise' 
    },
    score: { type: Number },
    attempts: { type: Number, default: 1 },
    completedAt: { type: Date, default: Date.now },
    solution: { type: String } // User's solution
  }],
  quizScores: [{
    quiz: { type: String },
    score: { type: Number },
    completedAt: { type: Date, default: Date.now }
  }],
  lastAccessed: {
    moduleId: { type: String },
    lessonId: { type: String },
    timestamp: { type: Date, default: Date.now }
  },
  courseProgress: { 
    type: Number, // Percentage
    default: 0 
  },
  timeSpent: { 
    type: Number, // Total minutes spent
    default: 0 
  },
  certificateIssued: {
    status: { type: Boolean, default: false },
    issuedAt: { type: Date }
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('UserProgress', UserProgressSchema);