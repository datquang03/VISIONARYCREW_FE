import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import CustomButton from "../../../components/buttons/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { registerAcc, setNull } from "../../../redux/APIs/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { CustomToast } from "../../../components/Toast/CustomToast";
import { motion } from "framer-motion";
const UserRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, isError, isSuccessReg, message } = useSelector(
    (state) => state.authSlice
  );
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    password: "",
  });

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoading) {
      dispatch(registerAcc(formData));
    }
  };

  useEffect(() => {
    if (isError) {
      CustomToast({ message, type: "error" });
      setTimeout(() => dispatch(setNull()), 3000);
    }
    if (isSuccessReg) {
      CustomToast({ message, type: "success" });
      setFormData({
        username: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        password: "",
      });
      setTimeout(() => {
        dispatch(setNull());
        navigate("/doctors/login");
      }, 1000);
    }
  }, [isSuccessReg, isError, dispatch, navigate]);

  useEffect(() => {
    return () => {
      dispatch(setNull());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-cyan-300 px-4 relative">
      <CustomButton text="Trở về" to="/login" position="top-left" />

      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Left: Form */}
          <div className="md:w-1/2 p-10 bg-white flex flex-col justify-center">
            <motion.h2
              className="text-3xl font-bold text-blue-700 text-center mb-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              Đăng ký Người dùng
            </motion.h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <InputField
                icon={<FaUser />}
                name="username"
                type="text"
                placeholder="Tên đăng nhập"
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading}
              />

              {/* Email */}
              <InputField
                icon={<FaEnvelope />}
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />

              {/* Phone */}
              <InputField
                icon={<FaPhone />}
                name="phone"
                type="tel"
                placeholder="Số điện thoại"
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
              />

              {/* Date of Birth */}
              <InputField
                icon={<FaBirthdayCake />}
                name="dateOfBirth"
                type="date"
                placeholder="Ngày sinh"
                value={formData.dateOfBirth}
                onChange={handleChange}
                disabled={isLoading}
              />

              {/* Password */}
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>

              {/* Submit button */}
              <motion.button
                type="submit"
                whileHover={{ scale: isLoading ? 1 : 1.05 }}
                whileTap={{ scale: isLoading ? 1 : 0.95 }}
                disabled={isLoading}
                className={`w-full py-3 rounded-xl font-semibold shadow-md transition flex items-center justify-center mt-4 ${
                  isLoading
                    ? "bg-blue-300 text-gray-100 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  "Đăng ký"
                )}
              </motion.button>

              {/* Verify Account Button */}
              {!isLoading && (
                <motion.button
                  onClick={() => navigate("/verify-email")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-blue-600 transition cursor-pointer flex items-center justify-center mt-4"
                >
                  Xác minh tài khoản
                </motion.button>
              )}
            </form>
          </div>

          {/* Right: Illustration */}
          <motion.div
            className="md:w-1/2 p-6 bg-gradient-to-br from-blue-100 to-white flex flex-col justify-center items-center"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <FaUser className="text-6xl text-blue-500 mb-4" />
            <p className="text-xl text-center text-blue-800 font-semibold">
              Tạo tài khoản để bắt đầu hành trình khám phá dịch vụ y tế.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const InputField = ({ icon, disabled, ...rest }) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">
      {icon}
    </div>
    <input
      {...rest}
      disabled={disabled}
      className={`w-full pl-10 py-3 rounded-xl border border-gray-300 focus:outline-none ${
        disabled ? "bg-gray-100 cursor-not-allowed" : "focus:ring-2 focus:ring-blue-400"
      }`}
    />
  </div>
);

export default UserRegister;