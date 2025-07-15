import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserMd, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import CustomButton from '../../../components/buttons/CustomButton';
import { CustomToast } from '../../../components/Toast/CustomToast';
import { login, setNull } from '../../../redux/APIs/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const DoctorLogin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
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
    if (isError) {
      CustomToast({ message, type: "error" });
      setTimeout(() => dispatch(setNull()), 3000);
    }
    if (isSuccess) {
      CustomToast({ message, type: "success" });
      setFormData({
        username: "",
        password: "",
      });
      setTimeout(() => {
        dispatch(setNull());
        navigate("/");
      }, 1000);
    }
  }, [isSuccess, isError, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-cyan-300 px-4 relative">
      {/* ✅ Button nằm ngoài phần chính, nên fixed sẽ hoạt động đúng */}
      <CustomButton text="Trở về" to="/login" position="top-left" />

      {/* ✅ Wrapper để căn giữa form */}
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
                  className="w-full pl-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
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
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-green-600 transition cursor-pointer flex items-center justify-center"
              >
                Đăng nhập
              </motion.button>
            </form>
          </div>

          {/* Right: Illustration / animation */}
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
