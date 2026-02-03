import { useEffect, useState } from "react";

const formatTime = (ms) => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (total % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export default function Timer({ endsAt, durationSec, onComplete }) {
  const totalMs = durationSec ? durationSec * 1000 : null;
  const [remaining, setRemaining] = useState(() =>
    endsAt ? new Date(endsAt).getTime() - Date.now() : 0,
  );

  useEffect(() => {
    if (!endsAt) return;
    let raf;
    const tick = () => {
      const next = new Date(endsAt).getTime() - Date.now();
      setRemaining(next);
      if (next <= 0) {
        if (typeof onComplete === "function") onComplete();
        return;
      }
      raf = window.setTimeout(tick, 200);
    };
    tick();
    return () => {
      window.clearTimeout(raf);
    };
  }, [endsAt, onComplete]);

  const percentage =
    totalMs && totalMs > 0
      ? Math.max(0, Math.min(100, (remaining / totalMs) * 100))
      : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-[0.3em]">
        <span>Time left</span>
        <span className="font-mono text-slate-200">{formatTime(remaining)}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full bg-emerald-400 transition-all"
          style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
        />
      </div>
    </div>
  );
}
