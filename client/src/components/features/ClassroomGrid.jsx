import React, { useEffect, useState, useRef, useCallback } from "react";
import { socket } from "../../services/socket";
import VideoPlayer from "./VideoPlayer";
import Peer from "simple-peer";
import {
  MicrophoneIcon,
  MicrophoneSlashIcon,
  VideoCameraIcon,
  VideoCameraSlashIcon,
  PhoneXMarkIcon,
} from "@heroicons/react/24/solid";
import { clsx } from "clsx";

const ClassroomGrid = ({ localStream, user, onLeave }) => {
  const [peers, setPeers] = useState([]);
  const peersRef = useRef([]);
  const roomId = "class-101";

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const createPeer = useCallback(
    (userToCall, callerID, stream) => {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream,
      });

      peer.on("signal", (signal) => {
        socket.emit("offer", {
          userToCall,
          offer: signal,
          username: user?.username,
        });
      });

      return peer;
    },
    [user?.username],
  );

  const addPeer = useCallback((incomingSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("answer", { answer: signal, callerId: callerID });
    });

    peer.signal(incomingSignal);
    return peer;
  }, []);

  useEffect(() => {
    if (!localStream || !user) return;

    socket.connect();

    socket.emit("join-room", {
      roomId,
      username: user.username,
      role: user.role,
    });

    socket.on("all-users", (users) => {
      const peersList = [];
      users.forEach((userID) => {
        const peer = createPeer(userID, socket.id, localStream);
        peersRef.current.push({ peerID: userID, peer });
        peersList.push({ peerID: userID, peer });
      });
      setPeers(peersList);
    });

    socket.on("user-joined", (payload) => {
      console.log("User joined:", payload);
    });

    socket.on("offer", (payload) => {
      const peer = addPeer(payload.offer, payload.callerId, localStream);
      peersRef.current.push({ peerID: payload.callerId, peer });
      setPeers((usersList) => [
        ...usersList,
        { peerID: payload.callerId, peer },
      ]);
    });

    socket.on("answer", (payload) => {
      const item = peersRef.current.find(
        (p) => p.peerID === payload.responderId,
      );
      if (item) item.peer.signal(payload.answer);
    });

    socket.on("ice-candidate", (payload) => {
      const item = peersRef.current.find((p) => p.peerID === payload.senderId);
      if (item && payload.candidate) {
        item.peer.signal(payload.candidate);
      }
    });

    socket.on("user-left", (id) => {
      const peerObj = peersRef.current.find((p) => p.peerID === id);
      if (peerObj) peerObj.peer.destroy();
      peersRef.current = peersRef.current.filter((p) => p.peerID !== id);
      setPeers((prev) => prev.filter((p) => p.peerID !== id));
    });

    return () => {
      socket.disconnect();
      peersRef.current.forEach((p) => p.peer.destroy());
      peersRef.current = [];
    };
  }, [addPeer, createPeer, localStream, user]);

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !micOn;
      });
      setMicOn(!micOn);
    }
  };

  const toggleCam = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !camOn;
      });
      setCamOn(!camOn);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 overflow-y-auto scrollbar-hide pb-24">
        <VideoPlayer
          stream={localStream}
          isLocal={true}
          username={user?.username}
          role={user?.role}
        />

        {peers.map((p) => (
          <VideoWrapper key={p.peerID} peer={p.peer} />
        ))}
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-background-paper/90 backdrop-blur-lg border border-white/10 px-6 py-3 rounded-2xl shadow-2xl z-50">
        <ControlButton
          onClick={toggleMic}
          isActive={micOn}
          icon={
            micOn ? (
              <MicrophoneIcon className="w-6 h-6" />
            ) : (
              <MicrophoneSlashIcon className="w-6 h-6" />
            )
          }
        />

        <ControlButton
          onClick={toggleCam}
          isActive={camOn}
          icon={
            camOn ? (
              <VideoCameraIcon className="w-6 h-6" />
            ) : (
              <VideoCameraSlashIcon className="w-6 h-6" />
            )
          }
        />

        <div className="w-px h-8 bg-white/10 mx-2"></div>

        <button
          onClick={onLeave}
          className="p-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-glow-primary transition-smooth active:scale-95"
        >
          <PhoneXMarkIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

const ControlButton = ({ onClick, icon, isActive }) => (
  <button
    onClick={onClick}
    className={clsx(
      "p-4 rounded-xl transition-smooth border",
      isActive
        ? "bg-slate-800 border-white/5 text-white hover:bg-slate-700"
        : "bg-rose-500/20 border-rose-500/50 text-rose-500",
    )}
  >
    {icon}
  </button>
);

const VideoWrapper = ({ peer }) => {
  const [stream, setStream] = useState(null);
  useEffect(() => {
    peer.on("stream", setStream);
  }, [peer]);

  if (!stream)
    return (
      <div className="aspect-video bg-slate-900/50 rounded-xl border border-white/5 animate-pulse flex items-center justify-center">
        <span className="text-xs text-slate-500 tracking-widest uppercase">
          Connecting...
        </span>
      </div>
    );

  return <VideoPlayer stream={stream} />;
};

export default ClassroomGrid;
