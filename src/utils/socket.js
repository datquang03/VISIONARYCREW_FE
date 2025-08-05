import { io } from 'socket.io-client';
import { store } from '../redux/store';
import { 
  addNewMessage, 
  updateMessageRead, 
  deleteMessageFromState,
  setTypingStatus,
  getConversations,
  getConversationUnlockStatus
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
      console.log('🔌🔌🔌 SOCKET CONNECTED! 🔌🔌🔌');
      console.log('🔌 Socket connected:', {
        socketId: this.socket.id,
        userId,
        userType,
        serverUrl
      });
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Join user room
      console.log('🏠 Joining room:', `user_${userId}`);
      this.socket.emit('join', { userId, userType });
      
      // Add a listener to confirm room join
      this.socket.on('room_joined', (data) => {
        console.log('✅ Successfully joined room:', data);
      });
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
      console.log('🎉🎉🎉 FRONTEND RECEIVED NEW MESSAGE! 🎉🎉🎉');
      console.log('📨 NEW MESSAGE RECEIVED:', {
        messageId: data.message?._id,
        from: data.message?.senderName,
        to: data.message?.receiverName,
        content: data.message?.content?.substring(0, 50) + '...',
        conversationId: data.conversationId,
        fullData: data
      });
      
      store.dispatch(addNewMessage(data));
      
      // Reload conversations to update conversation list (with a small delay to ensure message is saved)
      setTimeout(() => {
        console.log('🔄 Reloading conversations after new message');
        store.dispatch(getConversations());
        
        // If this is a new conversation (welcome message), refresh unlock status
        const state = store.getState();
        const { user, doctor } = state.authSlice;
        const currentUserId = user?._id || doctor?._id;
        const currentUserType = user ? 'User' : 'Doctor';
        
        if (data.message && currentUserId) {
          const otherUserId = data.message.senderId._id === currentUserId 
            ? data.message.receiverId._id 
            : data.message.senderId._id;
          
          if (currentUserType === 'User') {
            // User receiving message from doctor
            store.dispatch(getConversationUnlockStatus({ 
              userId: currentUserId, 
              doctorId: otherUserId 
            }));
          } else {
            // Doctor receiving message from user
            store.dispatch(getConversationUnlockStatus({ 
              userId: otherUserId, 
              doctorId: currentUserId 
            }));
          }
          console.log('🔄 Refreshed unlock status for new conversation');
        }
      }, 500);
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

    // Notification events - when schedule is accepted, refresh conversations
    this.socket.on('notification', (data) => {
      console.log('🔔 Notification received:', data);
      
      if (data.type === 'schedule_accept') {
        console.log('✅ Schedule accepted - refreshing conversations and unlock status');
        
        setTimeout(() => {
          // Refresh conversations to show new chat availability
          store.dispatch(getConversations());
          
          // Get current user info to refresh unlock status
          const state = store.getState();
          const { user, doctor } = state.authSlice;
          const currentUserId = user?._id || doctor?._id;
          const currentUserType = user ? 'User' : 'Doctor';
          
          // This notification means a schedule was accepted, so chat should be unlocked
          // We need to refresh unlock status for all conversations
          const conversations = state.messageSlice.conversations;
          if (Array.isArray(conversations)) {
            conversations.forEach(conversation => {
              if (currentUserType === 'User' && conversation.otherUser?.type === 'Doctor') {
                store.dispatch(getConversationUnlockStatus({ 
                  userId: currentUserId, 
                  doctorId: conversation.otherUser.id 
                }));
              } else if (currentUserType === 'Doctor' && conversation.otherUser?.type === 'User') {
                store.dispatch(getConversationUnlockStatus({ 
                  userId: conversation.otherUser.id, 
                  doctorId: currentUserId 
                }));
              }
            });
          }
        }, 1000); // Longer delay to ensure backend processing is complete
      }
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

 