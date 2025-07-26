import axios from "axios";

let userInfo = localStorage.getItem("userInfo");
let accessToken = null;

if (userInfo) {
  try {
    accessToken = JSON.parse(userInfo).token || null;
  } catch (error) {
    console.error("Error parsing userInfo:", error);
    localStorage.removeItem("userInfo"); // Xóa userInfo không hợp lệ
  }
}
const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    let userInfo = localStorage.getItem("userInfo");
    let accessToken = null;

    if (userInfo) {
      try {
        accessToken = JSON.parse(userInfo).token || null;
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (error) {
        console.error("Error parsing userInfo in interceptor:", error);
        localStorage.removeItem("userInfo"); // Xóa userInfo không hợp lệ
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response, // Trả về response nguyên bản
  (error) => {
    // Chỉ xử lý 401 khi không phải là request login
    if (error.response?.status === 401 && !error.config.url.includes('login')) {
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const handleDangNhap = (data) => {
  // data có thể là { user, token } hoặc { doctor, token }
  const token = data?.token;
  const userData = data?.user || data?.doctor;
  
  if (token && userData) {
    // Cập nhật axios headers và localStorage
    axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    
    // Đảm bảo localStorage được cập nhật
    const userInfo = {
      ...userData,
      token: token,
      role: data?.user ? "user" : "doctor"
    };
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  }
};

export default axiosClient;