import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useMemo, useEffect, useRef } from "react";
import { CustomToast } from "../components/Toast/CustomToast";

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
  const isAuthenticated = useMemo(() => !!userInfo?.token, [userInfo?.token]);
  const hasShownToast = useRef(false);
  
  useEffect(() => {
    if (!isAuthenticated && !hasShownToast.current) {
      CustomToast({ 
        message: "Vui lòng đăng nhập để truy cập trang này", 
        type: "error" 
      });
      hasShownToast.current = true;
    }
  }, [isAuthenticated]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <Outlet />;
};

const AdminProtectedRouter = () => {
  const userInfo = useSelector((state) => getUserInfo(state));
  const isAuthenticated = useMemo(() => !!userInfo?.token, [userInfo?.token]);
  const isAdmin = useMemo(() => userInfo?.role === "admin", [userInfo?.role]);
  const hasShownToast = useRef(false);
  
  useEffect(() => {
    if (!isAuthenticated && !hasShownToast.current) {
      CustomToast({ 
        message: "Vui lòng đăng nhập để truy cập trang này", 
        type: "error" 
      });
      hasShownToast.current = true;
    } else if (isAuthenticated && !isAdmin && !hasShownToast.current) {
      CustomToast({ 
        message: "Chỉ admin mới có quyền truy cập trang này", 
        type: "error" 
      });
      hasShownToast.current = true;
    }
  }, [isAuthenticated, isAdmin]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  return <Outlet />;
};

const DoctorProtectedRouter = () => {
  const userInfo = useSelector((state) => getUserInfo(state));
  const isAuthenticated = useMemo(() => !!userInfo?.token, [userInfo?.token]);
  const isDoctor = useMemo(() => userInfo?.role === "doctor", [userInfo?.role]);
  const hasShownToast = useRef(false);
  
  useEffect(() => {
    if (!isAuthenticated && !hasShownToast.current) {
      CustomToast({ 
        message: "Vui lòng đăng nhập để truy cập trang này", 
        type: "error" 
      });
      hasShownToast.current = true;
    } else if (isAuthenticated && !isDoctor && !hasShownToast.current) {
      CustomToast({ 
        message: "Chỉ bác sĩ mới có quyền truy cập trang này", 
        type: "error" 
      });
      hasShownToast.current = true;
    }
  }, [isAuthenticated, isDoctor]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isDoctor) {
    return <Navigate to="/" />;
  }
  
  return <Outlet />;
};

const UserProtectedRouter = () => {
  const userInfo = useSelector((state) => getUserInfo(state));
  const isAuthenticated = useMemo(() => !!userInfo?.token, [userInfo?.token]);
  const isUser = useMemo(() => userInfo?.role === "user", [userInfo?.role]);
  const hasShownToast = useRef(false);
  
  useEffect(() => {
    if (!isAuthenticated && !hasShownToast.current) {
      CustomToast({ 
        message: "Vui lòng đăng nhập để truy cập trang này", 
        type: "error" 
      });
      hasShownToast.current = true;
    } else if (isAuthenticated && !isUser && !hasShownToast.current) {
      CustomToast({ 
        message: "Chỉ người dùng thường mới có quyền truy cập trang này", 
        type: "error" 
      });
      hasShownToast.current = true;
    }
  }, [isAuthenticated, isUser]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isUser) {
    return <Navigate to="/" />;
  }
  
  return <Outlet />;
};

const DoctorAndAdminProtectedRouter = () => {
  const userInfo = useSelector((state) => getUserInfo(state));
  const isAuthenticated = useMemo(() => !!userInfo?.token, [userInfo?.token]);
  const isAuthorized = useMemo(() => userInfo?.role === "admin" || userInfo?.role === "doctor", [userInfo?.role]);
  const hasShownToast = useRef(false);
  
  useEffect(() => {
    if (!isAuthenticated && !hasShownToast.current) {
      CustomToast({ 
        message: "Vui lòng đăng nhập để truy cập trang này", 
        type: "error" 
      });
      hasShownToast.current = true;
    } else if (isAuthenticated && !isAuthorized && !hasShownToast.current) {
      CustomToast({ 
        message: "Chỉ admin và bác sĩ mới có quyền truy cập trang này", 
        type: "error" 
      });
      hasShownToast.current = true;
    }
  }, [isAuthenticated, isAuthorized]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isAuthorized) {
    return <Navigate to="/" />;
  }
  
  return <Outlet />;
};

const AdminAndUserProtectedRouter = () => {
  const userInfo = useSelector((state) => getUserInfo(state));
  const isAuthenticated = useMemo(() => !!userInfo?.token, [userInfo?.token]);
  const isAuthorized = useMemo(() => userInfo?.role === "admin" || userInfo?.role === "user", [userInfo?.role]);
  const hasShownToast = useRef(false);
  
  useEffect(() => {
    if (!isAuthenticated && !hasShownToast.current) {
      CustomToast({ 
        message: "Vui lòng đăng nhập để truy cập trang này", 
        type: "error" 
      });
      hasShownToast.current = true;
    } else if (isAuthenticated && !isAuthorized && !hasShownToast.current) {
      CustomToast({ 
        message: "Chỉ admin và người dùng thường mới có quyền truy cập trang này", 
        type: "error" 
      });
      hasShownToast.current = true;
    }
  }, [isAuthenticated, isAuthorized]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isAuthorized) {
    return <Navigate to="/" />;
  }
  
  return <Outlet />;
};

export {
  ProtectedRouter,
  AdminProtectedRouter,
  DoctorAndAdminProtectedRouter,
  DoctorProtectedRouter,
  UserProtectedRouter,
  AdminAndUserProtectedRouter,
};
