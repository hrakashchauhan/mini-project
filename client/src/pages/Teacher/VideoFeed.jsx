import Webcam from "react-webcam";

export default function VideoFeed() {
  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/10">
      <h3 className="text-lg font-semibold mb-4">Teacher camera</h3>
      <div className="rounded-2xl overflow-hidden border border-white/10">
        <Webcam
          audio={true}
          className="w-full h-auto object-cover"
          mirrored={true}
        />
      </div>
      <p className="text-xs text-slate-400 mt-3">
        Students will see this feed during the session.
      </p>
    </div>
  );
}
