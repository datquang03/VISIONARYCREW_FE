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
    if (error.response?.status === 401) {
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const handleDangNhap = (newToken) => {
  let userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    try {
      const parsedUserInfo = JSON.parse(userInfo);
      parsedUserInfo.token = newToken?.token;
      localStorage.setItem("userInfo", JSON.stringify(parsedUserInfo));
      const token = newToken?.token;
      if (token) {
        axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error parsing userInfo in handleDangNhap:", error);
      localStorage.removeItem("userInfo"); // Xóa userInfo không hợp lệ
    }
  }
};

export default axiosClient;