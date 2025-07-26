/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserMd, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import CustomButton from '../../../components/buttons/CustomButton';
import { CustomToast } from '../../../components/Toast/CustomToast';
import { doctorLogin, resetForm } from '../../../redux/APIs/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const DoctorLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.authSlice);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoading) {
      dispatch(doctorLogin(formData));
    }
  };

  useEffect(() => {
    if (isError) {
      CustomToast({ message, type: "error" });
      // Không reset form ngay lập tức, để user có thể thử lại
      // setTimeout(() => dispatch(resetForm()), 200);
    }
    if (isSuccess) {
      CustomToast({ message, type: "success" });
      setFormData({
        username: "",
        password: "",
      });
      // Chuyển hướng ngay lập tức sau khi login thành công
      navigate("/doctor", { replace: true });
      // Không reset state để giữ thông tin doctor
    }
  }, [isSuccess, isError, dispatch, navigate]);

  // Không reset state khi component unmount để giữ thông tin đăng nhập
  // useEffect(() => {
  //   return () => {
  //     if (!isSuccess) {
  //       dispatch(resetForm());
  //     }
  //   };
  // }, [dispatch, isSuccess]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-cyan-300 px-4 relative">
      <CustomButton text="Trở về" to="/login" position="top-left" />

      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Left: Form */}
          <div className="md:w-1/2 p-10 bg-white flex flex-col justify-center">
            <motion.h2
              className="text-3xl font-bold text-green-700 text-center mb-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              Đăng nhập Bác sĩ
            </motion.h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div className="relative">
                <FaUserMd className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Tên đăng nhập"
                  disabled={isLoading}
                  className={`w-full pl-10 py-3 rounded-xl border border-gray-300 focus:outline-none ${
                    isLoading ? "bg-gray-100 cursor-not-allowed" : "focus:ring-2 focus:ring-green-400"
                  }`}
                />
              </div>

              {/* Password */}
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mật khẩu"
                  disabled={isLoading}
                  className={`w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 focus:outline-none ${
                    isLoading ? "bg-gray-100 cursor-not-allowed" : "focus:ring-2 focus:ring-green-400"
                  }`}
                />
                <div
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 cursor-pointer"
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
                className={`w-full py-3 rounded-xl font-semibold shadow-md transition flex items-center justify-center ${
                  isLoading
                    ? "bg-green-300 text-gray-100 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600 cursor-pointer"
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
                  "Đăng nhập"
                )}
              </motion.button>
            </form>
          </div>

          {/* Right: Illustration */}
          <motion.div
            className="md:w-1/2 p-6 bg-gradient-to-br from-green-100 to-white flex flex-col justify-center items-center"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <FaUserMd className="text-6xl text-green-500 mb-4" />
            <p className="text-xl text-center text-green-800 font-semibold">
              Chào bác sĩ! Hãy đăng nhập để truy cập hệ thống quản lý.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorLogin;