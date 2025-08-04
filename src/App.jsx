import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { initializeAuth } from "./redux/APIs/slices/authSlice";
import Homepage from "./pages/Home/Homepage";
import DefaultLogin from "./pages/Authentication/defaultLogin";
import DoctorLogin from "./pages/Authentication/Doctor/Login";
import UserLogin from "./pages/Authentication/User/Login";
import UserRegister from "./pages/Authentication/User/Register";
import DoctorRegister from "./pages/Authentication/Doctor/Register";
import VerifyEmail from "./pages/Authentication/verifyEmailPage";
import UserBookingPage from "./pages/Booking/UserBookingPage";
import DoctorSchedule from "./pages/Booking/DoctorBookingPage";
import DoctorPackages from "./pages/Package/DoctorPackage";
import AdminDashboard from "./pages/Dashboard/Admin/AdminDashboard";
import DoctorRegisterTab from "./pages/Dashboard/Admin/DoctorRegisterTab";
import DoctorsPage from "./pages/Dashboard/Admin/DoctorTab";
import UsersManagement from "./pages/Dashboard/Admin/UsersManagement";
import AdminFeedback from "./pages/Dashboard/Admin/AdminFeedback";
import AdminPayment from "./pages/Dashboard/Admin/AdminPayment";
import DoctorDashboard from "./pages/Dashboard/Doctor/DoctorDashboard";
import DoctorRegisterForm from "./pages/Dashboard/Doctor/DoctorRegisterForm";
import DoctorFeedback from "./pages/Dashboard/Doctor/DoctorFeedback";
import UserProfileDetail from "./pages/Profile/User/UserProfileDetail";
import DoctorProfileDetail from "./pages/Profile/Doctor/DoctorProfileDetail";
import UserChatPage from "./pages/Chat/UserChatPage";
import DoctorChatPage from "./pages/Chat/DoctorChatPage";
import { SidebarProvider } from "./pages/Dashboard/components/SidebarContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "./components/Toast/CustomToast";
import {
  AdminProtectedRouter,
  DoctorProtectedRouter,
  AdminAndUserProtectedRouter,
} from "./middlewares/Auth";
// Xóa import các ProtectedRouter vì không dùng nữa
import UserProfile from "./pages/Profile/User/UserProfile";
import DoctorDashboardContent from "./pages/Dashboard/Doctor/DoctorRegisterForm";
import DoctorProfile from "./pages/Profile/Doctor/DoctorProfile";
import DoctorPaymentSuccess from "./pages/Package/DoctorPaymentSuccess";
import DoctorPaymentHistory from "./pages/Dashboard/Doctor/DoctorPaymentHistory";
import DoctorPaymentFail from "./pages/Package/DoctorPaymentFail";
import DoctorPendingSchedule from "./pages/Dashboard/Doctor/DoctorPendingSchedule";
import AIChatBubble from "./components/AIChatBubble/AIChatBubble";
import DoctorHome from "./pages/Dashboard/Doctor/DoctorHome";
import MandatoryFeedback from "./components/MandatoryFeedback/MandatoryFeedback";


const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Khởi tạo auth state từ localStorage khi app khởi động (chỉ một lần)
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      dispatch(initializeAuth());
    }
  }, [dispatch]); // Thêm dispatch vào dependency array

  return (
    <BrowserRouter>
      <SidebarProvider>
        <ToastContainer />
        <AIChatBubble />
        <MandatoryFeedback />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<DefaultLogin />} />
          <Route path="/login/doctor" element={<DoctorLogin />} />
          <Route path="/login/user" element={<UserLogin />} />
          <Route path="/register/user" element={<UserRegister />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/register/doctor" element={<DoctorRegister />} />


          {/* User protected routes */}
          <Route element={<AdminAndUserProtectedRouter />}>
            <Route path="/booking" element={<UserBookingPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/profile/user/:userId" element={<UserProfileDetail />} />
            <Route path="/chat" element={<UserChatPage />} />
          </Route>

          {/* Admin protected routes */}
          <Route element={<AdminProtectedRouter />}>
            <Route path="/admin" element={<AdminDashboard />}>
              <Route index element={<div>Welcome to Admin Dashboard</div>} />
              <Route
                path="dashboard"
                element={<div>Admin Dashboard Content</div>}
              />
              <Route path="doctors" element={<DoctorsPage />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="doctors/pending" element={<DoctorRegisterTab />} />
              <Route path="feedback" element={<AdminFeedback />} />
              <Route path="payments" element={<AdminPayment />} />
            </Route>
            <Route path="/profile/doctor/:doctorId" element={<DoctorProfileDetail />} />
          </Route>

          {/* Doctor protected routes */}
          <Route element={<DoctorProtectedRouter />}>
            <Route path="/doctor" element={<DoctorDashboard />}>
              <Route index element={<DoctorHome />} />
              <Route path="dashboard" element={<DoctorHome />} />
              <Route
                path="payment/history"
                element={<DoctorPaymentHistory />}
              />
              <Route path="pending" element={<DoctorPendingSchedule />} />
              <Route path="form" element={<DoctorRegisterForm />} />
              <Route path="feedback" element={<DoctorFeedback />} />
              <Route path="chat" element={<DoctorChatPage />} />
            </Route>
            <Route path="/doctor/booking" element={<DoctorSchedule />} />
            <Route path="/doctor/packages" element={<DoctorPackages />} />
            <Route path="/doctor/profile" element={<DoctorProfile />} />
            <Route
              path="/doctor/payment/success"
              element={<DoctorPaymentSuccess />}
            />
            <Route
              path="/doctor/payment/cancelled"
              element={<DoctorPaymentFail />}
            />
          </Route>
        </Routes>
      </SidebarProvider>
    </BrowserRouter>
  );
};

export default App;
