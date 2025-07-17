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

// Admin
import AdminDashboard from "./pages/Dashboard/Admin/AdminDashboard";
import DoctorRegisterTab from "./pages/Dashboard/Admin/DoctorRegisterTab";
import DoctorsPage from "./pages/Dashboard/Admin/DoctorTab";
import UsersManagement from "./pages/Dashboard/Admin/UsersManagement";

// Doctor
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
import DashboardLayout from "./pages/Dashboard/components/DashboardLayout";
import UserProfile from "./pages/Profile/User/UserProfile";


const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer />{" "}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<DefaultLogin />} />
        <Route path="/login/doctor" element={<DoctorLogin />} />
        <Route path="/login/user" element={<UserLogin />} />
        <Route path="/register/user" element={<UserRegister />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/register/doctor" element={<DoctorRegister />} />
        <Route path="/booking" element={<UserBookingPage />} />
        <Route path="/booking/doctor" element={<DoctorSchedule />} />
        <Route element={<ProtectedRouter />}>
          <Route element={<AdminProtectedRouter />}>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/dashboard/doctors" element={<DoctorsPage />} />
            <Route path="/dashboard/users" element={<UsersManagement />} />
            <Route
              path="/dashboard/doctor-register"
              element={<DoctorRegisterTab />}
            />
          </Route>
          <Route element={<DoctorProtectedRouter />}>
            <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
            <Route
              path="/dashboard/doctor/register"
              element={<DoctorRegisterForm />}
            />
            <Route
              path="/dashboard/doctor/packages"
              element={<DoctorPackages />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
