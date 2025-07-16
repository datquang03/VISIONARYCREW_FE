import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRouter = () => {
  const { userInfo } = useSelector((state) => state.authSlice);
  const localUserInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;
  return userInfo?.token || localUserInfo?.token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

const AdminProtectedRouter = () => {
  const userLogin = useSelector((state) => state.userLogin || {});
  const userInfo = userLogin.userInfo;
  const localUserInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

  const isAuthenticated = userInfo?.token || localUserInfo?.token;
  const isAdmin = userInfo?.role === "admin" || localUserInfo?.role === "admin";

  return isAuthenticated ? (
    isAdmin ? <Outlet /> : <Navigate to="/*" />
  ) : (
    <Navigate to="/login" />
  );
};

const DoctorProtectedRouter = () => {
  const { userInfo } = useSelector((state) => state.authSlice);
  const localUserInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;
  const isAuthenticated = userInfo?.token || localUserInfo?.token;
  const isAdmin =
    userInfo?.role === "doctor" || localUserInfo?.role === "doctor";

  return isAuthenticated ? (
    isAdmin ? (
      <Outlet />
    ) : (
      <Navigate to="/*" />
    )
  ) : (
    <Navigate to="/login" />
  );
};

const DoctorAndAdminProtectedRouter = () => {
  const { userInfo } = useSelector((state) => state.userLogin);
  const localUserInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;
  const isAuthenticated = userInfo?.token || localUserInfo?.token;
  const isAuthorized =
    userInfo?.role === "admin" ||
    userInfo?.role === "doctor" ||
    localUserInfo?.role === "admin" ||
    localUserInfo?.role === "doctor";

  return isAuthenticated ? (
    isAuthorized ? (
      <Outlet />
    ) : (
      <Navigate to="/*" />
    )
  ) : (
    <Navigate to="/login" />
  );
};

export {
  ProtectedRouter,
  AdminProtectedRouter,
  DoctorAndAdminProtectedRouter,
  DoctorProtectedRouter,
};
