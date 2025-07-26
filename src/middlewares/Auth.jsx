import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const getUserInfo = (state) => {
  // Lấy từ redux slice
  const { user, doctor } = state.authSlice || {};
  
  // Lấy từ localStorage nếu redux chưa có
  const localUserInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;
  
  // Ưu tiên redux state, fallback về localStorage
  return user || doctor || localUserInfo;
};

const ProtectedRouter = () => {
  const userInfo = useSelector((state) => getUserInfo(state));
  return userInfo?.token ? <Outlet /> : <Navigate to="/login" />;
};

const AdminProtectedRouter = () => {
  const userInfo = useSelector((state) => getUserInfo(state));
  const isAuthenticated = !!userInfo?.token;
  const isAdmin = userInfo?.role === "admin";
  
  return isAuthenticated ? (isAdmin ? <Outlet /> : <Navigate to="/" />) : <Navigate to="/login" />;
};

const DoctorProtectedRouter = () => {
  const userInfo = useSelector((state) => getUserInfo(state));
  const isAuthenticated = !!userInfo?.token;
  const isDoctor = userInfo?.role === "doctor";
  return isAuthenticated ? (isDoctor ? <Outlet /> : <Navigate to="/" />) : <Navigate to="/login" />;
};

const UserProtectedRouter = () => {
  const userInfo = useSelector((state) => getUserInfo(state));
  const isAuthenticated = !!userInfo?.token;
  const isUser = userInfo?.role === "user";
  return isAuthenticated ? (isUser ? <Outlet /> : <Navigate to="/" />) : <Navigate to="/login" />;
};

const DoctorAndAdminProtectedRouter = () => {
  const userInfo = useSelector((state) => getUserInfo(state));
  const isAuthenticated = !!userInfo?.token;
  const isAuthorized = userInfo?.role === "admin" || userInfo?.role === "doctor";
  return isAuthenticated ? (isAuthorized ? <Outlet /> : <Navigate to="/" />) : <Navigate to="/login" />;
};

export {
  ProtectedRouter,
  AdminProtectedRouter,
  DoctorAndAdminProtectedRouter,
  DoctorProtectedRouter,
  UserProtectedRouter,
};
