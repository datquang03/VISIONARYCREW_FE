import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRequest, putRequestFormData } from "../../../services/httpMethods";

export const getDoctorProfile = createAsyncThunk(
  "doctorProfileSlice/getDoctorProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest("doctors/profile");
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Error fetching doctor profile" }
      );
    }
  }
);

export const updateDoctorProfile = createAsyncThunk(
  "doctorProfileSlice/updateDoctorProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await putRequestFormData("doctors/profile", formData);
      return response; // Ensure response structure is consistent
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Error updating doctor profile" }
      );
    }
  }
);

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false, // Change to boolean for consistency
  message: null,
  doctor: null,
};

const doctorProfileSlice = createSlice({
  name: "doctorProfileSlice",
  initialState,
  reducers: {
    setNull(state) {
      state.isSuccess = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDoctorProfile.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = null;
      })
      .addCase(getDoctorProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.doctor = action.payload.data.doctor; // Consistent access
        state.message = action.payload.message;
        state.isError = false;
      })
      .addCase(getDoctorProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload.message || "Failed to fetch doctor profile";
      })
      .addCase(updateDoctorProfile.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = null;
      })
      .addCase(updateDoctorProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.doctor = action.payload.data.doctor; // Consistent access
        state.message = action.payload.message || "Profile updated successfully";
        state.isError = false;
      })
      .addCase(updateDoctorProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload.message || "Failed to update profile";
      });
  },
});

export const { setNull } = doctorProfileSlice.actions;
export default doctorProfileSlice;