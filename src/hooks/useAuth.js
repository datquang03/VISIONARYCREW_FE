import { useSelector } from 'react-redux';
import { useMemo } from 'react';

const useAuth = () => {
  const { user, doctor } = useSelector((state) => state.authSlice || {});
  
  // Lấy từ localStorage một cách an toàn
  const localUserInfo = useMemo(() => {
    try {
      const stored = localStorage.getItem("userInfo");
      if (!stored) return null;
      
      const parsed = JSON.parse(stored);
      // Validate parsed data has required fields
      if (parsed && typeof parsed === 'object' && parsed.token) {
        return parsed;
      }
      return null;
    } catch (error) {
      console.error("Error parsing userInfo:", error);
      localStorage.removeItem("userInfo"); // Remove corrupted data
      return null;
    }
  }, []); // Stable reference
  
  // Ưu tiên Redux state, fallback về localStorage
  const userInfo = useMemo(() => {
    const reduxUser = user || doctor;
    if (reduxUser && reduxUser.token) {
      return reduxUser;
    }
    return localUserInfo;
  }, [user, doctor, localUserInfo]);
  
  const isAuthenticated = useMemo(() => {
    return !!(userInfo && userInfo.token && userInfo.role);
  }, [userInfo]);
  
  const role = useMemo(() => userInfo?.role, [userInfo?.role]);
  const isUser = useMemo(() => role === "user", [role]);
  const isDoctor = useMemo(() => role === "doctor", [role]);
  const isAdmin = useMemo(() => role === "admin", [role]);
  
  return {
    userInfo,
    isAuthenticated,
    role,
    isUser,
    isDoctor,
    isAdmin,
  };
};

export default useAuth;
