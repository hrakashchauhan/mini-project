const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true 
  }, // e.g., "MATH101"
  teacherId: { 
    type: String, 
    required: true 
  }, // Who started it?
  startTime: { 
    type: Date, 
    default: Date.now 
  },
  participants: [String], // List of Student IDs who joined
  isActive: { 
    type: Boolean, 
    default: true 
  }
});

module.exports = mongoose.model('Session', SessionSchema);