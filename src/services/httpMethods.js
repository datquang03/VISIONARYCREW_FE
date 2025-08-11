
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://visionarycrew-be-rpo7.vercel.app/api";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject({
      message: error.message || "Có lỗi xảy ra khi gửi yêu cầu"
    });
  }
);

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
      });
    }

    // Handle 401 Unauthorized
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject({
        message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
      });
    }

    // Handle 404 Not Found
    if (error.response.status === 404) {
      return Promise.reject({
        message: "Không tìm thấy tài nguyên yêu cầu."
      });
    }

    // Handle other errors
    return Promise.reject({
      message: error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại sau."
    });
  }
);

export const getRequest = async (url, params) => {
  try {
    return await axiosInstance.get(url, { params });
  } catch (error) {
    throw error;
  }
};

export const postRequest = async (url, data) => {
  try {
    return await axiosInstance.post(url, data);
  } catch (error) {
    throw error;
  }
};

export const postRequestFormData = async (url, formData) => {
  try {
    return await axiosInstance.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    throw error;
  }
};

export const putRequest = async (url, data) => {
  try {
    return await axiosInstance.put(url, data);
  } catch (error) {
    throw error;
  }
};

export const putRequestFormData = async (url, formData) => {
  try {
    return await axiosInstance.put(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    throw error;
  }
};

export const deleteRequest = async (url, data) => {
  try {
    return await axiosInstance.delete(url, { data });
  } catch (error) {
    throw error;
  }
};

export default axiosInstance;