import { useState } from "react";
import Timer from "../../components/Timer";

export default function QuestionPopup({ question, onSubmit, result }) {
  const [answer, setAnswer] = useState("");
  const [locked, setLocked] = useState(false);

  if (!question) {
    return (
      <div className="rounded-3xl bg-background-surface/70 border border-white/5 p-5 text-sm text-slate-400">
        Waiting for the next question...
      </div>
    );
  }

  const submit = () => {
    if (locked || !answer.trim()) return;
    onSubmit(answer.trim());
  };

  return (
    <div className="rounded-3xl bg-background-surface/70 border border-white/5 p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Live Question
          </p>
          <h3 className="text-lg font-semibold mt-2">{question.questionText}</h3>
        </div>
        <Timer
          endsAt={question.endsAt}
          durationSec={question.durationSec}
          onComplete={() => setLocked(true)}
        />
      </div>

      {question.type === "MCQ" ? (
        <div className="grid grid-cols-2 gap-3">
          {question.options.map((opt) => (
            <button
              key={opt}
              onClick={() => setAnswer(opt)}
              className={`px-4 py-3 rounded-2xl border text-sm font-semibold transition ${
                answer === opt
                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-200"
                  : "border-white/10 text-slate-200 hover:border-white/30"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type one word"
          className="w-full rounded-2xl bg-background/60 border border-white/10 px-4 py-3 text-slate-100"
        />
      )}

      <button
        onClick={submit}
        disabled={locked || !answer.trim()}
        className="w-full py-3 rounded-2xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition disabled:opacity-50"
      >
        {locked ? "Time's up" : "Submit answer"}
      </button>

      {result && result.questionId === question.id && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
            result.locked
              ? "border-rose-500/40 text-rose-300 bg-rose-500/10"
              : result.isCorrect
                ? "border-emerald-500/40 text-emerald-300 bg-emerald-500/10"
                : "border-amber-400/40 text-amber-300 bg-amber-400/10"
          }`}
        >
          {result.locked
            ? "Answer locked. Time ended."
            : result.isCorrect
              ? "Correct!"
              : "Incorrect. Keep going."}
        </div>
      )}
    </div>
  );
}
