import Webcam from 'react-webcam';
import { useState, useEffect } from 'react';
import { UserButton, useUser } from "@clerk/clerk-react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function TeacherDashboard() {
  const { user } = useUser();
  const [sessionCode, setSessionCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState({});
  
  // Q&A State
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(""); 

  useEffect(() => {
    socket.on("receive-focus-update", (data) => {
      setStudents(prev => ({
        ...prev,
        [data.studentId]: {
          status: data.status,
          lastSeen: new Date().toLocaleTimeString()
        }
      }));
    });

    return () => socket.off("receive-focus-update");
  }, []);

  const createClass = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId: user.id })
      });
      const data = await response.json();
      
      if (data.success) {
        setSessionCode(data.code);
        socket.emit("join-room", data.code);
      }
    } catch (error) {
      console.error("Failed to create class:", error);
    }
    setLoading(false);
  };

  const sendQuestion = () => {
    if (!question || !answer || !sessionCode) {
      alert("Please enter both a question and answer.");
      return;
    }
    
    socket.emit("send-question", {
      roomId: sessionCode,
      questionText: question,
      answer: answer
    });
    setQuestion("");
    setAnswer("");
    alert("Question blasted to all students!");
  };

  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Teacher Dashboard 🍎</h1>
        <UserButton /> 
      </div>
      
      {!sessionCode ? (
        <div className="p-8 bg-white rounded-xl shadow-lg border border-slate-200 max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Create a New Session</h2>
          <button 
            onClick={createClass}
            disabled={loading}
            className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Start Class 🚀"}
          </button>
        </div>
      ) : (
        <div className="flex gap-8">
           {/* LEFT COLUMN: Controls & Video */}
           <div className="w-1/3 space-y-8">
              
              {/* TEACHER VIDEO PREVIEW (NEW) */}
              <div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                <div className="bg-black rounded-lg overflow-hidden relative">
                  <Webcam
                    audio={true}
                    className="w-full h-auto object-cover"
                    mirrored={true}
                  />
                  <div className="absolute bottom-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold animate-pulse">
                    LIVE 🔴
                  </div>
                  <div className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    Your Camera
                  </div>
                </div>
              </div>

              {/* Class Info */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Class Code</p>
                  <p className="text-4xl font-mono font-black text-indigo-600 tracking-widest mb-4">{sessionCode}</p>
                  <div className="h-px bg-slate-100 mb-4"></div>
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Active Students</p>
                  <p className="text-3xl font-bold text-slate-700">{Object.keys(students).length}</p>
              </div>

              {/* Question Blaster */}
              <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-indigo-900 mb-4">⚡ Quick Question</h3>
                <div className="space-y-3">
                  <input 
                    type="text" 
                    value={question} 
                    onChange={(e) => setQuestion(e.target.value)} 
                    placeholder="Question?" 
                    className="w-full p-3 rounded-lg border border-indigo-300" 
                  />
                  <input 
                    type="text" 
                    value={answer} 
                    onChange={(e) => setAnswer(e.target.value)} 
                    placeholder="Answer" 
                    className="w-full p-3 rounded-lg border border-indigo-300" 
                  />
                  <button onClick={sendQuestion} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700">
                    Blast 🚀
                  </button>
                </div>
              </div>
           </div>

           {/* RIGHT COLUMN: Student Grid */}
           <div className="flex-1">
             <h2 className="text-xl font-bold text-slate-700 mb-4">Live Student Monitoring</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(students).length === 0 ? (
                  <p className="text-slate-400 italic col-span-full">Waiting for students to join...</p>
                ) : (
                  Object.entries(students).map(([studentId, info]) => (
                    <div key={studentId} className={`p-4 rounded-xl border-l-8 shadow-sm bg-white ${info.status === 'FOCUSED' ? 'border-green-500' : 'border-red-500'}`}>
                      <h3 className="font-bold text-slate-700 truncate">Student {studentId.slice(0, 5)}</h3>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${info.status === 'FOCUSED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {info.status}
                      </span>
                      <p className="text-xs text-slate-400 mt-1">Last update: {info.lastSeen}</p>
                    </div>
                  ))
                )}
             </div>
           </div>
        </div>
      )}
    </div>
  );
}