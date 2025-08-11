import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRequest, postRequest, patchRequest, deleteRequest } from '../../../services/httpMethods';

// Async thunks
export const getAllSchedules = createAsyncThunk('schedules/getAll', async (params, { rejectWithValue }) => {
  try {
    const data = await getRequest('schedules/all', params);
    return data;
  } catch (err) {
    return rejectWithValue(err.message || err);
  }
});

export const getAvailableSchedules = createAsyncThunk('schedules/getAvailable', async (params, { rejectWithValue }) => {
  try {
    const data = await getRequest('schedules/available', params);
    return data;
  } catch (err) {
    return rejectWithValue(err.message || err);
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
    const data = await getRequest('schedules/my-registered', params);
    return data;
  } catch (err) {
    return rejectWithValue(err.message || err);
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

export const acceptRegisterSchedule = createAsyncThunk('schedules/acceptRegister', async (scheduleId, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`/schedules/accept/${scheduleId}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const completeSchedule = createAsyncThunk('schedules/complete', async (scheduleId, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`/schedules/complete/${scheduleId}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const cancelPendingSchedule = createAsyncThunk('schedules/cancelPending', async (scheduleId, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`/schedules/cancel-pending/${scheduleId}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const getPendingSchedules = createAsyncThunk('schedules/getPending', async (params, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/schedules/pending', { params });
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
    pendingSchedules: [],
    totalSchedules: 0, // Thêm field total
    pagination: null,
    loading: false,
    error: null,
    success: null,
    currentSchedule: null,
    // Individual loading states
    registerLoading: false,
    cancelLoading: false,
    cancelPendingLoading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    rejectLoading: false,
    acceptLoading: false,
    makeAvailableLoading: false,
    getPendingLoading: false,
    completeLoading: false,
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
      state.totalSchedules = action.payload.total || 0; // Thêm total
    });
    builder.addCase(getMySchedules.rejected, (state, action) => {
      state.loading = false; state.error = action.payload;
    });
    // createSchedule
    builder.addCase(createSchedule.pending, (state) => {
      state.createLoading = true; state.error = null; state.success = null;
    });
    builder.addCase(createSchedule.fulfilled, (state, action) => {
      state.createLoading = false; state.success = action.payload.message; state.currentSchedule = action.payload.schedule;
    });
    builder.addCase(createSchedule.rejected, (state, action) => {
      state.createLoading = false; state.error = action.payload;
    });
    // updateSchedule
    builder.addCase(updateSchedule.pending, (state) => {
      state.updateLoading = true; state.error = null; state.success = null;
    });
    builder.addCase(updateSchedule.fulfilled, (state, action) => {
      state.updateLoading = false; state.success = action.payload.message; state.currentSchedule = action.payload.schedule;
    });
    builder.addCase(updateSchedule.rejected, (state, action) => {
      state.updateLoading = false; state.error = action.payload;
    });
    // deleteSchedule
    builder.addCase(deleteSchedule.pending, (state) => {
      state.deleteLoading = true; state.error = null; state.success = null;
    });
    builder.addCase(deleteSchedule.fulfilled, (state, action) => {
      state.deleteLoading = false; state.success = action.payload.message;
    });
    builder.addCase(deleteSchedule.rejected, (state, action) => {
      state.deleteLoading = false; state.error = action.payload;
    });
    // makeScheduleAvailable
    builder.addCase(makeScheduleAvailable.pending, (state) => {
      state.makeAvailableLoading = true; state.error = null; state.success = null;
    });
    builder.addCase(makeScheduleAvailable.fulfilled, (state, action) => {
      state.makeAvailableLoading = false; state.success = action.payload.message; state.currentSchedule = action.payload.schedule;
    });
    builder.addCase(makeScheduleAvailable.rejected, (state, action) => {
      state.makeAvailableLoading = false; state.error = action.payload;
    });
    // registerSchedule
    builder.addCase(registerSchedule.pending, (state) => {
      state.registerLoading = true; state.error = null; state.success = null;
    });
    builder.addCase(registerSchedule.fulfilled, (state, action) => {
      state.registerLoading = false; state.success = action.payload.message; state.currentSchedule = action.payload.schedule;
    });
    builder.addCase(registerSchedule.rejected, (state, action) => {
      state.registerLoading = false; state.error = action.payload;
    });
    // cancelRegisteredSchedule
    builder.addCase(cancelRegisteredSchedule.pending, (state) => {
      state.cancelLoading = true; state.error = null; state.success = null;
    });
    builder.addCase(cancelRegisteredSchedule.fulfilled, (state, action) => {
      state.cancelLoading = false; state.success = action.payload.message; state.currentSchedule = action.payload.schedule;
    });
    builder.addCase(cancelRegisteredSchedule.rejected, (state, action) => {
      state.cancelLoading = false; state.error = action.payload;
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
      state.rejectLoading = true; state.error = null; state.success = null;
    });
    builder.addCase(rejectRegisterSchedule.fulfilled, (state, action) => {
      state.rejectLoading = false; state.success = action.payload.message; state.currentSchedule = action.payload.schedule;
    });
    builder.addCase(rejectRegisterSchedule.rejected, (state, action) => {
      state.rejectLoading = false; state.error = action.payload;
    });
    // acceptRegisterSchedule
    builder.addCase(acceptRegisterSchedule.pending, (state) => {
      state.acceptLoading = true; state.error = null; state.success = null;
    });
    builder.addCase(acceptRegisterSchedule.fulfilled, (state, action) => {
      state.acceptLoading = false; state.success = action.payload.message; state.currentSchedule = action.payload.schedule;
    });
    builder.addCase(acceptRegisterSchedule.rejected, (state, action) => {
      state.acceptLoading = false; state.error = action.payload;
    });
    // completeSchedule
    builder.addCase(completeSchedule.pending, (state) => {
      state.completeLoading = true; state.error = null; state.success = null;
    });
    builder.addCase(completeSchedule.fulfilled, (state, action) => {
      state.completeLoading = false; state.success = action.payload.message; state.currentSchedule = action.payload.schedule;
    });
    builder.addCase(completeSchedule.rejected, (state, action) => {
      state.completeLoading = false; state.error = action.payload;
    });
    // cancelPendingSchedule
    builder.addCase(cancelPendingSchedule.pending, (state) => {
      state.cancelPendingLoading = true; state.error = null; state.success = null;
    });
    builder.addCase(cancelPendingSchedule.fulfilled, (state, action) => {
      state.cancelPendingLoading = false; state.success = action.payload.message; state.currentSchedule = action.payload.schedule;
    });
    builder.addCase(cancelPendingSchedule.rejected, (state, action) => {
      state.cancelPendingLoading = false; state.error = action.payload;
    });
    // getPendingSchedules
    builder.addCase(getPendingSchedules.pending, (state) => {
      state.getPendingLoading = true; state.error = null;
    });
    builder.addCase(getPendingSchedules.fulfilled, (state, action) => {
      state.getPendingLoading = false;
      state.pendingSchedules = action.payload;
    });
    builder.addCase(getPendingSchedules.rejected, (state, action) => {
      state.getPendingLoading = false; state.error = action.payload;
    });
  },
});

export const { clearScheduleState } = scheduleSlice.actions;

// Selectors
export const selectAllSchedules = (state) => state.scheduleSlice?.allSchedules || [];
export const selectAvailableSchedules = (state) => state.scheduleSlice?.availableSchedules || [];
export const selectDoctorSchedules = (state) => state.scheduleSlice?.doctorSchedules || [];
export const selectMySchedules = (state) => state.scheduleSlice?.mySchedules || [];
export const selectMyRegisteredSchedules = (state) => state.scheduleSlice?.myRegisteredSchedules || [];
export const selectPendingSchedules = (state) => state.scheduleSlice?.pendingSchedules || [];
export const selectScheduleLoading = (state) => state.scheduleSlice?.loading || false;
export const selectScheduleError = (state) => state.scheduleSlice?.error || null;
export const selectScheduleSuccess = (state) => state.scheduleSlice?.success || null;
export const selectCurrentSchedule = (state) => state.scheduleSlice?.currentSchedule || null;
export const selectTotalSchedules = (state) => state.scheduleSlice?.totalSchedules || 0;

// Loading selectors
export const selectRegisterLoading = (state) => state.scheduleSlice?.registerLoading || false;
export const selectCancelLoading = (state) => state.scheduleSlice?.cancelLoading || false;
export const selectCancelPendingLoading = (state) => state.scheduleSlice?.cancelPendingLoading || false;
export const selectCreateLoading = (state) => state.scheduleSlice?.createLoading || false;
export const selectUpdateLoading = (state) => state.scheduleSlice?.updateLoading || false;
export const selectDeleteLoading = (state) => state.scheduleSlice?.deleteLoading || false;
export const selectRejectLoading = (state) => state.scheduleSlice?.rejectLoading || false;
export const selectAcceptLoading = (state) => state.scheduleSlice?.acceptLoading || false;
export const selectCompleteLoading = (state) => state.scheduleSlice?.completeLoading || false;
export const selectMakeAvailableLoading = (state) => state.scheduleSlice?.makeAvailableLoading || false;
export const selectGetPendingLoading = (state) => state.scheduleSlice?.getPendingLoading || false;

export default scheduleSlice.reducer; 