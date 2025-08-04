import { io } from 'socket.io-client';
import { store } from '../redux/store';
import { 
  addNewMessage, 
  updateMessageRead, 
  deleteMessageFromState,
  setTypingStatus 
} from '../redux/APIs/slices/messageSlice';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  // Initialize socket connection
  connect(userId, userType) {
    if (this.socket) {
      this.disconnect();
    }

    const serverUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:8080';
    
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      timeout: 20000,
    });

    // Connection events
    this.socket.on('connect', () => {
      console.log('🔌 Socket connected:', this.socket.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Join user room
      this.socket.emit('join', { userId, userType });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔌 Socket connection error:', error);
      this.isConnected = false;
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔌 Socket reconnected after', attemptNumber, 'attempts');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Re-join user room after reconnection
      this.socket.emit('join', { userId, userType });
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔌 Socket reconnection attempt:', attemptNumber);
      this.reconnectAttempts = attemptNumber;
    });

    this.socket.on('reconnect_failed', () => {
      console.error('🔌 Socket reconnection failed after', this.maxReconnectAttempts, 'attempts');
    });

    // Message events
    this.socket.on('new_message', (data) => {
      console.log('📨 New message received:', data);
      store.dispatch(addNewMessage(data));
    });

    this.socket.on('messages_read', (data) => {
      console.log('👁️ Messages read:', data);
      store.dispatch(updateMessageRead(data));
    });

    this.socket.on('message_deleted', (data) => {
      console.log('🗑️ Message deleted:', data);
      store.dispatch(deleteMessageFromState(data));
    });

    // Typing events
    this.socket.on('typing_start', (data) => {
      console.log('⌨️ User started typing:', data);
      store.dispatch(setTypingStatus({
        conversationId: data.conversationId,
        isTyping: true,
        userId: data.senderId
      }));
    });

    this.socket.on('typing_stop', (data) => {
      console.log('⌨️ User stopped typing:', data);
      store.dispatch(setTypingStatus({
        conversationId: data.conversationId,
        isTyping: false,
        userId: data.senderId
      }));
    });

    // Message reaction events
    this.socket.on('message_reaction', (data) => {
      console.log('😀 Message reaction:', data);
      // Handle message reactions if needed
    });

    return this.socket;
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('🔌 Socket disconnected');
    }
  }

  // Send typing start event
  emitTypingStart(conversationId, receiverId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing_start', { conversationId, receiverId });
    }
  }

  // Send typing stop event
  emitTypingStop(conversationId, receiverId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing_stop', { conversationId, receiverId });
    }
  }

  // Send message reaction
  emitMessageReaction(messageId, reaction) {
    if (this.socket && this.isConnected) {
      this.socket.emit('message_reaction', { messageId, reaction });
    }
  }

  // Check connection status
  isSocketConnected() {
    return this.socket && this.isConnected;
  }

  // Get socket instance
  getSocket() {
    return this.socket;
  }

  // Reconnect manually
  reconnect(userId, userType) {
    if (this.socket) {
      this.disconnect();
    }
    return this.connect(userId, userType);
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;

 