const Question = require("../models/Question");
const Answer = require("../models/Answer");

const normalizeOneWord = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const validateAnswerShape = (type, answer, options) => {
  const trimmed = String(answer || "").trim();
  if (!trimmed) return { ok: false, reason: "Empty answer" };
  if (/\s/.test(trimmed)) return { ok: false, reason: "One word only" };
  if (type === "MCQ") {
    const normalizedOptions = options.map((opt) => normalizeOneWord(opt));
    if (!normalizedOptions.includes(normalizeOneWord(trimmed))) {
      return { ok: false, reason: "Answer not in options" };
    }
  }
  return { ok: true, answer: trimmed };
};

const registerClassroomSockets = (io, socket) => {
  socket.on("presence:join", (payload) => {
    const { roomId, studentId, studentName } = payload || {};
    if (!roomId || !studentId) return;
    io.to(roomId).emit("presence:update", {
      studentId,
      studentName,
      status: "JOINED",
      at: new Date().toISOString(),
    });
  });

  socket.on("question:send", async (payload) => {
    try {
      const {
        roomId,
        teacherId,
        questionText,
        type,
        options = [],
        correctAnswer,
        durationSec,
      } = payload || {};

      if (!roomId || !teacherId || !questionText || !type || !durationSec) {
        socket.emit("question:error", {
          message: "Missing required fields.",
        });
        return;
      }

      const trimmedOptions = options
        .map((o) => String(o || "").trim())
        .filter(Boolean);

      if (type === "MCQ") {
        const invalid = trimmedOptions.find((opt) => /\s/.test(opt));
        if (invalid) {
          socket.emit("question:error", {
            message: "MCQ options must be one word.",
          });
          return;
        }
      }

      const validation = validateAnswerShape(type, correctAnswer, trimmedOptions);
      if (!validation.ok) {
        socket.emit("question:error", { message: validation.reason });
        return;
      }

      const sentAt = new Date();
      const endsAt = new Date(sentAt.getTime() + durationSec * 1000);

      const question = await Question.create({
        sessionCode: roomId,
        teacherId,
        questionText: String(questionText).trim(),
        type,
        options: trimmedOptions,
        correctAnswer: validation.answer,
        durationSec,
        sentAt,
        endsAt,
      });

      io.to(roomId).emit("question:new", {
        id: question._id.toString(),
        questionText: question.questionText,
        type: question.type,
        options: question.options,
        durationSec: question.durationSec,
        sentAt: question.sentAt,
        endsAt: question.endsAt,
      });
    } catch (error) {
      console.error("question:send error", error);
      socket.emit("question:error", { message: "Failed to send question." });
    }
  });

  socket.on("answer:submit", async (payload) => {
    try {
      const {
        roomId,
        questionId,
        studentId,
        studentName,
        answer,
      } = payload || {};

      if (!roomId || !questionId || !studentId) {
        socket.emit("answer:result", {
          ok: false,
          message: "Missing required fields.",
        });
        return;
      }

      const question = await Question.findById(questionId);
      if (!question) {
        socket.emit("answer:result", {
          ok: false,
          message: "Question not found.",
        });
        return;
      }

      const now = new Date();
      const locked = now > question.endsAt;

      const validation = validateAnswerShape(
        question.type,
        answer,
        question.options || [],
      );
      if (!validation.ok) {
        socket.emit("answer:result", {
          ok: false,
          message: validation.reason,
          questionId,
        });
        return;
      }

      const normalized = normalizeOneWord(validation.answer);
      const correctNormalized = normalizeOneWord(question.correctAnswer);
      const isCorrect = normalized === correctNormalized;
      const responseTimeMs = Math.max(
        0,
        now.getTime() - question.sentAt.getTime(),
      );

      const existing = await Answer.findOne({ questionId, studentId });
      if (existing) {
        socket.emit("answer:result", {
          ok: false,
          message: "Answer already submitted.",
          questionId,
        });
        return;
      }

      await Answer.create({
        sessionCode: roomId,
        questionId,
        studentId,
        studentName,
        answer: validation.answer,
        isCorrect,
        responseTimeMs,
        answeredAt: now,
        locked,
      });

      const resultPayload = {
        ok: !locked,
        locked,
        questionId,
        studentId,
        studentName,
        answer: validation.answer,
        isCorrect,
        responseTimeMs,
        answeredAt: now,
      };

      socket.emit("answer:result", resultPayload);
      io.to(roomId).emit("answer:update", resultPayload);
    } catch (error) {
      console.error("answer:submit error", error);
      socket.emit("answer:result", {
        ok: false,
        message: "Failed to submit answer.",
      });
    }
  });
};

module.exports = { registerClassroomSockets };
