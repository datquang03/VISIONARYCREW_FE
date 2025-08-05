import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRequest, postRequest, putRequest, deleteRequest } from '../../../services/httpMethods';

// Async thunks
export const sendMessage = createAsyncThunk(
  'message/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await postRequest('messages/send', messageData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error sending message');
    }
  }
);

export const getConversations = createAsyncThunk(
  'message/getConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest('messages/conversations');
      console.log('🔍 Debug getConversations API response:', {
        response,
        status: response?.status,
        data: response?.data,
        dataType: typeof response?.data,
        isDataArray: Array.isArray(response?.data)
      });
      return response;
    } catch (error) {
      console.error('❌ getConversations API error:', error);
      return rejectWithValue(error.response?.data || 'Error fetching conversations');
    }
  }
);

export const getConversationMessages = createAsyncThunk(
  'message/getConversationMessages',
  async ({ conversationId, page = 1, limit = 50 }, { rejectWithValue }) => {
    try {
      const response = await getRequest(`messages/conversation/${conversationId}?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching messages');
    }
  }
);

export const markMessagesAsRead = createAsyncThunk(
  'message/markMessagesAsRead',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await putRequest(`messages/conversation/${conversationId}/read`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error marking messages as read');
    }
  }
);

export const deleteMessage = createAsyncThunk(
  'message/deleteMessage',
  async (messageId, { rejectWithValue }) => {
    try {
      const response = await deleteRequest(`messages/message/${messageId}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error deleting message');
    }
  }
);

export const getUnreadCount = createAsyncThunk(
  'message/getUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest('messages/unread-count');
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching unread count');
    }
  }
);

export const searchMessages = createAsyncThunk(
  'message/searchMessages',
  async ({ query, conversationId }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ query });
      if (conversationId) params.append('conversationId', conversationId);
      const response = await getRequest(`messages/search?${params.toString()}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error searching messages');
    }
  }
);

export const getConversationUnlockStatus = createAsyncThunk(
  'message/getConversationUnlockStatus',
  async ({ userId, doctorId }, { rejectWithValue }) => {
    try {
      const response = await getRequest(`messages/unlock-status/${userId}/${doctorId}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error checking unlock status');
    }
  }
);

const initialState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  unreadCount: 0,
  searchResults: [],
  unlockStatus: {},
  isLoading: false,
  isSending: false,
  isSearching: false,
  error: null,
  message: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalMessages: 0,
    hasNextPage: false,
    hasPrevPage: false
  }
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    // Socket events
    addNewMessage: (state, action) => {
      const { message, conversationId } = action.payload;
      
      console.log('🔄 ADDING NEW MESSAGE TO REDUX:', { 
        messageId: message._id,
        from: message.senderName,
        to: message.receiverName,
        conversationId,
        currentConversation: state.currentConversation,
        isCurrentConversation: state.currentConversation === conversationId
      });
      
      // Add to messages if in current conversation
      if (state.currentConversation === conversationId) {
        state.messages.push(message);
        console.log('🔍 Debug: Message added to current conversation');
      }
      
      // Update conversation list
      const conversationIndex = state.conversations.findIndex(
        conv => conv.conversationId === conversationId
      );
      
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].lastMessage = message;
        // Only increment unread count if not in current conversation
        if (state.currentConversation !== conversationId) {
          state.conversations[conversationIndex].unreadCount += 1;
        }
        console.log('🔍 Debug: Updated existing conversation');
      } else {
        console.log('🔍 Debug: Conversation not found in list, will be loaded by getConversations');
      }
      
      // Update unread count only if not in current conversation
      if (state.currentConversation !== conversationId) {
        state.unreadCount += 1;
      }
    },
    
    updateMessageRead: (state, action) => {
      const { conversationId, readerId } = action.payload;
      
      // Mark messages as read in current conversation
      if (state.currentConversation === conversationId) {
        state.messages.forEach(msg => {
          if (msg.receiverId._id === readerId && !msg.isRead) {
            msg.isRead = true;
            msg.readAt = new Date();
          }
        });
      }
      
      // Update conversation unread count
      const conversationIndex = state.conversations.findIndex(
        conv => conv.conversationId === conversationId
      );
      
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].unreadCount = 0;
      }
      
      // Update total unread count
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
    
    deleteMessageFromState: (state, action) => {
      const { messageId, conversationId } = action.payload;
      
      // Remove from messages
      state.messages = state.messages.filter(msg => msg._id !== messageId);
      
      // Update conversation if needed
      if (state.currentConversation === conversationId) {
        const conversationIndex = state.conversations.findIndex(
          conv => conv.conversationId === conversationId
        );
        
        if (conversationIndex !== -1 && state.messages.length > 0) {
          state.conversations[conversationIndex].lastMessage = state.messages[state.messages.length - 1];
        }
      }
    },
    
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
      state.messages = [];
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalMessages: 0,
        hasNextPage: false,
        hasPrevPage: false
      };
    },
    
    clearMessages: (state) => {
      state.messages = [];
      state.currentConversation = null;
      state.searchResults = [];
    },
    
    clearError: (state) => {
      state.error = null;
      state.message = null;
    },
    
    setTypingStatus: () => {
      // Handle typing indicators if needed
      // TODO: Implement typing status logic
    }
  },
  extraReducers: (builder) => {
    builder
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.isSending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isSending = false;
        if (action.payload.status === 200 || action.payload.status === 201) {
          // Message will be added via socket event
          state.message = action.payload.data.message;
        } else {
          state.error = action.payload.data.message;
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.payload;
      })
      
      // Get conversations
      .addCase(getConversations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        
        if (action.payload.status === 200) {
          // Handle nested data structure: response.data.data
          const conversations = action.payload.data?.data || action.payload.data || [];
          state.conversations = Array.isArray(conversations) ? conversations : [];
          console.log('✅ Conversations loaded:', state.conversations.length);
        } else {
          state.error = action.payload.data?.message || 'Error loading conversations';
        }
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get conversation messages
      .addCase(getConversationMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getConversationMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.status === 200) {
          state.messages = action.payload.data.messages;
          state.pagination = action.payload.data.pagination;
        } else {
          state.error = action.payload.data.message;
        }
      })
      .addCase(getConversationMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Mark messages as read
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        if (action.payload.status === 200) {
          // Update handled via socket event
        }
      })
      
      // Delete message
      .addCase(deleteMessage.fulfilled, (state, action) => {
        if (action.payload.status === 200) {
          // Update handled via socket event
        }
      })
      
      // Get unread count
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        if (action.payload.status === 200) {
          state.unreadCount = action.payload.data.unreadCount;
        }
      })
      
      // Search messages
      .addCase(searchMessages.pending, (state) => {
        state.isSearching = true;
        state.error = null;
      })
      .addCase(searchMessages.fulfilled, (state, action) => {
        state.isSearching = false;
        if (action.payload.status === 200) {
          state.searchResults = action.payload.data;
        } else {
          state.error = action.payload.data.message;
        }
      })
      .addCase(searchMessages.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.payload;
      })

      // Get conversation unlock status
      .addCase(getConversationUnlockStatus.fulfilled, (state, action) => {
        if (action.payload.status === 200) {
          const { userId, doctorId, isUnlocked } = action.payload.data;
          state.unlockStatus[`${userId}_${doctorId}`] = isUnlocked;
        }
      });
  }
});

export const {
  addNewMessage,
  updateMessageRead,
  deleteMessageFromState,
  setCurrentConversation,
  clearMessages,
  clearError,
  setTypingStatus
} = messageSlice.actions;

export default messageSlice.reducer; 