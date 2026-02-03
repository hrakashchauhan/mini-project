const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    sessionCode: { type: String, required: true, index: true },
    teacherId: { type: String, required: true },
    questionText: { type: String, required: true },
    type: { type: String, enum: ["MCQ", "MANUAL"], required: true },
    options: { type: [String], default: [] },
    correctAnswer: { type: String, required: true },
    durationSec: { type: Number, required: true },
    sentAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    status: { type: String, enum: ["ACTIVE", "ENDED"], default: "ACTIVE" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Question", QuestionSchema);
