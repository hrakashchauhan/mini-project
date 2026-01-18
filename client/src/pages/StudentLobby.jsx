import { useState, useEffect, useRef } from 'react';
import { useUser, UserButton } from "@clerk/clerk-react";
import { io } from "socket.io-client";
import FocusDetector from '../components/FocusDetector';

// Connect to the Backend Radio
const socket = io("http://localhost:5000");

export default function StudentLobby() {
  const { user } = useUser();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState({ type: '', message: '' });
  const [joined, setJoined] = useState(false);
  
  // NEW: State for Focus Status
  const [focusStatus, setFocusStatus] = useState("CALIBRATING");
  const lastSentStatus = useRef("CALIBRATING"); // To prevent spamming the server

  useEffect(() => {
    socket.on("connect", () => {
      console.log("⚡ Front-end connected to Server with ID:", socket.id);
    });
  }, []);

  const joinClass = async () => {
    if (!code) return;
    setStatus({ type: '', message: '' });

    try {
      // 1. Database Handshake
      const response = await fetch('http://localhost:5000/api/join-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim().toUpperCase(), studentId: user.id })
      });

      const data = await response.json();

      if (data.success) {
        // 2. Socket Handshake
        socket.emit("join-room", data.code); // Join the room
        setStatus({ type: 'success', message: "🎉 Connected to Live Class!" });
        setJoined(true);
      } else {
        setStatus({ type: 'error', message: data.message });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: "Server connection failed." });
    }
  };

  // NEW: Function to handle updates from the AI Camera
  const handleFocusUpdate = (newStatus) => {
    // Only update if the status is DIFFERENT (to save bandwidth)
    if (newStatus !== lastSentStatus.current) {
      setFocusStatus(newStatus);
      lastSentStatus.current = newStatus;

      // 📡 SEND TO TEACHER
      socket.emit("focus-update", {
        roomId: code,
        studentId: user.id, // In a real app, send user.fullName too!
        status: newStatus
      });
      
      console.log(`📡 Sent Update: ${newStatus}`);
    }
  };

  // 3. SHOW THE "LIVE" SCREEN
  if (joined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="w-full max-w-5xl p-6 flex gap-8 items-start">
          
          {/* LEFT SIDE: Status Info */}
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Class is Live 🔴</h1>
              <p className="text-slate-400">Your focus is being analyzed in real-time.</p>
            </div>

            {/* DYNAMIC FOCUS BADGE */}
            <div className={`p-8 rounded-2xl border-4 transition-all duration-500 text-center ${
              focusStatus === 'FOCUSED' 
                ? 'border-green-500 bg-green-500/10' 
                : 'border-red-500 bg-red-500/10'
            }`}>
              <p className="text-sm uppercase tracking-widest font-bold mb-2 text-slate-400">CURRENT STATUS</p>
              <h2 className={`text-5xl font-black tracking-tighter ${
                focusStatus === 'FOCUSED' ? 'text-green-400' : 'text-red-500'
              }`}>
                {focusStatus}
              </h2>
            </div>
            
            <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Session Code</p>
              <span className="text-4xl font-mono font-bold tracking-widest text-white">{code}</span>
            </div>
          </div>

          {/* RIGHT SIDE: The AI Camera */}
          <div className="w-[480px]">
             {/* Pass our new handler function to the component */}
            <FocusDetector onFocusUpdate={handleFocusUpdate} />
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
      <div className="absolute top-5 right-5"><UserButton /></div>
      <div className="p-8 bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <h1 className="text-2xl font-bold text-center mb-6 text-slate-800">Join Classroom 🎓</h1>
        <input 
          type="text" 
          placeholder="ENTER CODE" 
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-4 border border-slate-300 rounded-lg mb-4 text-center text-2xl tracking-widest uppercase font-bold outline-none focus:border-indigo-500"
        />
        {status.message && (
          <p className={`text-center mb-4 font-medium ${status.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
            {status.message}
          </p>
        )}
        <button onClick={joinClass} className="w-full py-4 bg-green-500 text-white rounded-lg font-bold text-lg hover:bg-green-600 transition">
          Enter Class
        </button>
      </div>
    </div>
  );
}