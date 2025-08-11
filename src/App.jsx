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
import FeedbackPage from "./pages/Feedback/FeedbackPage";
import AboutUsPage from "./pages/AboutUs/AboutUsPage";
import DoctorBlog from "./pages/Dashboard/Doctor/DoctorBlog";


const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Luôn khởi tạo auth state từ localStorage khi app khởi động
    dispatch(initializeAuth());
  }, [dispatch]); // Chỉ chạy một lần khi component mount

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
            <Route path="/profile/doctor/:doctorId" element={<DoctorProfileDetail />} />
            <Route path="/profile/user/:userId" element={<UserProfileDetail />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="blog" element={<DoctorBlog />} />


          {/* User protected routes */}
          <Route element={<AdminAndUserProtectedRouter />}>
            <Route path="/booking" element={<UserBookingPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/chat" element={<UserChatPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
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
              <Route path="blog" element={<DoctorBlog />} />
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
