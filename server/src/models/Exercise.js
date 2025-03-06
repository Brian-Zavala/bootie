// server/src/models/Exercise.js
const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  instructions: { 
    type: String, 
    required: true 
  },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  type: { 
    type: String, 
    enum: ['multiple-choice', 'fill-in-blank', 'coding'],
    required: true
  },
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course',
    required: true
  },
  language: { 
    type: String, 
    enum: ['javascript', 'python', 'go', 'ruby', 'java'],
    required: function() { return this.type === 'coding'; }
  },
  codeTemplate: { 
    type: String,
    required: function() { return this.type === 'coding'; }
  },
  solution: { 
    type: String,
    required: function() { return this.type === 'coding'; }
  },
  testCases: [{
    input: { type: String },
    expectedOutput: { type: String },
    isHidden: { type: Boolean, default: false }
  }],
  options: [{
    text: { type: String },
    isCorrect: { type: Boolean }
  }],
  hints: [{ 
    type: String 
  }],
  points: { 
    type: Number, 
    default: 10 
  },
  timeLimit: { 
    type: Number, // in seconds
    default: 300 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Exercise', ExerciseSchema);