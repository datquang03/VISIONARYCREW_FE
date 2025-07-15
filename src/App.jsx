import Homepage from "./pages/Home/Homepage";
import DefaultLogin from "./pages/Authentication/defaultLogin";
import DoctorLogin from "./pages/Authentication/Doctor/Login";
import UserLogin from "./pages/Authentication/User/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserRegister from "./pages/Authentication/User/Register";
import DoctorRegister from "./pages/Authentication/Doctor/Register";
import UserBookingPage from "./pages/Booking/UserBookingPage";
import DoctorSchedule from "./pages/Booking/DoctorBookingPage";
import DoctorPackages from "./pages/Package/DoctorPackage";
import AdminDashboard from "./pages/Dashboard/Admin/AdminDashboard";
import DoctorRegisterTab from "./pages/Dashboard/Admin/DoctorRegisterTab";
import DoctorsPage from "./pages/Dashboard/Admin/DoctorTab";
import { SidebarProvider } from "./pages/Dashboard/components/SidebarContext";
import DoctorDashboard from "./pages/Dashboard/Doctor/DoctorDashboard";
import DoctorRegisterForm from "./pages/Dashboard/Doctor/DoctorRegisterForm";
import UsersManagement from "./pages/Dashboard/Admin/UsersManagement";

const App = () => {
  return (
    <SidebarProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<DefaultLogin />} />
          <Route path="/login/doctor" element={<DoctorLogin />} />
          <Route path="/login/user" element={<UserLogin />} />
          <Route path="/register/user" element={<UserRegister />} />
          <Route path="/register/doctor" element={<DoctorRegister />} />
          <Route path="/booking" element={<UserBookingPage />} />
          <Route path="/booking/doctor" element={<DoctorSchedule />} />
          <Route path="/doctor/packages" element={<DoctorPackages />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />}>
            <Route index element={<AdminDashboard />} />
            <Route path="doctors" element={<DoctorsPage />} />
            <Route path="doctors/pending" element={<DoctorRegisterTab />} />
            <Route path="users" element={<UsersManagement />} />
          </Route>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />}>
            <Route index element={<DoctorRegisterForm />} />
            <Route path="register/form" element={<DoctorRegisterForm />} />
          </Route>
          {/* Add more routes as needed */}
        </Routes>
      </BrowserRouter>
    </SidebarProvider>
  );
};

export default App;