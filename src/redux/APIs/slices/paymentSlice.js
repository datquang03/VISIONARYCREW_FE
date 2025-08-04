import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getRequest,
  postRequest,
} from "../../../services/httpMethods";

// Tạo thanh toán gói dịch vụ cho bác sĩ
export const createPackagePayment = createAsyncThunk(
  "payment/createPackagePayment",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await postRequest("payments/package/create", payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error creating payment");
    }
  }
);

// Xử lý webhook từ PayOS (ít dùng ở FE, chủ yếu BE gọi)
export const handlePackagePaymentWebhook = createAsyncThunk(
  "payment/handlePackagePaymentWebhook",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await postRequest("payments/package/webhook", payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error processing webhook");
    }
  }
);

// Kiểm tra trạng thái thanh toán gói (dùng cho trang success)
export const checkPackagePaymentStatus = createAsyncThunk(
  "payment/checkPackagePaymentStatus",
  async (orderCode, { rejectWithValue }) => {
    try {
      const response = await getRequest(`payments/package/status/${orderCode}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error checking payment status");
    }
  }
);

// Lấy lịch sử thanh toán của bác sĩ
export const getDoctorPaymentHistory = createAsyncThunk(
  "payment/getDoctorPaymentHistory",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await getRequest(`payments/package/history${queryString ? `?${queryString}` : ''}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching payment history");
    }
  }
);

// Hủy thanh toán gói (nếu còn pending)
export const cancelPackagePayment = createAsyncThunk(
  "payment/cancelPackagePayment",
  async (orderCode, { rejectWithValue }) => {
    try {
      const response = await postRequest(`payments/package/cancel/${orderCode}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error cancelling payment");
    }
  }
);

// Lấy danh sách các gói dịch vụ
export const getPackages = createAsyncThunk(
  "payment/getPackages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest("payments/packages");
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching packages");
    }
  }
);

// Lấy tất cả thanh toán cho admin
export const getAllPayment = createAsyncThunk(
  "payment/getAllPayment",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await getRequest(`payments/admin/all${queryString ? `?${queryString}` : ''}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching all payments");
    }
  }
);

const initialState = {
  payments: [], // Lịch sử thanh toán
  allPayments: [], // Tất cả thanh toán cho admin
  payment: null, // Thông tin thanh toán hiện tại
  packages: [], // Danh sách gói dịch vụ
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: null,
  upgradeInfo: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalPayments: 0,
    limit: 10,
  },
  adminPagination: {
    currentPage: 1,
    totalPages: 1,
    totalPayments: 0,
    limit: 20,
  },
  adminStatistics: {
    total: 0,
    byStatus: {},
    byPackageType: {},
    totalAmount: 0,
    successfulAmount: 0,
    successRate: 0
  }
};

const paymentSlice = createSlice({
  name: "paymentSlice",
  initialState,
  reducers: {
    resetPaymentState(state) {
      state.isSuccess = false;
      state.isError = false;
      state.message = null;
      state.payment = null;
      state.upgradeInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Tạo thanh toán gói
      .addCase(createPackagePayment.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = null;
        state.payment = null;
        state.upgradeInfo = null;
      })
      .addCase(createPackagePayment.fulfilled, (state, action) => {
        if (action.payload.status === 200 || action.payload.status === 201) {
          state.isLoading = false;
          state.isSuccess = true;
          state.payment = action.payload.data.payment;
          state.message = action.payload.data.message;
          state.upgradeInfo = action.payload.data.upgradeInfo;
          // Không ghi đè packages ở đây
        } else {
          state.isLoading = false;
          state.isSuccess = false;
          state.isError = true;
          state.message = action.payload.data.message;
        }
      })
      .addCase(createPackagePayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload?.message || "Error creating payment";
      })

      // Xử lý webhook (ít dùng ở FE)
      .addCase(handlePackagePaymentWebhook.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(handlePackagePaymentWebhook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = action.payload.status === 200 || action.payload.status === 201;
        state.isError = !state.isSuccess;
        state.message = action.payload.data.message;
      })
      .addCase(handlePackagePaymentWebhook.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload?.message || "Error processing webhook";
      })

      // Kiểm tra trạng thái thanh toán gói
      .addCase(checkPackagePaymentStatus.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = null;
        // Không reset packages/history khi check trạng thái
      })
      .addCase(checkPackagePaymentStatus.fulfilled, (state, action) => {
        if (action.payload.status === 200 || action.payload.status === 201) {
          state.isLoading = false;
          state.isSuccess = true;
          state.payment = action.payload.data.payment;
          state.message = action.payload.data.message;
        } else {
          state.isLoading = false;
          state.isSuccess = false;
          state.isError = true;
          state.message = action.payload.data.message;
        }
      })
      .addCase(checkPackagePaymentStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload?.message || "Error checking payment status";
      })

      // Lấy lịch sử thanh toán
      .addCase(getDoctorPaymentHistory.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(getDoctorPaymentHistory.fulfilled, (state, action) => {
        if (action.payload.status === 200 || action.payload.status === 201) {
          state.isLoading = false;
          state.isSuccess = true;
          state.payments = action.payload.data.payments;
          state.message = action.payload.data.message;
          state.pagination = action.payload.data.pagination;
        } else {
          state.isLoading = false;
          state.isSuccess = false;
          state.isError = true;
          state.message = action.payload.data.message;
        }
      })
      .addCase(getDoctorPaymentHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload?.message || "Error fetching payment history";
      })

      // Hủy thanh toán gói
      .addCase(cancelPackagePayment.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(cancelPackagePayment.fulfilled, (state, action) => {
        if (action.payload.status === 200 || action.payload.status === 201) {
          state.isLoading = false;
          state.isSuccess = true;
          state.payment = action.payload.data.payment;
          state.message = action.payload.data.message;
        } else {
          state.isLoading = false;
          state.isSuccess = false;
          state.isError = true;
          state.message = action.payload.data.message;
        }
      })
      .addCase(cancelPackagePayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload?.message || "Error cancelling payment";
      })

      // Lấy danh sách gói dịch vụ
      .addCase(getPackages.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(getPackages.fulfilled, (state, action) => {
        if (action.payload.status === 200 || action.payload.status === 201) {
          state.isLoading = false;
          state.isSuccess = true;
          state.packages = action.payload.data.packages;
          state.message = action.payload.data.message;
        } else {
          state.isLoading = false;
          state.isSuccess = false;
          state.isError = true;
          state.message = action.payload.data.message;
        }
      })
      .addCase(getPackages.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload?.message || "Error fetching packages";
      })

      // Lấy tất cả thanh toán cho admin
      .addCase(getAllPayment.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(getAllPayment.fulfilled, (state, action) => {
        if (action.payload.status === 200 || action.payload.status === 201) {
          state.isLoading = false;
          state.isSuccess = true;
          state.allPayments = action.payload.data.payments;
          state.message = action.payload.data.message;
          state.adminPagination = action.payload.data.pagination;
          state.adminStatistics = action.payload.data.statistics;
        } else {
          state.isLoading = false;
          state.isSuccess = false;
          state.isError = true;
          state.message = action.payload.data.message;
        }
      })
      .addCase(getAllPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload?.message || "Error fetching all payments";
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;

export default paymentSlice;