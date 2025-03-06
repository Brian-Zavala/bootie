// server/src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true 
  },
  firstName: { 
    type: String, 
    trim: true 
  },
  lastName: { 
    type: String, 
    trim: true 
  },
  role: { 
    type: String, 
    enum: ['student', 'admin', 'instructor'],
    default: 'student'
  },
  profileImage: { 
    type: String 
  },
  bio: { 
    type: String,
    maxlength: 500
  },
  subscription: {
    status: { 
      type: String, 
      enum: ['free', 'basic', 'premium', 'none'],
      default: 'free'
    },
    startDate: { 
      type: Date 
    },
    endDate: { 
      type: Date 
    },
    stripeCustomerId: { 
      type: String 
    }
  },
  progress: {
    completedCourses: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Course' 
    }],
    completedExercises: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Exercise' 
    }]
  },
  lastActive: { 
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);