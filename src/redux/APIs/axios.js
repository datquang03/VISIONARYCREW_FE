import axios from "axios";

let userInfo = localStorage.getItem("userInfo");
let accessToken = userInfo ? JSON.parse(userInfo).token : null;
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
    accessToken = userInfo ? JSON.parse(userInfo).token : null;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const handleDangNhap = (newToken) => {
  let userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const parsedUserInfo = JSON.parse(userInfo);
    parsedUserInfo.token = newToken?.token;
    localStorage.setItem("userInfo", JSON.stringify(parsedUserInfo));
    const token = newToken?.token;
    axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

export default axiosClient;
