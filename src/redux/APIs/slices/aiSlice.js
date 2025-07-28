import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postRequest, getRequest, putRequest } from "../../../services/httpMethods";

// ===================== THUNKS =====================

// Chat with AI
export const chatWithAI = createAsyncThunk(
  "ai/chatWithAI",
  async ({ message, currentPage, userAction }, { rejectWithValue }) => {
    try {
      const response = await postRequest("/ai/chat", {
        message,
        currentPage,
        userAction,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Error chatting with AI" });
    }
  }
);

// Get quick help suggestions
export const getQuickHelp = createAsyncThunk(
  "ai/getQuickHelp",
  async ({ currentPage }, { rejectWithValue }) => {
    try {
      const response = await getRequest(`/ai/quick-help?currentPage=${currentPage}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Error getting quick help" });
    }
  }
);

// Get user AI statistics
export const getUserAIStats = createAsyncThunk(
  "ai/getUserAIStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest("/ai/stats");
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Error getting AI stats" });
    }
  }
);

// Reset conversation
export const resetConversation = createAsyncThunk(
  "ai/resetConversation",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postRequest("/ai/reset");
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Error resetting conversation" });
    }
  }
);

// Get conversation history
export const getConversationHistory = createAsyncThunk(
  "ai/getConversationHistory",
  async ({ limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await getRequest(`/ai/history?limit=${limit}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Error getting conversation history" });
    }
  }
);

// Get AI preferences
export const getAIPreferences = createAsyncThunk(
  "ai/getAIPreferences",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest("/ai/preferences");
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Error getting AI preferences" });
    }
  }
);

// Update AI preferences
export const updateAIPreferences = createAsyncThunk(
  "ai/updateAIPreferences",
  async (preferences, { rejectWithValue }) => {
    try {
      const response = await putRequest("/ai/preferences", preferences);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Error updating AI preferences" });
    }
  }
);

// Toggle AI guide
export const toggleAIGuide = createAsyncThunk(
  "ai/toggleAIGuide",
  async ({ isActive }, { rejectWithValue }) => {
    try {
      const response = await putRequest("/ai/toggle", { isActive });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Error toggling AI guide" });
    }
  }
);

// Get database statistics
export const getDatabaseStats = createAsyncThunk(
  'ai/getDatabaseStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest('/ai/database-stats');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue('Unauthorized');
      }
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi lấy thống kê database');
    }
  }
);

// ===================== SLICE =====================

const initialState = {
  messages: [],
  isLoading: false,
  isChatOpen: false,
  currentPage: '/',
  quickHelpSuggestions: [],
  quickHelpLoading: false,
  isAIActive: true,
  navigation: null,
  suggestNavigation: null,
  databaseStats: null,
  databaseStatsLoading: false
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    // UI actions
    toggleChat: (state) => {
      state.isChatOpen = !state.isChatOpen;
    },
    openChat: (state) => {
      state.isChatOpen = true;
    },
    closeChat: (state) => {
      state.isChatOpen = false;
    },
    
    // Update current page
    updateCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    
    // Add message to conversation
    addMessage: (state, action) => {
      const { role, content, timestamp = new Date().toISOString() } = action.payload;
      state.messages.push({
        role,
        content,
        timestamp,
      });
    },
    
    // Clear messages
    clearMessages: (state) => {
      state.messages = [];
    },
    
    // Reset state
    resetAIState: (state) => {
      state.messages = [];
      state.isLoading = false;
      state.isError = false;
      state.message = null;
      state.conversationId = null;
      state.context = null;
      state.navigation = null;
      state.suggestNavigation = null;
    },
    // Clear suggest navigation
    clearSuggestNavigation: (state) => {
      state.suggestNavigation = null;
    },
    // Clear navigation
    clearNavigation: (state) => {
      state.navigation = null;
    },
    
    // Toggle AI active
    toggleAIActive: (state) => {
      state.isAIActive = !state.isAIActive;
    },
    
    // Set AI active
    setAIActive: (state, action) => {
      state.isAIActive = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Chat with AI
      .addCase(chatWithAI.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = null;
      })
      .addCase(chatWithAI.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message = action.payload?.message || "Chat successful";
        
        // Add AI response to messages
        if (action.payload?.data?.data?.response) {
          const aiMessage = {
            role: 'assistant',
            content: action.payload.data.data.response,
            timestamp: new Date().toISOString(),
          };
          state.messages.push(aiMessage);
        } else if (action.payload?.data?.response) {
          // Fallback for direct response
          const aiMessage = {
            role: 'assistant',
            content: action.payload.data.response,
            timestamp: new Date().toISOString(),
          };
          state.messages.push(aiMessage);
        }
        
        // Update conversation context
        if (action.payload?.data?.data?.conversationId) {
          state.conversationId = action.payload.data.data.conversationId;
        } else if (action.payload?.data?.conversationId) {
          state.conversationId = action.payload.data.conversationId;
        }
        
        if (action.payload?.data?.data?.context) {
          state.context = action.payload.data.data.context;
        } else if (action.payload?.data?.context) {
          state.context = action.payload.data.context;
        }
        
        // Handle navigation if present
        if (action.payload?.data?.data?.navigation) {
          state.navigation = action.payload.data.data.navigation;
        } else if (action.payload?.data?.navigation) {
          state.navigation = action.payload.data.navigation;
        }
        
        // Handle suggestNavigation if present
        if (action.payload?.data?.data?.suggestNavigation) {
          state.suggestNavigation = action.payload.data.data.suggestNavigation;
        } else if (action.payload?.data?.suggestNavigation) {
          state.suggestNavigation = action.payload.data.suggestNavigation;
        }
      })
      .addCase(chatWithAI.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Chat failed";
        
        // Handle 401 error (unauthorized)
        if (action.error?.status === 401) {
          state.message = "Vui lòng đăng nhập để sử dụng AI Assistant";
        }
      })
      
      // Get quick help
      .addCase(getQuickHelp.pending, (state) => {
        state.quickHelpLoading = true;
      })
      .addCase(getQuickHelp.fulfilled, (state, action) => {
        state.quickHelpLoading = false;
        // Ensure quickHelpSuggestions is always an array
        const suggestions = action.payload?.data?.data;
        state.quickHelpSuggestions = Array.isArray(suggestions) ? suggestions : [];
      })
      .addCase(getQuickHelp.rejected, (state, action) => {
        state.quickHelpLoading = false;
        state.quickHelpSuggestions = [];
        // Don't show error for 401 (unauthorized) - user just not logged in
        if (action.error?.status !== 401) {
          console.error('Quick help error:', action.error);
        }
      })
      
      // Get user stats
      .addCase(getUserAIStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(getUserAIStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.userStats = action.payload?.data || null;
      })
      .addCase(getUserAIStats.rejected, (state) => {
        state.statsLoading = false;
        state.userStats = null;
      })
      
      // Reset conversation
      .addCase(resetConversation.fulfilled, (state) => {
        state.messages = [];
        state.conversationId = null;
        state.context = null;
      })
      
      // Get conversation history
      .addCase(getConversationHistory.fulfilled, (state, action) => {
        state.messages = action.payload?.data || [];
      })
      
      // Get AI preferences
      .addCase(getAIPreferences.pending, (state) => {
        state.preferencesLoading = true;
      })
      .addCase(getAIPreferences.fulfilled, (state, action) => {
        state.preferencesLoading = false;
        state.preferences = action.payload?.data || state.preferences;
      })
      .addCase(getAIPreferences.rejected, (state) => {
        state.preferencesLoading = false;
      })
      
      // Update AI preferences
      .addCase(updateAIPreferences.pending, (state) => {
        state.preferencesLoading = true;
      })
      .addCase(updateAIPreferences.fulfilled, (state, action) => {
        state.preferencesLoading = false;
        state.preferences = action.payload?.data || state.preferences;
      })
      .addCase(updateAIPreferences.rejected, (state) => {
        state.preferencesLoading = false;
      })
      
      // Toggle AI guide
      .addCase(toggleAIGuide.fulfilled, (state, action) => {
        state.isAIActive = action.payload?.data?.isActive ?? state.isAIActive;
      })
      
      // Database stats
      .addCase(getDatabaseStats.pending, (state) => {
        state.databaseStatsLoading = true;
      })
      .addCase(getDatabaseStats.fulfilled, (state, action) => {
        state.databaseStatsLoading = false;
        state.databaseStats = action.payload.data;
      })
      .addCase(getDatabaseStats.rejected, (state, action) => {
        state.databaseStatsLoading = false;
        if (action.payload !== 'Unauthorized') {
          console.error('Database stats error:', action.payload);
        }
      });
  },
});

export const {
  toggleChat,
  openChat,
  closeChat,
  updateCurrentPage,
  addMessage,
  clearMessages,
  resetAIState,
  clearSuggestNavigation,
  clearNavigation,
  toggleAIActive,
  setAIActive,
} = aiSlice.actions;

export default aiSlice.reducer; 