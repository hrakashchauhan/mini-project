import React from 'react';
import { 
  VideoCameraIcon, 
  ChartBarIcon, 
  Cog6ToothIcon, 
  SignalIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx'; // Utility for conditional classes

// The Master Shell for Module 1
const ClassroomLayout = ({ children, className, title = "Live Session", userRole = "student" }) => {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative selection:bg-primary selection:text-white">
      
      {/* 1. LEFT SIDEBAR (Navigation & Controls) */}
      <aside className="w-20 hidden md:flex flex-col items-center py-6 glass-panel border-r-0 border-y-0 border-l-0 border-r-white/5 z-50">
        {/* Brand */}
        <div className="w-10 h-10 mb-8 rounded-xl bg-gradient-to-br from-primary to-indigo-600 shadow-glow shadow-primary/50 flex items-center justify-center font-bold text-white text-xl">
          F
        </div>

        {/* Menu */}
        <nav className="flex-1 flex flex-col gap-4 w-full px-3">
          <NavItem icon={<VideoCameraIcon className="w-6 h-6" />} active label="Classroom" />
          {userRole === 'teacher' && (
             <NavItem icon={<ChartBarIcon className="w-6 h-6" />} label="Live Analytics" />
          )}
          <div className="flex-1" /> {/* Spacer */}
          <NavItem icon={<Cog6ToothIcon className="w-6 h-6" />} label="Settings" />
        </nav>

        {/* User Status */}
        <div className="mt-auto pt-6 border-t border-white/5 w-full flex justify-center">
           <div className={clsx(
             "w-10 h-10 rounded-full ring-2 transition-smooth cursor-pointer overflow-hidden",
             userRole === 'teacher' ? "ring-primary" : "ring-white/10"
           )}>
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userRole}`} alt="User" />
           </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative min-w-0">
        
        {/* TOP HUD (Heads Up Display) */}
        <header className="h-16 w-full flex items-center justify-between px-6 border-b border-white/5 bg-background/40 backdrop-blur-sm z-40">
          
          {/* Class Info */}
          <div className="flex items-center gap-4">
            <h1 className="text-sm md:text-base font-semibold tracking-wide text-slate-100 flex items-center gap-2">
              <AcademicCapIcon className="w-5 h-5 text-primary" />
              {title}
            </h1>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-status-distracted/10 text-status-distracted border border-status-distracted/20 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-status-distracted" />
              REC
            </span>
          </div>

          {/* System Status */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs text-slate-400" title="Network">
              <SignalIcon className="w-4 h-4 text-emerald-500" />
              <span className="hidden sm:inline">24ms</span>
            </div>
            
            {/* The "Authoritative" Timer Display */}
            <div className="font-mono text-sm text-slate-300 bg-background-paper px-3 py-1 rounded border border-white/10 shadow-sm">
              00:45:12
            </div>
          </div>
        </header>

        {/* 3. DYNAMIC STAGE (Video Grid / Handshake) */}
        <div className={clsx("flex-1 p-0 overflow-hidden relative", className)}>
          {children}
        </div>

      </main>
    </div>
  );
};

// Internal Helper for Sidebar Buttons
const NavItem = ({ icon, active, label }) => (
  <button 
    title={label}
    className={clsx(
      "p-3 rounded-xl transition-smooth group relative w-full flex justify-center",
      active 
        ? "bg-primary/10 text-primary shadow-[0_0_20px_-5px_rgba(124,58,237,0.3)]" 
        : "text-slate-500 hover:bg-white/5 hover:text-slate-200"
    )}
  >
    {icon}
  </button>
);

export default ClassroomLayout;