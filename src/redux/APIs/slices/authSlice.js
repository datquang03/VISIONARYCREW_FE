import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getRequest,
  patchRequest,
  postRequest,
  postRequestFormData,
} from "../../../services/httpMethods";
import axiosClient from "../axios";

export const login = createAsyncThunk("Account/login", async (values) => {
  try {
    const res = await postRequest("users/login", values);
    return res;
  } catch (error) {
    return error;
  }
});

export const doctorLogin = createAsyncThunk("Account/doctorLogin", async (values) => {
  try {
    const res = await postRequest("doctors/login", values);
    return res;
  } catch (error) {
    return error;
  }
});

export const registerAcc = createAsyncThunk(
  "Account/registerAcc",
  async (payload) => {
    try {
      const response = await postRequest("users/register", payload);
      return response;
    } catch (error) {
      return error;
    }
  }
);

export const doctorRegisterAcc = createAsyncThunk(
  "Account/doctorRegisterAcc",
  async (payload) => {
    try {
      const response = await postRequestFormData("doctors/register", payload);
      return response;
    } catch (error) {
      return error;
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "Account/verifyEmail",
  async (payload) => {
    try {
      const response = await postRequest("users/verify-email", payload);
      return response;
    } catch (error) {
      return error;
    }
  }
);

export const resetPassword = createAsyncThunk(
  "Account/resetPassword",
  async (payload) => {
    try {
      const response = await postRequest(
        "users/reset-password-by-old",
        payload
      );
      return response;
    } catch (error) {
      return error;
    }
  }
);

export const updateProfile = createAsyncThunk(
  "Account/updateProfile",
  async (values) => {
    try {
      const res = await patchRequest("users/profile", values);
      return res;
    } catch (error) {
      return error;
    }
  }
);
export const getUserProfile = createAsyncThunk(
  "Account/getUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await getRequest(`users/${userId}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching doctors");
    }
  }
);
// Removed duplicate getDoctorProfile - use the one from doctorProfileSlice instead


const initialState = {
  user: null,
  doctor: null,
  isLoading: false,
  isSuccess: false,
  isError: null,
  message: null,
  updatedUser: null,
  isSuccessReg: false,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("doctorInfo");
      state.user = null;
      state.doctor = null;
      state.isSuccess = false;
      state.isLoading = false;
      state.isError = false;
      state.message = null;
    },
    setNull(state) {
      state.isSuccess = false;
      state.isSuccessReg = false;
      state.message = null;
      state.isError = null;
      state.isLoading = false;
      // Không reset user/doctor data để giữ thông tin đăng nhập
    },
    resetForm(state) {
      // Reset chỉ form state, giữ nguyên auth data
      state.isSuccess = false;
      state.isSuccessReg = false;
      state.message = null;
      state.isError = null;
      state.isLoading = false;
    },
    initializeAuth(state) {
      // Khởi tạo auth state từ localStorage
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        try {
          const parsedUserInfo = JSON.parse(userInfo);
          if (parsedUserInfo.role === "user") {
            state.user = parsedUserInfo;
            state.doctor = null;
          } else if (parsedUserInfo.role === "doctor") {
            state.doctor = parsedUserInfo;
            state.user = null;
          }
          
          // Cập nhật axios headers
          if (parsedUserInfo.token) {
            axiosClient.defaults.headers.common["Authorization"] = `Bearer ${parsedUserInfo.token}`;
          }
        } catch (error) {
          console.error("Error parsing userInfo:", error);
          localStorage.removeItem("userInfo");
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // User Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log('Login fulfilled, action.payload:', action.payload);
        // Backend trả về trực tiếp {message, user} thay vì {status, data}
        if (action.payload && action.payload.user && action.payload.user.token) {
          // Lưu user data vào localStorage
          const userData = {
            ...action.payload.user,
            role: action.payload.user.role || "user"
          };
          localStorage.setItem("userInfo", JSON.stringify(userData));
          // Cập nhật axios headers
          if (userData.token) {
            axiosClient.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
          }
          state.isSuccess = true;
          state.isLoading = false;
          state.isError = false;
          state.message = action.payload.message;
          state.user = userData;
          state.doctor = null; // Reset doctor state
          console.log('Login success, setting isSuccess to true');
        } else {
          console.log('Login failed, payload structure issue:', action.payload);
          state.message = action.payload?.message || "Đăng nhập thất bại";
          state.isSuccess = false;
          state.isLoading = false;
          state.isError = true;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload?.data?.message || action.payload?.message || "Đăng nhập thất bại";
      })
      
      // Doctor Login
      .addCase(doctorLogin.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = null;
      })
      .addCase(doctorLogin.fulfilled, (state, action) => {
        console.log('Doctor login fulfilled, action.payload:', action.payload);
        // Backend trả về trực tiếp {message, doctor} thay vì {status, data}
        if (action.payload && action.payload.doctor && action.payload.doctor.token) {
          // Lưu doctor data vào localStorage
          const doctorData = {
            ...action.payload.doctor,
            role: "doctor"
          };
          localStorage.setItem("userInfo", JSON.stringify(doctorData));
          // Cập nhật axios headers
          if (doctorData.token) {
            axiosClient.defaults.headers.common["Authorization"] = `Bearer ${doctorData.token}`;
          }
          state.isSuccess = true;
          state.isLoading = false;
          state.isError = false;
          state.message = action.payload.message;
          state.doctor = doctorData;
          state.user = null; // Reset user state
          console.log('Doctor login success, setting isSuccess to true');
        } else {
          console.log('Doctor login failed, payload structure issue:', action.payload);
          state.message = action.payload?.message || "Đăng nhập thất bại";
          state.isSuccess = false;
          state.isLoading = false;
          state.isError = true;
        }
      })
      .addCase(doctorLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload?.data?.message || action.payload?.message || "Đăng nhập thất bại";
      })

      .addCase(registerAcc.pending, (state) => {
        state.isLoading = true;
        state.isSuccessReg = false;
        state.isError = false;
      })
      .addCase(registerAcc.fulfilled, (state, action) => {
        if (action.payload && (action.payload.status === 200 || action.payload.status === 201)) {
          state.isSuccessReg = true;
          state.isLoading = false;
          state.isError = false;
          state.message = action.payload.data.message;
        } else {
          state.message = action.payload?.data?.message || action.payload?.message || "Đăng ký thất bại";
          state.isSuccessReg = false;
          state.isLoading = false;
          state.isError = true;
        }
      })
      .addCase(registerAcc.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccessReg = false;
        state.isError = true;
        state.message = action.payload?.data?.message || action.payload?.message || "Đăng ký thất bại";
      })
      .addCase(doctorRegisterAcc.pending, (state) => {
        state.isLoading = true;
        state.isSuccessReg = false;
        state.isError = false;
      })
      .addCase(doctorRegisterAcc.fulfilled, (state, action) => {
        // Kiểm tra nếu có message trong response
        if (action.payload && action.payload.message) {
          state.isSuccessReg = true;
          state.isLoading = false;
          state.isError = false;
          state.message = action.payload.message;
        } else {
          state.message = "Đăng ký thất bại";
          state.isSuccessReg = false;
          state.isLoading = false;
          state.isError = true;
        }
      })
      .addCase(doctorRegisterAcc.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccessReg = false;
        state.isError = true;
        state.message = action.payload?.message || "Đăng ký thất bại";
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (action.payload.status === 200 || action.payload.status === 201) {
          state.isLoading = false;
          state.isSuccess = true;
          state.updatedUser = action.payload.data.user;
          state.message = action.payload.data.message;
        } else {
          state.isLoading = false;
          state.isSuccess = false;
          state.isError = true;
          state.message = action.payload.data.message;
        }
      })
      .addCase(updateProfile.rejected, (state) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        if (action.payload.status === 200 || action.payload.status === 201) {
          state.isLoading = false;
          state.isSuccess = true;
          state.message = action.payload.data.message;
        } else {
          state.isLoading = false;
          state.isSuccess = false;
          state.isError = true;
          state.message = action.payload.data.message;
        }
      })
      .addCase(resetPassword.rejected, (state) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        if (action.payload.status === 200 || action.payload.status === 201) {
          state.isSuccess = true;
          state.isLoading = false;
          state.isError = false;
          state.message = action.payload.data.message;
        } else {
          state.message = action.payload.data.message;
          state.isSuccessReg = false;
          state.isLoading = false;
          state.isError = true;
        }
      })
      .addCase(verifyEmail.rejected, (state) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
      })
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.user = null
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        if (action.payload.status === 200 || action.payload.status === 201) {
          state.isSuccess = true;
          state.isLoading = false;
          state.isError = false;
          state.user = action.payload.data;
        } else {
          state.message = action.payload.data.message;
          state.isSuccessReg = false;
          state.isLoading = false;
          state.isError = true;
        }
      })
      .addCase(getUserProfile.rejected, (state) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
      })
      // Removed getDoctorProfile cases - use doctorProfileSlice instead
  },
});

export const { logout, setNull, initializeAuth, resetForm } = authSlice.actions;

export default authSlice;
