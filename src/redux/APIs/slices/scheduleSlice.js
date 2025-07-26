import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// Async thunks
export const getAllSchedules = createAsyncThunk('schedules/getAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/schedules/all', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const getAvailableSchedules = createAsyncThunk('schedules/getAvailable', async (params, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/schedules/available', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const getDoctorSchedules = createAsyncThunk('schedules/getDoctorSchedules', async ({ doctorId, ...params }, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`/schedules/doctor/${doctorId}`, { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const getMySchedules = createAsyncThunk('schedules/getMySchedules', async (params, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/schedules/my-schedules', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const createSchedule = createAsyncThunk('schedules/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/schedules/create', payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const updateSchedule = createAsyncThunk('schedules/update', async ({ scheduleId, updates }, { rejectWithValue }) => {
  try {
    const { data } = await axios.put(`/schedules/${scheduleId}`, updates);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const deleteSchedule = createAsyncThunk('schedules/delete', async (scheduleId, { rejectWithValue }) => {
  try {
    const { data } = await axios.delete(`/schedules/${scheduleId}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const makeScheduleAvailable = createAsyncThunk('schedules/makeAvailable', async (scheduleId, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`/schedules/reactivate/${scheduleId}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const registerSchedule = createAsyncThunk('schedules/register', async (scheduleId, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`/schedules/register/${scheduleId}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const cancelRegisteredSchedule = createAsyncThunk('schedules/cancelRegistered', async ({ scheduleId, cancelReason }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`/schedules/cancel/${scheduleId}`, { cancelReason });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const getMyRegisteredSchedules = createAsyncThunk('schedules/getMyRegistered', async (params, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/schedules/my-registered', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const rejectRegisterSchedule = createAsyncThunk('schedules/rejectRegister', async ({ scheduleId, rejectedReason }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`/schedules/reject/${scheduleId}`, { rejectedReason });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

// Slice
const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: {
    allSchedules: [],
    availableSchedules: [],
    doctorSchedules: [],
    mySchedules: [],
    myRegisteredSchedules: [],
    pagination: null,
    loading: false,
    error: null,
    success: null,
    currentSchedule: null,
  },
  reducers: {
    clearScheduleState: (state) => {
      state.error = null;
      state.success = null;
      state.currentSchedule = null;
    },
  },
  extraReducers: (builder) => {
    // getAllSchedules
    builder.addCase(getAllSchedules.pending, (state) => {
      state.loading = true; state.error = null;
    });
    builder.addCase(getAllSchedules.fulfilled, (state, action) => {
      state.loading = false;
      state.allSchedules = action.payload.schedules || action.payload;
      state.pagination = action.payload.pagination || null;
    });
    builder.addCase(getAllSchedules.rejected, (state, action) => {
      state.loading = false; state.error = action.payload;
    });
    // getAvailableSchedules
    builder.addCase(getAvailableSchedules.pending, (state) => {
      state.loading = true; state.error = null;
    });
    builder.addCase(getAvailableSchedules.fulfilled, (state, action) => {
      state.loading = false;
      state.availableSchedules = action.payload.schedules || action.payload;
    });
    builder.addCase(getAvailableSchedules.rejected, (state, action) => {
      state.loading = false; state.error = action.payload;
    });
    // getDoctorSchedules
    builder.addCase(getDoctorSchedules.pending, (state) => {
      state.loading = true; state.error = null;
    });
    builder.addCase(getDoctorSchedules.fulfilled, (state, action) => {
      state.loading = false;
      state.doctorSchedules = action.payload;
    });
    builder.addCase(getDoctorSchedules.rejected, (state, action) => {
      state.loading = false; state.error = action.payload;
    });
    // getMySchedules
    builder.addCase(getMySchedules.pending, (state) => {
      state.loading = true; state.error = null;
    });
    builder.addCase(getMySchedules.fulfilled, (state, action) => {
      state.loading = false;
      state.mySchedules = action.payload.schedules;
    });
    builder.addCase(getMySchedules.rejected, (state, action) => {
      state.loading = false; state.error = action.payload;
    });
    // createSchedule
    builder.addCase(createSchedule.pending, (state) => {
      state.loading = true; state.error = null; state.success = null;
    });
    builder.addCase(createSchedule.fulfilled, (state, action) => {
      state.loading = false; state.success = action.payload.message; state.currentSchedule = action.payload.schedule;
    });
    builder.addCase(createSchedule.rejected, (state, action) => {
      state.loading = false; state.error = action.payload;
    });
    // updateSchedule
    builder.addCase(updateSchedule.pending, (state) => {
      state.loading = true; state.error = null; state.success = null;
    });
    builder.addCase(updateSchedule.fulfilled, (state, action) => {
      state.loading = false; state.success = action.payload.message; state.currentSchedule = action.payload.schedule;
    });
    builder.addCase(updateSchedule.rejected, (state, action) => {
      state.loading = false; state.error = action.payload;
    });
    // deleteSchedule
    builder.addCase(deleteSchedule.pending, (state) => {
      state.loading = true; state.error = null; state.success = null;
    });
    builder.addCase(deleteSchedule.fulfilled, (state, action) => {
      state.loading = false; state.success = action.payload.message;
    });
    builder.addCase(deleteSchedule.rejected, (state, action) => {
      state.loading = false; state.error = action.payload;
    });
    // makeScheduleAvailable
    builder.addCase(makeScheduleAvailable.pending, (state) => {
      state.loading = true; state.error = null; state.success = null;
    });
    builder.addCase(makeScheduleAvailable.fulfilled, (state, action) => {
      state.loading = false; state.success = action.payload.message; state.currentSchedule = action.payload.schedule;
    });
    builder.addCase(makeScheduleAvailable.rejected, (state, action) => {
      state.loading = false; state.error = action.payload;
    });
    // registerSchedule
    builder.addCase(registerSchedule.pending, (state) => {
      state.loading = true; state.error = null; state.success = null;
    });
    builder.addCase(registerSchedule.fulfilled, (state, action) => {
      state.loading = false; state.success = action.payload.message; state.currentSchedule = action.payload.schedule;
    });
    builder.addCase(registerSchedule.rejected, (state, action) => {
      state.loading = false; state.error = action.payload;
    });
    // cancelRegisteredSchedule
    builder.addCase(cancelRegisteredSchedule.pending, (state) => {
      state.loading = true; state.error = null; state.success = null;
    });
    builder.addCase(cancelRegisteredSchedule.fulfilled, (state, action) => {
      state.loading = false; state.success = action.payload.message; state.currentSchedule = action.payload.schedule;
    });
    builder.addCase(cancelRegisteredSchedule.rejected, (state, action) => {
      state.loading = false; state.error = action.payload;
    });
    // getMyRegisteredSchedules
    builder.addCase(getMyRegisteredSchedules.pending, (state) => {
      state.loading = true; state.error = null;
    });
    builder.addCase(getMyRegisteredSchedules.fulfilled, (state, action) => {
      state.loading = false;
      state.myRegisteredSchedules = action.payload;
    });
    builder.addCase(getMyRegisteredSchedules.rejected, (state, action) => {
      state.loading = false; state.error = action.payload;
    });
    // rejectRegisterSchedule
    builder.addCase(rejectRegisterSchedule.pending, (state) => {
      state.loading = true; state.error = null; state.success = null;
    });
    builder.addCase(rejectRegisterSchedule.fulfilled, (state, action) => {
      state.loading = false; state.success = action.payload.message; state.currentSchedule = action.payload.schedule;
    });
    builder.addCase(rejectRegisterSchedule.rejected, (state, action) => {
      state.loading = false; state.error = action.payload;
    });
  },
});

export const { clearScheduleState } = scheduleSlice.actions;
export default scheduleSlice.reducer; 