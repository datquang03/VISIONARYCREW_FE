import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080';

// Tạo một instance socket duy nhất
export const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  withCredentials: true
}); 