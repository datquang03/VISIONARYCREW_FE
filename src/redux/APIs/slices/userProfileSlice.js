// redux/APIs/slices/userProfileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// Old functions for UserProfile.jsx
export const getUserProfile = createAsyncThunk('userProfile/getUserProfile', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/users/profile');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Có lỗi xảy ra khi lấy thông tin người dùng');
  }
});

export const updateUserProfile = createAsyncThunk('userProfile/updateUserProfile', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await axios.put('/users/profile', formData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin');
  }
});

// New functions for feedback components
export const getUserProfileById = createAsyncThunk('userProfile/getUserById', async (userId, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`/users/profile/${userId}`);
    return { ...data, userType: 'user' };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Có lỗi xảy ra khi lấy thông tin người dùng');
  }
});

export const getDoctorProfileById = createAsyncThunk('userProfile/getDoctorById', async (doctorId, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`/doctors/${doctorId}`);
    return { ...data, userType: 'doctor' };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Có lỗi xảy ra khi lấy thông tin bác sĩ');
  }
});

const userProfileSlice = createSlice({
  name: 'userProfileSlice',
  initialState: {
    user: null,
    selectedProfile: null,
    isLoading: false,
    isSuccess: false,
    isError: null,
    message: null,
    getUserLoading: false,
    getDoctorLoading: false,
    error: null
  },
  reducers: {
    clearSelectedProfile: (state) => {
      state.selectedProfile = null;
      state.error = null;
    },
    setNull: (state) => {
      state.isSuccess = false;
      state.message = null;
    }
  },
  extraReducers: (builder) => {
    // Old functions for UserProfile.jsx
    builder.addCase(getUserProfile.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = null;
      state.message = null;
    });
    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload.user;
      state.message = action.payload.message;
      state.isError = null;
    });
    builder.addCase(getUserProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = action.payload || 'Failed to fetch user profile';
    });

    builder.addCase(updateUserProfile.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = null;
      state.message = null;
    });
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload.user;
      state.message = action.payload.message;
      state.isError = null;
    });
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = action.payload || 'Cập nhật thất bại';
    });

    // New functions for feedback components
    builder.addCase(getUserProfileById.pending, (state) => {
      state.getUserLoading = true;
      state.error = null;
    });
    builder.addCase(getUserProfileById.fulfilled, (state, action) => {
      state.getUserLoading = false;
      state.selectedProfile = action.payload;
    });
    builder.addCase(getUserProfileById.rejected, (state, action) => {
      state.getUserLoading = false;
      state.error = action.payload;
    });

    builder.addCase(getDoctorProfileById.pending, (state) => {
      state.getDoctorLoading = true;
      state.error = null;
    });
    builder.addCase(getDoctorProfileById.fulfilled, (state, action) => {
      state.getDoctorLoading = false;
      state.selectedProfile = action.payload;
    });
    builder.addCase(getDoctorProfileById.rejected, (state, action) => {
      state.getDoctorLoading = false;
      state.error = action.payload;
    });
  }
});

export const { clearSelectedProfile, setNull } = userProfileSlice.actions;

// Selectors
export const selectSelectedProfile = (state) => state.userProfileSlice?.selectedProfile || null;
export const selectGetUserLoading = (state) => state.userProfileSlice?.getUserLoading || false;
export const selectGetDoctorLoading = (state) => state.userProfileSlice?.getDoctorLoading || false;
export const selectUserProfileError = (state) => state.userProfileSlice?.error || null;

export default userProfileSlice.reducer;
