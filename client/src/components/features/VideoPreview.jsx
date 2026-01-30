import React, { useState, useEffect, useRef } from 'react';
import { 
  UserCircleIcon, 
  VideoCameraIcon, 
  VideoCameraSlashIcon, 
  MicrophoneIcon, 
  MicrophoneSlashIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

const VideoPreview = ({ onJoin }) => {
  // --- STATE ---
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  
  // User Preferences
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  
  // Form Data
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('student'); // 'student' or 'teacher'

  const videoRef = useRef(null);

  // --- EFFECT: Initialize Camera ---
  useEffect(() => {
    const initCamera = async () => {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        setStream(userStream);
        if (videoRef.current) {
          videoRef.current.srcObject = userStream;
        }
        setError(null);
      } catch (err) {
        console.error("Camera Error:", err);
        setError("Camera access denied. Please check permissions.");
      }
    };

    initCamera();

    // Cleanup: Stop stream on unmount
    return () => {
      if (userStream) {
        userStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // --- HANDLERS ---
  const toggleCam = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => track.enabled = !isCamOn);
      setIsCamOn(!isCamOn);
    }
  };

  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => track.enabled = !isMicOn);
      setIsMicOn(!isMicOn);
    }
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (!username) return;
    // Pass the stream and user data up to the App
    onJoin({ username, role, stream, isMicOn, isCamOn });
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-5xl animate-in fade-in zoom-in duration-500">
      
      {/* 1. LEFT PANEL: The Camera Preview */}
      <div className="relative w-full max-w-md aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 group">
        
        {/* The Live Video Element */}
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          playsInline 
          className={clsx("w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-300", !isCamOn && "opacity-0")} 
        />

        {/* Fallback Avatar when Camera is Off */}
        {!isCamOn && (
          <div className="absolute inset-0 flex items-center justify-center bg-background-surface">
            <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center animate-pulse-slow">
              <span className="text-4xl">stopped</span>
            </div>
          </div>
        )}

        {/* Media Controls Toolbar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 p-2 rounded-full glass-panel opacity-0 group-hover:opacity-100 transition-smooth">
          <button 
            onClick={toggleMic}
            className={clsx("p-3 rounded-full transition-all", isMicOn ? "bg-slate-700 hover:bg-slate-600" : "bg-status-distracted text-white")}
          >
            {isMicOn ? <MicrophoneIcon className="w-5 h-5"/> : <MicrophoneSlashIcon className="w-5 h-5"/>}
          </button>
          
          <button 
            onClick={toggleCam}
            className={clsx("p-3 rounded-full transition-all", isCamOn ? "bg-slate-700 hover:bg-slate-600" : "bg-status-distracted text-white")}
          >
            {isCamOn ? <VideoCameraIcon className="w-5 h-5"/> : <VideoCameraSlashIcon className="w-5 h-5"/>}
          </button>
        </div>

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-status-distracted p-6 text-center font-medium">
            {error}
          </div>
        )}
      </div>

      {/* 2. RIGHT PANEL: The "Handshake" Form */}
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Get Started</h2>
          <p className="text-slate-400 text-sm">Choose your identity to join the session.</p>
        </div>

        <form onSubmit={handleJoin} className="space-y-6">
          
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 p-1 bg-background rounded-xl border border-white/5">
            {['student', 'teacher'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={clsx(
                  "py-2.5 text-sm font-medium rounded-lg capitalize transition-all",
                  role === r 
                    ? "bg-background-surface text-primary shadow-sm" 
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Display Name</label>
            <div className="relative">
              <UserCircleIcon className="w-5 h-5 absolute left-3 top-3 text-slate-500" />
              <input 
                type="text" 
                placeholder="Ex. Alex Chen"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-background/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600"
                required
              />
            </div>
          </div>

          {/* Action Button */}
          <button 
            type="submit"
            disabled={!username}
            className="w-full py-3 bg-primary hover:bg-primary-hover active:scale-95 text-white font-semibold rounded-xl shadow-glow transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>Enter Classroom</span>
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
          </button>

        </form>
      </div>

    </div>
  );
};

export default VideoPreview;