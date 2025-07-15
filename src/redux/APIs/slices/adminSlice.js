// redux/APIs/slices/adminSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRequest } from "../../../services/httpMethods";

// ===== Thunk: Get all users =====
export const getAllUsers = createAsyncThunk(
  "admin/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest("users");
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Error fetching users" });
    }
  }
);

const initialState = {
  users: [],
  totalUsers: 0,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: null,
};

const adminSlice = createSlice({
  name: "adminSlice",
  initialState,
  reducers: {
    resetAdminState: (state) => {
      state.users = [];
      state.totalUsers = 0;
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload.users || [];
        state.totalUsers = action.payload.totalUsers || 0;
        state.message = action.payload.message || "Fetched all users successfully";
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.users = [];
        state.totalUsers = 0;
        state.message = action.payload?.message || "Error fetching users";
      });
  },
});

export const { resetAdminState } = adminSlice.actions;
export default adminSlice;
