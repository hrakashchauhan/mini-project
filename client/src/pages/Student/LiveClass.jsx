import { useEffect, useRef, useState } from "react";
import { useUser, UserButton } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import FocusDetector from "../../components/FocusDetector";
import QuestionPopup from "./QuestionPopup";
import { SOCKET_URL } from "../../config";

export default function LiveClass() {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const sessionCode =
    location.state?.code || sessionStorage.getItem("focusai.sessionCode");
  const socketRef = useRef(null);
  const [focusStatus, setFocusStatus] = useState("CALIBRATING");
  const lastSentStatus = useRef("CALIBRATING");
  const [question, setQuestion] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, { autoConnect: true });
    socketRef.current = socket;

    socket.on("question:new", (data) => {
      setQuestion(data);
      setResult(null);
    });

    socket.on("answer:result", (data) => {
      setResult(data);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!sessionCode || !user) return;
    socketRef.current?.emit("join-room", sessionCode);
    socketRef.current?.emit("presence:join", {
      roomId: sessionCode,
      studentId: user.id,
      studentName: user.fullName || user.firstName,
    });
  }, [sessionCode, user]);

  const handleFocusUpdate = (newStatus) => {
    if (newStatus === lastSentStatus.current) return;
    setFocusStatus(newStatus);
    lastSentStatus.current = newStatus;
    if (!sessionCode || !user) return;
    socketRef.current?.emit("focus:update", {
      roomId: sessionCode,
      studentId: user.id,
      status: newStatus,
    });
  };

  const submitAnswer = (answer) => {
    if (!question || !sessionCode || !user) return;
    socketRef.current?.emit("answer:submit", {
      roomId: sessionCode,
      questionId: question.id,
      studentId: user.id,
      studentName: user.fullName || user.firstName,
      answer,
    });
  };

  const leave = () => {
    sessionStorage.removeItem("focusai.sessionCode");
    navigate("/student");
  };

  if (!sessionCode) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        Session not found. Please join again.
      </div>
    );
  }

  return (
    <div className="min-h-screen page-bg bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Student Live Class
            </p>
            <h1 className="text-3xl font-display font-bold">
              Session {sessionCode}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={leave}
              className="px-4 py-2 rounded-xl border border-white/20 text-white hover:border-white/40 transition"
            >
              Leave
            </button>
            <UserButton />
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <div className="space-y-6">
            <div className="glass-panel rounded-3xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Focus Status
                  </p>
                  <p
                    className={`text-2xl font-semibold mt-2 ${
                      focusStatus === "FOCUSED"
                        ? "text-emerald-300"
                        : "text-rose-400"
                    }`}
                  >
                    {focusStatus}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Student
                  </p>
                  <p className="text-lg font-semibold">
                    {user?.firstName || "Student"}
                  </p>
                </div>
              </div>
            </div>

            <QuestionPopup
              key={question?.id || "empty"}
              question={question}
              onSubmit={submitAnswer}
              result={result}
            />
          </div>

          <div className="space-y-6">
            <div className="glass-panel rounded-3xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold">Teacher spotlight</h3>
              <div className="mt-4 rounded-2xl border border-white/10 bg-background-surface/70 p-6 text-sm text-slate-400">
                Live teacher feed will appear here once streaming is enabled.
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold">Focus detector</h3>
              <p className="text-sm text-slate-400">
                This runs locally and is never uploaded.
              </p>
              <div className="mt-4">
                <FocusDetector onFocusUpdate={handleFocusUpdate} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
