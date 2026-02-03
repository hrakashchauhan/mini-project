export default function Leaderboard({ items = [] }) {
  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/10">
      <h3 className="text-lg font-semibold">Live leaderboard</h3>
      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-slate-400">
            Leaderboard will appear after the first question.
          </p>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id || item.studentId}
              className="flex items-center justify-between rounded-2xl bg-background-surface/70 border border-white/5 px-4 py-3"
            >
              <span className="text-sm text-slate-400">#{index + 1}</span>
              <span className="text-slate-200 font-semibold flex-1 ml-3">
                {item.name || item.studentId?.slice(0, 6)}
              </span>
              <span className="text-emerald-300 font-mono">
                {item.score ?? 0}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
