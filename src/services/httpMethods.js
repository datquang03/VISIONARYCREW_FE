
import axios from "axios";

// Smart API URL detection
let API_URL;
if (import.meta.env.VITE_API_URL) {
  // Nếu có env variable, sử dụng trực tiếp và thêm /api nếu chưa có
  API_URL = import.meta.env.VITE_API_URL.endsWith('/api') 
    ? import.meta.env.VITE_API_URL 
    : import.meta.env.VITE_API_URL + '/api';
} else {
  // Nếu không có env variable, sử dụng proxy trong dev, direct URL trong prod
  API_URL = import.meta.env.DEV ? "/api" : "https://visionarycrew-be-rpo7.vercel.app/api";
}

console.log('API_URL:', API_URL);
console.log('import.meta.env.DEV:', import.meta.env.DEV);
console.log('import.meta.env.VITE_API_URL:', import.meta.env.VITE_API_URL);

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Tạm thời comment withCredentials để test
  // withCredentials: true,
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from userInfo object trong localStorage
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        const token = parsedUserInfo.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error parsing userInfo in httpMethods:", error);
        localStorage.removeItem("userInfo");
      }
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
      localStorage.removeItem("userInfo");
      // Chỉ redirect nếu không phải login request
      if (!error.config.url.includes('login')) {
        window.location.href = "/login";
      }
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

// Helper function - không cần thêm /api prefix nữa vì baseURL đã có
const normalizeUrl = (url) => {
  // Chỉ đảm bảo URL không bắt đầu với /
  return url.startsWith('/') ? url.slice(1) : url;
};

export const getRequest = async (url, params) => {
  try {
    return await axiosInstance.get(normalizeUrl(url), { params });
  } catch (error) {
    throw error;
  }
};

export const postRequest = async (url, data) => {
  try {
    return await axiosInstance.post(normalizeUrl(url), data);
  } catch (error) {
    throw error;
  }
};

export const postRequestFormData = async (url, formData) => {
  try {
    return await axiosInstance.post(normalizeUrl(url), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    throw error;
  }
};

export const putRequest = async (url, data) => {
  try {
    return await axiosInstance.put(ensureApiPrefix(url), data);
  } catch (error) {
    throw error;
  }
};

export const putRequestFormData = async (url, formData) => {
  try {
    return await axiosInstance.put(normalizeUrl(url), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    throw error;
  }
};

export const patchRequest = async (url, data) => {
  try {
    return await axiosInstance.patch(normalizeUrl(url), data);
  } catch (error) {
    throw error;
  }
};

export const deleteRequest = async (url, data) => {
  try {
    return await axiosInstance.delete(normalizeUrl(url), { data });
  } catch (error) {
    throw error;
  }
};

export default axiosInstance;