import io from 'socket.io-client';

// Points to your backend
const SOCKET_URL = 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false, // We connect manually when the user clicks "Join"
});

// Helper to start connection
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};