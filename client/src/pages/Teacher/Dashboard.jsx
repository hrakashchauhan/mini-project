import { useEffect, useMemo, useRef, useState } from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { io } from "socket.io-client";
import LivePanel from "./LivePanel";
import VideoFeed from "./VideoFeed";
import Leaderboard from "../../components/Leaderboard";
import { API_BASE_URL, SOCKET_URL } from "../../config";

const HISTORY_KEY = "focusai.teacher.history";

const buildId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export default function Dashboard() {
  const { user, isLoaded, isSignedIn } = useUser();
  const socketRef = useRef(null);
  const [sessionCode, setSessionCode] = useState(null);
  const [sessionStart, setSessionStart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState({});
  const [focusMap, setFocusMap] = useState({});
  const [questionHistory, setQuestionHistory] = useState([]);
  const [answersByQuestion, setAnswersByQuestion] = useState({});
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const socket = io(SOCKET_URL, { autoConnect: true });
    socketRef.current = socket;

    socket.on("presence:update", (data) => {
      setStudents((prev) => ({
        ...prev,
        [data.studentId]: {
          name: data.studentName || data.studentId.slice(0, 6),
          status: data.status,
          lastSeen: data.at,
        },
      }));
    });

    socket.on("focus:receive", (data) => {
      setFocusMap((prev) => ({
        ...prev,
        [data.studentId]: {
          status: data.status,
          lastSeen: new Date().toISOString(),
        },
      }));
    });

    socket.on("question:new", (data) => {
      setQuestionHistory((prev) => [data, ...prev]);
    });

    socket.on("answer:update", (data) => {
      setAnswersByQuestion((prev) => {
        const entry = prev[data.questionId] || {
          total: 0,
          correct: 0,
          answers: [],
        };
        return {
          ...prev,
          [data.questionId]: {
            total: entry.total + (data.locked ? 0 : 1),
            correct: entry.correct + (data.isCorrect ? 1 : 0),
            answers: [data, ...entry.answers],
          },
        };
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const activeStudents = Object.keys(students).length;
  const focusedCount = Object.entries(focusMap).filter(
    ([, value]) => value.status === "FOCUSED",
  ).length;
  const focusRate = activeStudents
    ? Math.round((focusedCount / activeStudents) * 100)
    : 0;

  const leaderboard = useMemo(() => {
    const scores = {};
    Object.values(answersByQuestion).forEach((item) => {
      item.answers.forEach((ans) => {
        if (!ans.studentId || ans.locked) return;
        scores[ans.studentId] = scores[ans.studentId] || {
          id: ans.studentId,
          name: ans.studentName || ans.studentId.slice(0, 6),
          score: 0,
        };
        scores[ans.studentId].score += ans.isCorrect ? 10 : 2;
      });
    });
    return Object.values(scores).sort((a, b) => b.score - a.score).slice(0, 5);
  }, [answersByQuestion]);

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

  const createClass = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/create-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId: user.id }),
      });
      const data = await response.json();

      if (data.success) {
        setSessionCode(data.code);
        setSessionStart(new Date().toISOString());
        setStudents({});
        setFocusMap({});
        setQuestionHistory([]);
        setAnswersByQuestion({});
        socketRef.current?.emit("join-room", data.code);
      }
    } catch (error) {
      console.error("Failed to create class:", error);
    }
    setLoading(false);
  };

  const endClass = () => {
    if (!sessionCode) return;
    const endedAt = new Date().toISOString();
    const newEntry = {
      id: buildId(),
      sessionCode,
      startedAt: sessionStart,
      endedAt,
      totalStudents: activeStudents,
      focusUpdates: Object.keys(focusMap).length,
      questionsAsked: questionHistory.length,
      answersReceived: Object.values(answersByQuestion).reduce(
        (acc, item) => acc + item.total,
        0,
      ),
    };
    const next = [newEntry, ...history].slice(0, 12);
    setHistory(next);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    setSessionCode(null);
    setSessionStart(null);
  };

  const sendQuestion = (payload) => {
    if (!sessionCode || !user) return;
    const {
      type,
      questionText,
      correctAnswer,
      options,
      durationSec,
    } = payload;

    socketRef.current?.emit("question:send", {
      roomId: sessionCode,
      teacherId: user.id,
      type,
      questionText,
      options,
      correctAnswer,
      durationSec,
    });
  };

  return (
    <div className="min-h-screen page-bg bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Teacher Dashboard
            </p>
            <h1 className="text-4xl font-display font-bold">
              Welcome back, {user?.firstName || "Teacher"}
            </h1>
          </div>
          <UserButton />
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <LivePanel
            sessionCode={sessionCode}
            loading={loading}
            metrics={{ activeStudents, focusRate }}
            onCreateSession={createClass}
            onEndSession={endClass}
            onSendQuestion={sendQuestion}
            answersByQuestion={answersByQuestion}
            questionHistory={questionHistory}
          />

          <div className="space-y-6">
            <VideoFeed />

            <div className="glass-panel rounded-3xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold">Live student list</h3>
              <div className="mt-4 space-y-3 max-h-56 overflow-y-auto pr-2">
                {Object.keys(students).length === 0 ? (
                  <p className="text-sm text-slate-400">
                    Students will appear here as they join.
                  </p>
                ) : (
                  Object.entries(students).map(([id, info]) => (
                    <div
                      key={id}
                      className="rounded-2xl bg-background-surface/70 border border-white/5 p-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-slate-100">
                          {info.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {info.status}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          focusMap[id]?.status === "FOCUSED"
                            ? "bg-emerald-500/20 text-emerald-200"
                            : "bg-rose-500/20 text-rose-200"
                        }`}
                      >
                        {focusMap[id]?.status || "UNKNOWN"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Leaderboard items={leaderboard} />

            <div className="glass-panel rounded-3xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold">Session history</h3>
              <div className="mt-4 space-y-3 max-h-56 overflow-y-auto pr-2">
                {history.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    End a session to save it here.
                  </p>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl bg-background-surface/70 border border-white/5 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">Session {item.sessionCode}</p>
                        <span className="text-xs text-slate-400">
                          {new Date(item.endedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-300">
                        <span>Students: {item.totalStudents}</span>
                        <span>Focus updates: {item.focusUpdates}</span>
                        <span>Questions: {item.questionsAsked}</span>
                        <span>Answers: {item.answersReceived}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
