import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080';

// Tạo một instance socket duy nhất
export const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000
});

// Debug socket events
socket.on('connect', () => {
  console.log('🔍 Socket connected:', socket.id);
});

socket.on('disconnect', () => {
  console.log('🔍 Socket disconnected:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('🔍 Socket connection error:', error);
});

 