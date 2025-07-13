import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRequest } from "../../../services/httpMethods";

export const getDoctors = createAsyncThunk(
  "doctorSlice/getDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest("users/doctors");
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching doctors");
    }
  }
);

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: null,
  message: null,
  doctors: null,
};

const doctorSlice = createSlice({
  name: "doctorSlice",
  initialState,
  reducers: {
    setNull(state) {
      state.isSuccess = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDoctors.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(getDoctors.fulfilled, (state, action) => {
        if (action.payload.status === 200 || action.payload.status === 201) {
          state.isLoading = false;
          state.isSuccess = true;
          state.doctors = action.payload.data;
        } else {
          state.isLoading = false;
          state.isSuccess = false;
        }
      })
      .addCase(getDoctors.rejected, (state, action) => {
        state.doctorsStatus = "failed";
        state.doctorsError =
          action.payload.message || "Failed to fetch doctors";
      });
  },
});

export const { setNull } = doctorSlice.actions;

export default doctorSlice;
