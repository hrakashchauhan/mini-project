const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema(
  {
    sessionCode: { type: String, required: true, index: true },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
      index: true,
    },
    studentId: { type: String, required: true, index: true },
    studentName: { type: String, default: "" },
    answer: { type: String, required: true },
    isCorrect: { type: Boolean, default: false },
    responseTimeMs: { type: Number, required: true },
    answeredAt: { type: Date, required: true },
    locked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Answer", AnswerSchema);
