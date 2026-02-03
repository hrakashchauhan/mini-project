export default function MissingConfig() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-8">
      <div className="max-w-lg text-center space-y-3">
        <h1 className="text-2xl font-bold">Clerk key missing</h1>
        <p className="text-slate-400">
          Set{" "}
          <code className="px-1 py-0.5 bg-slate-800 rounded">
            VITE_CLERK_PUBLISHABLE_KEY
          </code>{" "}
          in your environment and restart the dev server.
        </p>
      </div>
    </div>
  );
}
