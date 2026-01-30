import React, { useState } from 'react';
import ClassroomLayout from './components/layout/ClassroomLayout';
import VideoPreview from './components/features/VideoPreview';

function App() {
  // GLOBAL STATE
  const [user, setUser] = useState(null); // { username, role, stream }
  const [sessionActive, setSessionActive] = useState(false);

  // HANDLER: When user clicks "Enter Classroom"
  const handleJoinSession = (userData) => {
    console.log("User Joined:", userData);
    setUser(userData);
    setSessionActive(true);
  };

  return (
    <ClassroomLayout 
      title={sessionActive ? "Class 101: Deep Work" : "Lobby"} 
      userRole={user?.role || 'student'}
    >
      
      <div className="w-full h-full flex flex-col items-center justify-center">
        
        {/* 1. LOBBY: If not joined yet, show the Handshake/Preview */}
        {!sessionActive && (
          <VideoPreview onJoin={handleJoinSession} />
        )}

        {/* 2. CLASSROOM: If joined, show the Welcome (Grid coming next) */}
        {sessionActive && (
          <div className="glass-panel p-10 rounded-2xl border-dashed border-2 border-slate-700/50 flex flex-col items-center text-center max-w-lg animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-3xl">
              👋
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome, {user.username}!
            </h2>
            <p className="text-slate-400">
              You are logged in as a <span className="text-primary font-semibold capitalize">{user.role}</span>.
              <br/>
              Stream Status: <span className="text-emerald-400">Active</span>
            </p>
            <div className="mt-6 px-4 py-2 bg-slate-800 rounded-lg text-sm font-mono text-slate-500 border border-white/5">
              Part 3: Video Grid Loading...
            </div>
          </div>
        )}

      </div>

    </ClassroomLayout>
  );
}

export default App;