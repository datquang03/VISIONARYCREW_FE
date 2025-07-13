import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRequest } from "../../../services/httpMethods";

export const getUserMessaged = createAsyncThunk(
  "messageSlice/getUserMessaged",
  async (value, { rejectWithValue }) => {
    try {
      const response = await getRequest(`messages/history/${value}`);
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
  userMessaged: null,
};

const messageSlice = createSlice({
  name: "messageSlice",
  initialState,
  reducers: {
    setNull(state) {
      state.isSuccess = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserMessaged.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(getUserMessaged.fulfilled, (state, action) => {
        if (action.payload.status === 200 || action.payload.status === 201) {
          state.isLoading = false;
          state.isSuccess = true;
          state.userMessaged = action.payload.data;
        } else {
          state.isLoading = false;
          state.isSuccess = false;
        }
      })
      .addCase(getUserMessaged.rejected, (state, action) => {

      });
  },
});

export const { setNull } = messageSlice.actions;

export default messageSlice;
