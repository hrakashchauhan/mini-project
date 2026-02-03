import { useRef, useEffect, useState, useCallback } from "react";
import Webcam from "react-webcam";

export default function FocusDetector({ onFocusUpdate }) {
  const webcamRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  const handleResults = useCallback(
    (results) => {
      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        if (typeof onFocusUpdate === "function") {
          onFocusUpdate("FOCUSED");
        }
      } else if (typeof onFocusUpdate === "function") {
        onFocusUpdate("DISTRACTED");
      }
    },
    [onFocusUpdate],
  );

  useEffect(() => {
    let camera;
    let faceMesh;
    let cancelled = false;

    const init = () => {
      if (cancelled) return;

      if (!window.FaceMesh || !window.Camera) {
        setError("AI dependencies failed to load. Check your network.");
        return;
      }

      const videoEl = webcamRef.current?.video;
      if (!videoEl || videoEl.readyState < 2) {
        requestAnimationFrame(init);
        return;
      }

      try {
        faceMesh = new window.FaceMesh({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        faceMesh.onResults(handleResults);

        camera = new window.Camera(videoEl, {
          onFrame: async () => {
            if (webcamRef.current?.video) {
              await faceMesh.send({ image: webcamRef.current.video });
            }
          },
          width: 640,
          height: 480,
        });

        camera.start();
        setIsLoaded(true);
        setError(null);
      } catch (err) {
        console.error("Failed to initialize FaceMesh:", err);
        setError("Unable to start AI model.");
      }
    };

    init();

    return () => {
      cancelled = true;
      if (camera && typeof camera.stop === "function") camera.stop();
      if (faceMesh && typeof faceMesh.close === "function") faceMesh.close();
    };
  }, [handleResults]);

  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg bg-black border-4 border-slate-800">
      <Webcam
        ref={webcamRef}
        className="w-full h-auto"
        mirrored={true}
        screenshotFormat="image/jpeg"
      />

      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 text-white font-bold">
          Loading AI model...
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 text-red-300 font-bold text-center px-6">
          {error}
        </div>
      )}

      <div className="absolute bottom-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold animate-pulse">
        LIVE ANALYSIS
      </div>
    </div>
  );
}
