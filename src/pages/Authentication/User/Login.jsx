import React, { useEffect, useState } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import CustomButton from '../../../components/buttons/CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import { login, resetForm } from '../../../redux/APIs/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { CustomToast } from '../../../components/Toast/CustomToast';
import { motion } from "framer-motion";

const UserLogin = () => {
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
      dispatch(login(formData));
    }
  };

  useEffect(() => {
    console.log('Login component state:', { isError, isSuccess, isLoading, message });
    if (isError) {
      CustomToast({ message, type: "error" });
      // Không reset form ngay lập tức, để user có thể thử lại
      // setTimeout(() => dispatch(resetForm()), 2000);
    }
    if (isSuccess) {
      console.log('Login success detected, starting navigation...');
      CustomToast({ message, type: "success" });
      setFormData({
        username: "",
        password: "",
      });
      // Delay navigation để đảm bảo Redux state được cập nhật
      setTimeout(() => {
        console.log('Navigating to homepage...');
        navigate("/", { replace: true });
      }, 100);
      // Không reset state để giữ thông tin user
    }
  }, [isSuccess, isError, dispatch, navigate, message]);

  // Không reset state khi component unmount để giữ thông tin đăng nhập
  // useEffect(() => {
  //   return () => {
  //     if (!isSuccess) {
  //       dispatch(resetForm());
  //     }
  //   };
  // }, [dispatch, isSuccess]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-cyan-300 px-4 relative">
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
              className="text-3xl font-bold text-blue-700 text-center mb-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              Đăng nhập Người dùng
            </motion.h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Tên đăng nhập"
                  disabled={isLoading}
                  className={`w-full pl-10 py-3 rounded-xl border border-gray-300 focus:outline-none ${
                    isLoading ? "bg-gray-100 cursor-not-allowed" : "focus:ring-2 focus:ring-blue-400"
                  }`}
                />
              </div>

              {/* Password */}
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mật khẩu"
                  disabled={isLoading}
                  className={`w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 focus:outline-none ${
                    isLoading ? "bg-gray-100 cursor-not-allowed" : "focus:ring-2 focus:ring-blue-400"
                  }`}
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
                className={`w-full py-3 rounded-xl font-semibold shadow-md transition flex items-center justify-center ${
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
                  "Đăng nhập"
                )}
              </motion.button>

              {/* Registration section */}
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">hoặc</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-gray-600 text-sm">
                    Bạn chưa có tài khoản? 
                  </p>
                  <motion.button
                    type="button"
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/register/user")}
                    className="w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-500 text-white hover:from-blue-500 hover:to-indigo-600 cursor-pointer border-2 border-transparent hover:border-blue-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <svg 
                      className="w-4 h-4 mr-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                      />
                    </svg>
                    Xin hãy bấm vào đây để đăng ký
                  </motion.button>
                </div>
              </div>
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
              Chào bạn! Hãy đăng nhập để truy cập hệ thống.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserLogin;