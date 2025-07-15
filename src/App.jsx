import Homepage from "./pages/Home/Homepage";
import DefaultLogin from "./pages/Authentication/defaultLogin";
import DoctorLogin from "./pages/Authentication/Doctor/Login";
import UserLogin from "./pages/Authentication/User/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserRegister from "./pages/Authentication/User/Register";
import DoctorRegister from "./pages/Authentication/Doctor/Register";
import UserBookingPage from "./pages/Booking/UserBookingPage";
import DoctorSchedule from "./pages/Booking/DoctorBookingPage";
import VerifyEmail from "./pages/Authentication/verifyEmailPage";
import 'react-toastify/dist/ReactToastify.css'; // Keep this for styles
import { ToastContainer } from "./components/Toast/CustomToast";

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer /> {/* Using the exported ToastContainer from CustomToast.js */}
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
      </Routes>
    </BrowserRouter>
  );
};

export default App;