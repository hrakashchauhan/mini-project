import React, { useEffect, useRef } from 'react';
import { clsx } from 'clsx';

const VideoPlayer = ({ stream, isLocal = false, username = 'User', role = 'student' }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden border border-white/10 shadow-lg group">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={clsx(
          "w-full h-full object-cover",
          isLocal && "transform scale-x-[-1]"
        )}
      />
      
      <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg border border-white/10">
        <p className="text-xs font-medium text-white">
          {username} {isLocal && '(You)'}
        </p>
        <p className="text-[10px] text-slate-400 capitalize">{role}</p>
      </div>
    </div>
  );
};

export default VideoPlayer;
