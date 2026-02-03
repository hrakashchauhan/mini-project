import { SignInButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function Landing() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen page-bg bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-glow shadow-glow-primary flex items-center justify-center font-bold text-white text-lg">
              F
            </div>
            <span className="text-lg font-display tracking-wide">FocusAI</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-sm text-slate-400">
            <span>Teacher tools</span>
            <span className="text-slate-600">•</span>
            <span>Student focus</span>
            <span className="text-slate-600">•</span>
            <span>Live questions</span>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight">
              Real‑time classroom focus,
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-glow">
                {" "}
                made visible.
              </span>
            </h1>
            <p className="text-lg text-slate-300 max-w-xl">
              FocusAI gives teachers instant clarity and gives students a clean,
              motivating live dashboard. Run sessions, ask questions, and keep
              attention high.
            </p>
            <div className="flex flex-wrap gap-4">
              {!isSignedIn ? (
                <>
                  <SignInButton mode="modal" forceRedirectUrl="/teacher">
                    <button className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition shadow-glow-primary">
                      Teacher Login
                    </button>
                  </SignInButton>

                  <SignInButton mode="modal" forceRedirectUrl="/student">
                    <button className="px-6 py-3 bg-white/10 border border-white/15 text-white rounded-xl font-semibold hover:border-white/30 transition">
                      Student Login
                    </button>
                  </SignInButton>
                </>
              ) : (
                <>
                  <Link
                    to="/teacher"
                    className="px-6 py-3 bg-primary text-white rounded-xl font-semibold shadow-glow-primary"
                  >
                    Go to Teacher Dashboard
                  </Link>
                  <Link
                    to="/student"
                    className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold"
                  >
                    Go to Student Dashboard
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-soft-lg animate-float-slow">
            <div className="space-y-5">
              <div className="text-xs uppercase tracking-widest text-slate-400">
                What you get
              </div>
              <div className="grid gap-4">
                <div className="p-4 rounded-2xl bg-background-surface/70 border border-white/5">
                  <p className="font-semibold">Live focus tracking</p>
                  <p className="text-sm text-slate-400">
                    Instantly see engagement changes in real time.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-background-surface/70 border border-white/5">
                  <p className="font-semibold">Session history</p>
                  <p className="text-sm text-slate-400">
                    Save and review class outcomes after each session.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-background-surface/70 border border-white/5">
                  <p className="font-semibold">Questions and answers</p>
                  <p className="text-sm text-slate-400">
                    Ask live questions and capture student responses.
                  </p>
                </div>
              </div>
              <div className="text-xs text-slate-500">
                Tip: Teachers generate the class code, students join with it.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "1. Create a session",
              body: "Teachers start a session and get a shareable class code.",
            },
            {
              title: "2. Students join",
              body: "Students enter the class code and see their live focus.",
            },
            {
              title: "3. Ask & answer",
              body: "Teachers ask questions; students respond instantly.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-2xl border border-white/10 bg-background-paper/60"
            >
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-slate-400 mt-2">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
