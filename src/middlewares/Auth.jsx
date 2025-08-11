import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useRef } from "react";
import { CustomToast } from "../components/Toast/CustomToast";
import useAuth from "../hooks/useAuth";

const ProtectedRouter = () => {
  const { isAuthenticated } = useAuth();
  const hasShownToast = useRef(false);
  
  useEffect(() => {
    // Delay check để tránh race condition với login process
    const timer = setTimeout(() => {
      if (!isAuthenticated && !hasShownToast.current) {
        CustomToast({ 
          message: "Vui lòng đăng nhập để truy cập trang này", 
          type: "error" 
        });
        hasShownToast.current = true;
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <Outlet />;
};

const AdminProtectedRouter = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const hasShownToast = useRef(false);
  
  useEffect(() => {
    // Delay check để tránh race condition với login process
    const timer = setTimeout(() => {
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
    }, 50);
    
    return () => clearTimeout(timer);
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
  const { isAuthenticated, isDoctor } = useAuth();
  const hasShownToast = useRef(false);
  
  useEffect(() => {
    // Delay check để tránh race condition với login process
    const timer = setTimeout(() => {
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
    }, 50);
    
    return () => clearTimeout(timer);
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
  const { isAuthenticated, isUser } = useAuth();
  const hasShownToast = useRef(false);
  
  useEffect(() => {
    // Delay check để tránh race condition với login process
    const timer = setTimeout(() => {
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
    }, 50);
    
    return () => clearTimeout(timer);
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
  const { isAuthenticated, isDoctor, isAdmin } = useAuth();
  const isAuthorized = isAdmin || isDoctor;
  const hasShownToast = useRef(false);
  
  useEffect(() => {
    // Delay check để tránh race condition với login process
    const timer = setTimeout(() => {
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
    }, 50);
    
    return () => clearTimeout(timer);
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
  const { isAuthenticated, isUser, isAdmin } = useAuth();
  const isAuthorized = isAdmin || isUser;
  const hasShownToast = useRef(false);
  
  useEffect(() => {
    // Delay check để tránh race condition với login process
    const timer = setTimeout(() => {
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
    }, 50);
    
    return () => clearTimeout(timer);
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
