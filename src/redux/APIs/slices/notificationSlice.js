import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

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
    const { data } = await axios.patch(`/notifications/${id}/read`);
    return data.notification;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const deleteNotification = createAsyncThunk('notification/delete', async (id, { rejectWithValue }) => {
  try {
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
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const idx = state.notifications.findIndex(n => n._id === action.payload._id);
        if (idx !== -1) state.notifications[idx] = action.payload;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(n => n._id !== action.payload);
      })
      .addCase(deleteAllNotification.fulfilled, (state) => {
        state.notifications = [];
      });
  },
});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer; 