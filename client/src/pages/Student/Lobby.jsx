import { useState } from "react";
import { useUser, UserButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";

export default function Lobby() {
  const { user, isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center text-center p-6">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold">Sign in required</h1>
          <p className="text-slate-400">Return to the landing page to sign in.</p>
        </div>
      </div>
    );
  }

  const joinClass = async () => {
    if (!code || !user) return;
    setStatus({ type: "", message: "" });

    const normalizedCode = code.trim().toUpperCase();

    try {
      const response = await fetch(`${API_BASE_URL}/api/join-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: normalizedCode, studentId: user.id }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ type: "success", message: "Connected to live class." });
        sessionStorage.setItem("focusai.sessionCode", normalizedCode);
        navigate("/student/live", { state: { code: normalizedCode } });
      } else {
        setStatus({ type: "error", message: data.message });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Server connection failed." });
    }
  };

  return (
    <div className="min-h-screen page-bg bg-slate-950 text-slate-100 flex items-center justify-center">
      <div className="w-full max-w-lg p-8 glass-panel rounded-3xl border border-white/10 shadow-soft-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Student Lobby
            </p>
            <h1 className="text-3xl font-display font-bold">Join a class</h1>
          </div>
          <UserButton />
        </div>
        <input
          type="text"
          placeholder="ENTER CODE"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-4 border border-white/10 rounded-2xl mb-4 text-center text-2xl tracking-widest uppercase font-semibold bg-background-surface/80 text-slate-100"
        />
        {status.message && (
          <p
            className={`text-center mb-4 font-medium ${
              status.type === "success" ? "text-emerald-300" : "text-rose-400"
            }`}
          >
            {status.message}
          </p>
        )}
        <button
          onClick={joinClass}
          className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-semibold text-lg hover:bg-emerald-600 transition"
        >
          Enter class
        </button>
      </div>
    </div>
  );
}
