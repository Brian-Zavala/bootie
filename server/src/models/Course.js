// server/src/models/Course.js
const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  description: { 
    type: String, 
    required: true 
  },
  thumbnail: { 
    type: String 
  },
  difficulty: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  duration: { 
    type: Number, // in minutes
    default: 0
  },
  price: {
    free: { 
      type: Boolean, 
      default: false 
    },
    amount: { 
      type: Number, 
      default: 0 
    }
  },
  modules: [{
    title: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String 
    },
    order: { 
      type: Number, 
      required: true 
    },
    lessons: [{
      title: { 
        type: String, 
        required: true 
      },
      content: { 
        type: String, 
        required: true 
      },
      order: { 
        type: Number, 
        required: true 
      },
      exercises: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Exercise' 
      }]
    }]
  }],
  requirements: [{ 
    type: String 
  }],
  tags: [{ 
    type: String 
  }],
  instructor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  enrolledStudents: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  ratings: [{
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    rating: { 
      type: Number, 
      min: 1, 
      max: 5 
    },
    review: { 
      type: String 
    },
    date: { 
      type: Date, 
      default: Date.now 
    }
  }],
  averageRating: { 
    type: Number, 
    default: 0 
  },
  isPublished: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true 
});

// Calculate average rating before saving
CourseSchema.pre('save', function(next) {
  if (this.ratings.length > 0) {
    this.averageRating = this.ratings.reduce((sum, rating) => sum + rating.rating, 0) / this.ratings.length;
  }
  next();
});

module.exports = mongoose.model('Course', CourseSchema);