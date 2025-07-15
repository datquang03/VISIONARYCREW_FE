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

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "./components/Toast/CustomToast";
import DashboardLayout from "./pages/Dashboard/components/DashboardLayout";

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer />
      <SidebarProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<DefaultLogin />} />
          <Route path="/login/doctor" element={<DoctorLogin />} />
          <Route path="/login/user" element={<UserLogin />} />
          <Route path="/register/user" element={<UserRegister />} />
          <Route path="/register/doctor" element={<DoctorRegister />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Booking */}
          <Route path="/booking" element={<UserBookingPage />} />
          <Route path="/booking/doctor" element={<DoctorSchedule />} />

          {/* Doctor packages */}
          <Route path="/doctor/packages" element={<DoctorPackages />} />

          {/* Admin layout with nested routes */}
          <Route path="/admin" element={<DashboardLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="doctors" element={<DoctorsPage />} />
            <Route path="doctors/pending" element={<DoctorRegisterTab />} />
            <Route path="users" element={<UsersManagement />} />
          </Route>

          {/* Doctor layout with nested routes */}
          <Route path="/doctor" element={<DashboardLayout />}>
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="register/form" element={<DoctorRegisterForm />} />
          </Route>
        </Routes>
      </SidebarProvider>
    </BrowserRouter>
  );
};

export default App;
