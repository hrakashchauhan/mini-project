import { useState } from "react";

const TIMER_PRESETS = [10, 20, 30];

export default function LivePanel({
  sessionCode,
  loading,
  metrics,
  onCreateSession,
  onEndSession,
  onSendQuestion,
  answersByQuestion,
  questionHistory,
}) {
  const [type, setType] = useState("MCQ");
  const [questionText, setQuestionText] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [durationSec, setDurationSec] = useState(20);
  const [customTimer, setCustomTimer] = useState("");

  const submitQuestion = () => {
    const selectedDuration = customTimer
      ? Number(customTimer)
      : Number(durationSec);
    onSendQuestion({
      type,
      questionText,
      correctAnswer,
      options,
      durationSec: selectedDuration,
    });
    setQuestionText("");
    setCorrectAnswer("");
    setOptions(["", "", "", ""]);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-soft-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Session
            </p>
            <h2 className="text-2xl font-display font-semibold mt-2">
              {sessionCode ? "Session Active" : "Create a session"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {sessionCode ? (
              <button
                onClick={onEndSession}
                className="px-4 py-2 rounded-xl border border-white/20 text-white hover:border-white/40 transition"
              >
                End session
              </button>
            ) : null}
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {sessionCode ? "LIVE" : "OFFLINE"}
            </span>
          </div>
        </div>

        {!sessionCode ? (
          <button
            onClick={onCreateSession}
            disabled={loading}
            className="mt-6 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition shadow-glow-primary disabled:opacity-50"
          >
            {loading ? "Creating..." : "Start class"}
          </button>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Session Code", value: sessionCode },
              { label: "Active Students", value: metrics.activeStudents },
              { label: "Focus Rate", value: `${metrics.focusRate}%` },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl bg-background-surface/70 border border-white/5 p-4"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  {item.label}
                </p>
                <p className="text-2xl font-display font-semibold mt-2">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass-panel rounded-3xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold">Question Engine</h3>
        <p className="text-sm text-slate-400">
          Send MCQ or one‑word questions with a strict timer and instant feedback.
        </p>

        <div className="mt-5 grid gap-4">
          <div className="flex gap-2">
            {["MCQ", "MANUAL"].map((item) => (
              <button
                key={item}
                onClick={() => setType(item)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  type === item
                    ? "bg-primary text-white shadow-glow-primary"
                    : "bg-background-surface/60 text-slate-300 border border-white/10"
                }`}
              >
                {item === "MCQ" ? "MCQ" : "One word"}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Question prompt"
            className="w-full rounded-xl bg-background-surface/70 border border-white/10 px-4 py-3 text-slate-100"
          />

          {type === "MCQ" && (
            <div className="grid grid-cols-2 gap-3">
              {options.map((opt, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const next = [...options];
                    next[idx] = e.target.value;
                    setOptions(next);
                  }}
                  placeholder={`Option ${idx + 1}`}
                  className="w-full rounded-xl bg-background-surface/70 border border-white/10 px-4 py-2 text-slate-100"
                />
              ))}
            </div>
          )}

          <input
            type="text"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            placeholder="Correct answer (one word)"
            className="w-full rounded-xl bg-background-surface/70 border border-white/10 px-4 py-3 text-slate-100"
          />

          <div className="grid grid-cols-1 md:grid-cols-[1fr_0.6fr] gap-4 items-center">
            <div className="flex flex-wrap gap-2">
              {TIMER_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setDurationSec(preset);
                    setCustomTimer("");
                  }}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold border transition ${
                    Number(durationSec) === preset && !customTimer
                      ? "bg-emerald-500/20 border-emerald-400 text-emerald-200"
                      : "border-white/10 text-slate-300"
                  }`}
                >
                  {preset}s
                </button>
              ))}
            </div>
            <input
              type="number"
              min="5"
              max="120"
              value={customTimer}
              onChange={(e) => setCustomTimer(e.target.value)}
              placeholder="Custom (sec)"
              className="w-full rounded-xl bg-background-surface/70 border border-white/10 px-4 py-2 text-slate-100"
            />
          </div>

          <button
            onClick={submitQuestion}
            disabled={!sessionCode}
            className="w-full py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition disabled:opacity-50"
          >
            Send question
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold">Question history</h3>
        <div className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-2">
          {questionHistory.length === 0 ? (
            <p className="text-sm text-slate-400">
              Questions will appear here once sent.
            </p>
          ) : (
            questionHistory.map((q) => {
              const stats = answersByQuestion[q.id] || {
                total: 0,
                correct: 0,
                answers: [],
              };
              const avgMs =
                stats.answers.length > 0
                  ? Math.round(
                      stats.answers.reduce(
                        (acc, curr) => acc + (curr.responseTimeMs || 0),
                        0,
                      ) / stats.answers.length,
                    )
                  : 0;
              return (
                <div
                  key={q.id}
                  className="rounded-2xl bg-background-surface/70 border border-white/5 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{q.questionText}</p>
                    <span className="text-xs text-slate-400">
                      {new Date(q.sentAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Correct: {q.correctAnswer}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-300">
                    <span>Answered: {stats.total}</span>
                    <span>
                      Not answered:{" "}
                      {Math.max(0, metrics.activeStudents - stats.total)}
                    </span>
                    <span>Correct: {stats.correct}</span>
                    <span>Wrong: {stats.total - stats.correct}</span>
                    <span>Avg time: {avgMs ? `${avgMs}ms` : "—"}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
