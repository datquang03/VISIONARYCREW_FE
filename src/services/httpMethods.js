
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
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const getRequest = async (url) => {
  return await axiosInstance.get(url);
};

export const getRequestParams = async (url, params) => {
  return await axiosInstance.get(url, { params });
};

export const postRequest = async (url, data) => {
  return await axiosInstance.post(url, data);
};

export const postRequestFormData = async (url, formData) => {
  return await axiosInstance.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const putRequest = async (url, data) => {
  return await axiosInstance.put(url, data);
};

export const putRequestFormData = async (url, formData) => {
  return await axiosInstance.put(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const putRequestParams = async (url, params) => {
  const queryString = new URLSearchParams(params).toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  return await axiosInstance.put(fullUrl);
};

export const deleteRequest = async (url, data) => {
  return await axiosInstance.delete(url, { data });
};

export const patchRequest = async (url, data) => {
  return await axiosInstance.patch(url, data);
};

export default axiosInstance;