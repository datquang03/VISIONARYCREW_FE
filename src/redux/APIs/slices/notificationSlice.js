import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

export const createNotification = createAsyncThunk('notification/create', async (notificationData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/notifications', notificationData);
    return data.notification;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchNotifications = createAsyncThunk('notification/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/notifications');
    return data.notifications;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const markNotificationRead = createAsyncThunk('notification/markRead', async (id, { rejectWithValue }) => {
  try {
    if (!id) {
      throw new Error('Notification ID is required');
    }
    const { data } = await axios.patch(`/notifications/${id}/read`);
    return data.notification;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const deleteNotification = createAsyncThunk('notification/delete', async (id, { rejectWithValue }) => {
  try {
    if (!id) {
      throw new Error('Notification ID is required');
    }
    await axios.delete(`/notifications/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const deleteAllNotification = createAsyncThunk('notification/deleteAll', async (_, { rejectWithValue }) => {
  try {
    await axios.delete('/notifications');
    return true;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications: [],
    loading: false,
    error: null,
    // Individual loading states
    createLoading: false,
    markReadLoading: false,
    deleteLoading: false,
    deleteAllLoading: false,
  },
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNotification.pending, (state) => {
        state.createLoading = true; state.error = null;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.createLoading = false;
        state.notifications.unshift(action.payload);
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.createLoading = false; state.error = action.payload;
      })
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      })
      .addCase(markNotificationRead.pending, (state) => {
        state.markReadLoading = true; state.error = null;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.markReadLoading = false;
        const idx = state.notifications.findIndex(n => n._id === action.payload._id);
        if (idx !== -1) state.notifications[idx] = action.payload;
      })
      .addCase(markNotificationRead.rejected, (state, action) => {
        state.markReadLoading = false; state.error = action.payload;
      })
      .addCase(deleteNotification.pending, (state) => {
        state.deleteLoading = true; state.error = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.notifications = state.notifications.filter(n => n._id !== action.payload);
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.deleteLoading = false; state.error = action.payload;
      })
      .addCase(deleteAllNotification.pending, (state) => {
        state.deleteAllLoading = true; state.error = null;
      })
      .addCase(deleteAllNotification.fulfilled, (state) => {
        state.deleteAllLoading = false;
        state.notifications = [];
      })
      .addCase(deleteAllNotification.rejected, (state, action) => {
        state.deleteAllLoading = false; state.error = action.payload;
      });
  },
});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer; 