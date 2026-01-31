import React, { useState } from 'react';
import ClassroomLayout from './components/layout/ClassroomLayout';
import VideoPreview from './components/features/VideoPreview';
import ClassroomGrid from './components/features/ClassroomGrid';

function App() {
  const [user, setUser] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);

  const handleJoinSession = (userData) => {
    console.log("🚀 Joined:", userData);
    setUser(userData);
    setSessionActive(true);
  };

  const handleLeaveSession = () => {
    // 1. Stop all media tracks (turns off camera light)
    if (user?.stream) {
      user.stream.getTracks().forEach(track => track.stop());
    }
    // 2. Reset State
    setSessionActive(false);
    setUser(null);
    // 3. Force reload to clear socket listeners cleanly
    window.location.reload(); 
  };

  return (
    <ClassroomLayout 
      title={sessionActive ? "Class 101: Advanced AI" : "Lobby"} 
      userRole={user?.role || 'student'}
    >
      <div className="w-full h-full relative">
        
        {/* VIEW 1: LOBBY */}
        {!sessionActive && (
          <div className="h-full flex flex-col items-center justify-center">
             <VideoPreview onJoin={handleJoinSession} />
          </div>
        )}

        {/* VIEW 2: CLASSROOM */}
        {sessionActive && user && (
          <div className="h-full w-full animate-in fade-in zoom-in duration-500">
            <ClassroomGrid 
              localStream={user.stream} 
              user={user} 
              onLeave={handleLeaveSession}
            />
          </div>
        )}

      </div>
    </ClassroomLayout>
  );
}

export default App;