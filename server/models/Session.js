const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  teacherId: { type: String, required: true },
  startTime: { type: Date, default: Date.now },
  participants: [String],
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Session', SessionSchema);