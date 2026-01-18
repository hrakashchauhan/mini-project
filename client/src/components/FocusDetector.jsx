import { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

export default function FocusDetector({ onFocusUpdate }) {
  const webcamRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. USE GLOBAL VARIABLES (Window)
    // The libraries are now loaded in index.html, so we access them via 'window'
    const faceMesh = new window.FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      },
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults(onResults);

    // 2. Initialize Camera using global 'window.Camera'
    if (webcamRef.current && webcamRef.current.video) {
      const camera = new window.Camera(webcamRef.current.video, {
        onFrame: async () => {
          if (webcamRef.current && webcamRef.current.video) {
            await faceMesh.send({ image: webcamRef.current.video });
          }
        },
        width: 640,
        height: 480,
      });
      camera.start();
      setIsLoaded(true);
    }
  }, []);

  const onResults = (results) => {
    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      onFocusUpdate("FOCUSED");
    } else {
      onFocusUpdate("DISTRACTED");
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg bg-black border-4 border-slate-800">
      <Webcam
        ref={webcamRef}
        className="w-full h-auto"
        mirrored={true}
        screenshotFormat="image/jpeg"
      />
      
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 text-white font-bold">
          Loading AI Model... 🧠
        </div>
      )}
      
      <div className="absolute bottom-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold animate-pulse">
        LIVE ANALYSIS
      </div>
    </div>
  );
}