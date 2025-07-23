import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import DoctorDashboard from "./pages/Dashboard/Doctor/DoctorDashboard";
import DoctorRegisterForm from "./pages/Dashboard/Doctor/DoctorRegisterForm";
import { SidebarProvider } from "./pages/Dashboard/components/SidebarContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "./components/Toast/CustomToast";
import {
  AdminProtectedRouter,
  DoctorProtectedRouter,
  ProtectedRouter,
} from "./middlewares/Auth";
import UserProfile from "./pages/Profile/User/UserProfile";
import DoctorDashboardContent from "./pages/Dashboard/Doctor/DoctorRegisterForm";
import DoctorProfile from "./pages/Profile/Doctor/DoctorProfile";
import DoctorPaymentSuccess from "./pages/Package/DoctorPaymentSuccess";
import DoctorPaymentHistory from "./pages/Dashboard/Doctor/DoctorPaymentHistory";

const App = () => {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<DefaultLogin />} />
          <Route path="/login/doctor" element={<DoctorLogin />} />
          <Route path="/login/user" element={<UserLogin />} />
          <Route path="/register/user" element={<UserRegister />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/register/doctor" element={<DoctorRegister />} />
          <Route path="/booking" element={<UserBookingPage />} />
          <Route element={<ProtectedRouter />}>
            <Route path="/profile" element={<UserProfile />} />
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
              </Route>
            </Route>
            <Route element={<DoctorProtectedRouter />}>
              <Route path="/doctor" element={<DoctorDashboard />}>
                <Route path="dashboard" element={<DoctorDashboardContent />} />
                <Route path="payment/history" element={<DoctorPaymentHistory />} />
                <Route path="form" element={<DoctorRegisterForm />} />
              </Route>
              <Route path="/doctor/booking" element={<DoctorSchedule />} />
              <Route path="/doctor/packages" element={<DoctorPackages />} />
              <Route path="/doctor/profile" element={<DoctorProfile />} />
              <Route path="/doctor/payment/success" element={<DoctorPaymentSuccess />} />
            </Route>
          </Route>
        </Routes>
      </SidebarProvider>
    </BrowserRouter>
  );
};

export default App;
