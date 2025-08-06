import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// Create feedback
export const createFeedback = createAsyncThunk('feedback/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/feedback/create', payload);
    return data;
  } catch (err) {

    return rejectWithValue(err.response?.data?.message || 'Có lỗi xảy ra khi tạo đánh giá');
  }
});

// Get feedback by schedule
export const getFeedbackBySchedule = createAsyncThunk('feedback/getBySchedule', async (scheduleId, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`/feedback/schedule/${scheduleId}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Có lỗi xảy ra khi lấy đánh giá');
  }
});

// Get doctor feedback
export const getDoctorFeedback = createAsyncThunk('feedback/getDoctorFeedback', async (params, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/feedback/doctor', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Có lỗi xảy ra khi lấy đánh giá');
  }
});

// Get doctor feedback stats
export const getDoctorFeedbackStats = createAsyncThunk('feedback/getDoctorStats', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/feedback/doctor/stats');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Có lỗi xảy ra khi lấy thống kê đánh giá');
  }
});

// Get all feedback (admin)
export const getAllFeedback = createAsyncThunk('feedback/getAllFeedback', async (params, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/feedback/admin/all', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Có lỗi xảy ra khi lấy đánh giá');
  }
});

const feedbackSlice = createSlice({
  name: 'feedbackSlice',
  initialState: {
    currentFeedback: null,
    doctorFeedback: null,
    doctorFeedbackStats: null,
    allFeedback: null,
    createFeedbackLoading: false,
    getFeedbackLoading: false,
    getDoctorFeedbackLoading: false,
    getDoctorStatsLoading: false,
    getAllFeedbackLoading: false,
    error: null,
    success: null
  },
  reducers: {
    clearFeedbackState: (state) => {
      state.currentFeedback = null;
      state.doctorFeedback = null;
      state.doctorFeedbackStats = null;
      state.allFeedback = null;
      state.error = null;
      state.success = null;
    }
  },
  extraReducers: (builder) => {
    // Create feedback
    builder.addCase(createFeedback.pending, (state) => {
      state.createFeedbackLoading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(createFeedback.fulfilled, (state, action) => {
      state.createFeedbackLoading = false;
      state.currentFeedback = action.payload.feedback;
      state.success = action.payload.message;
    });
    builder.addCase(createFeedback.rejected, (state, action) => {
      state.createFeedbackLoading = false;
      state.error = action.payload;
    });

    // Get feedback by schedule
    builder.addCase(getFeedbackBySchedule.pending, (state) => {
      state.getFeedbackLoading = true;
      state.error = null;
    });
    builder.addCase(getFeedbackBySchedule.fulfilled, (state, action) => {
      state.getFeedbackLoading = false;
      state.currentFeedback = action.payload.feedback;
    });
    builder.addCase(getFeedbackBySchedule.rejected, (state, action) => {
      state.getFeedbackLoading = false;
      state.error = action.payload;
    });

    // Get doctor feedback
    builder.addCase(getDoctorFeedback.pending, (state) => {
      state.getDoctorFeedbackLoading = true;
      state.error = null;
    });
    builder.addCase(getDoctorFeedback.fulfilled, (state, action) => {
      state.getDoctorFeedbackLoading = false;
      state.doctorFeedback = action.payload;
    });
    builder.addCase(getDoctorFeedback.rejected, (state, action) => {
      state.getDoctorFeedbackLoading = false;
      state.error = action.payload;
    });

    // Get doctor feedback stats
    builder.addCase(getDoctorFeedbackStats.pending, (state) => {
      state.getDoctorStatsLoading = true;
      state.error = null;
    });
    builder.addCase(getDoctorFeedbackStats.fulfilled, (state, action) => {
      state.getDoctorStatsLoading = false;
      state.doctorFeedbackStats = action.payload;
    });
    builder.addCase(getDoctorFeedbackStats.rejected, (state, action) => {
      state.getDoctorStatsLoading = false;
      state.error = action.payload;
    });

    // Get all feedback (admin)
    builder.addCase(getAllFeedback.pending, (state) => {
      state.getAllFeedbackLoading = true;
      state.error = null;
    });
    builder.addCase(getAllFeedback.fulfilled, (state, action) => {
      state.getAllFeedbackLoading = false;
      state.allFeedback = action.payload;
    });
    builder.addCase(getAllFeedback.rejected, (state, action) => {
      state.getAllFeedbackLoading = false;
      state.error = action.payload;
    });
  }
});

export const { clearFeedbackState } = feedbackSlice.actions;

// Selectors
export const selectCurrentFeedback = (state) => state.feedbackSlice?.currentFeedback || null;
export const selectDoctorFeedback = (state) => state.feedbackSlice?.doctorFeedback || null;
export const selectDoctorFeedbackStats = (state) => state.feedbackSlice?.doctorFeedbackStats || null;
export const selectAllFeedback = (state) => state.feedbackSlice?.allFeedback || null;
export const selectCreateFeedbackLoading = (state) => state.feedbackSlice?.createFeedbackLoading || false;
export const selectGetFeedbackLoading = (state) => state.feedbackSlice?.getFeedbackLoading || false;
export const selectGetDoctorFeedbackLoading = (state) => state.feedbackSlice?.getDoctorFeedbackLoading || false;
export const selectGetDoctorStatsLoading = (state) => state.feedbackSlice?.getDoctorStatsLoading || false;
export const selectGetAllFeedbackLoading = (state) => state.feedbackSlice?.getAllFeedbackLoading || false;
export const selectFeedbackError = (state) => state.feedbackSlice?.error || null;
export const selectFeedbackSuccess = (state) => state.feedbackSlice?.success || null;

export default feedbackSlice.reducer; 