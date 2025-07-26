import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../axios";

export const createPaymentUrl = createAsyncThunk(
  "transactions/create_payment_url",
  async ({ amount, orderId, orderInfo, bankCode }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/transactions/vnpay/create", {
        amount,
        orderId,
        orderInfo,
        bankCode
      });
      return response.data;
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    paymentUrl: null,
    status: "idle",
    error: null,
  },
  reducers: {
    resetTransactionState: (state) => {
      state.paymentUrl = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentUrl.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createPaymentUrl.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.paymentUrl = action.payload.paymentUrl;
      })
      .addCase(createPaymentUrl.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Đã có lỗi xảy ra";
      });
  },
});

export const { resetTransactionState } = transactionSlice.actions;
export default transactionSlice;