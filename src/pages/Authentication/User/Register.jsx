import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaBirthdayCake, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import CustomButton from '../../../components/buttons/CustomButton';

const UserRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    password: '',
  });

  const togglePassword = () => setShowPassword(prev => !prev);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Dispatch API call here
  };

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
              />

              {/* Email */}
              <InputField
                icon={<FaEnvelope />}
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />

              {/* Phone */}
              <InputField
                icon={<FaPhone />}
                name="phone"
                type="tel"
                placeholder="Số điện thoại"
                value={formData.phone}
                onChange={handleChange}
              />

              {/* Date of Birth */}
              <InputField
                icon={<FaBirthdayCake />}
                name="dateOfBirth"
                type="date"
                placeholder="Ngày sinh"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />

              {/* Password */}
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-blue-600 transition cursor-pointer flex items-center justify-center mt-4"
              >
                Đăng ký
              </motion.button>
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

const InputField = ({ icon, ...rest }) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">
      {icon}
    </div>
    <input
      {...rest}
      className="w-full pl-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
);

export default UserRegister;
