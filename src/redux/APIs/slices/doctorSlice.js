import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRequest, putRequestFormData } from "../../../services/httpMethods";

// Get list of doctors
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

// Update doctor profile
export const updateDoctorProfile = createAsyncThunk(
  "doctorSlice/updateDoctorProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await putRequestFormData("/doctors/profile", formData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Error updating profile" }
      );
    }
  }
);

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: null,
  message: null,
  doctors: null,
  updateProfileSuccess: false,
  updateProfileError: null,
};

const doctorSlice = createSlice({
  name: "doctorSlice",
  initialState,
  reducers: {
    setNull(state) {
      state.isSuccess = false;
      state.message = null;
      state.updateProfileSuccess = false;
      state.updateProfileError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get doctors
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
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message =
          action.payload?.message || "Failed to fetch doctors";
      })

      // Update doctor profile
      .addCase(updateDoctorProfile.pending, (state) => {
        state.isLoading = true;
        state.updateProfileSuccess = false;
        state.updateProfileError = null;
      })
      .addCase(updateDoctorProfile.fulfilled, (state, action) => {
        if (action.payload.status === 200 || action.payload.status === 201) {
          state.isLoading = false;
          state.updateProfileSuccess = true;
          state.message = action.payload.message || "Profile updated successfully";
        } else {
          state.isLoading = false;
          state.updateProfileSuccess = false;
          state.updateProfileError = "Update failed with unexpected status";
        }
      })
      .addCase(updateDoctorProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.updateProfileSuccess = false;
        state.updateProfileError =
          action.payload?.message || "Update profile failed";
      });
  },
});

export const { setNull } = doctorSlice.actions;

export default doctorSlice;
