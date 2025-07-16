// redux/APIs/slices/userProfileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRequest, putRequest } from "../../../services/httpMethods";

export const getUserProfile = createAsyncThunk(
  "userProfileSlice/getUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest("users/profile");
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Error fetching user profile" }
      );
    }
  }
);
export const updateUserProfile = createAsyncThunk(
  "userProfileSlice/updateUserProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await putRequest("users/profile", formData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Cập nhật thất bại" }
      );
    }
  }
);

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: null,
  message: null,
  user: null,
};

const userProfileSlice = createSlice({
  name: "userProfileSlice",
  initialState,
  reducers: {
    setNull(state) {
      state.isSuccess = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = null;
        state.message = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.data.user;
        state.message = action.payload.message;
        state.isError = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError =
          action.payload.message || "Failed to fetch user profile";
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = null;
        state.message = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.message = action.payload.message;
        state.isError = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = action.payload.message || "Cập nhật thất bại";
      });
  },
});

export const { setNull } = userProfileSlice.actions;
export default userProfileSlice;
