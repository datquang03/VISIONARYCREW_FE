import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaUserMd } from 'react-icons/fa';
import ScreenLoading from '../../components/Loading/ScreenLoading';
import CustomButton from '../../components/buttons/CustomButton';

const DefaultLogin = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <ScreenLoading text="Đang tải trang đăng nhập..." />;

  const handleNavigate = (type, role) => {
    navigate(`/${type}/${role}`);
  };

  return (
    <div className="relative min-h-screen bg-slate-900 text-white px-4 overflow-hidden">
      {/* ✅ Nút Trở về nằm ngoài layout center */}
      <CustomButton text="Trở về" to="/" position="top-left" />

      <div className="flex items-center justify-center min-h-screen">
        {/* 🌌 Background Gradient Blobs */}
        <motion.div
          className="absolute top-[-100px] left-[-150px] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-pink-500 to-yellow-500 blur-[150px] opacity-20"
          animate={{ x: [0, 30, -30, 0], y: [0, 30, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-500 to-purple-600 blur-[200px] opacity-30"
          animate={{ x: [0, 50, -50, 0], y: [0, -50, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-green-400 to-cyan-500 blur-[180px] opacity-20"
          animate={{ x: [0, -40, 40, 0], y: [0, 40, -40, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
        />

        {/* 🔷 Modal chọn vai trò */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 bg-white text-slate-800 rounded-3xl shadow-2xl max-w-6xl w-full p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 backdrop-blur-md"
        >
          {/* USER */}
          <motion.div
            className={`flex-1 flex flex-col items-center justify-center rounded-2xl cursor-pointer p-6 text-center shadow-inner transition-all duration-300 ${
              hovered === 'doctor' ? 'bg-gray-100 opacity-50' : 'bg-blue-100'
            }`}
            onMouseEnter={() => setHovered('user')}
            onMouseLeave={() => setHovered(null)}
            whileHover={{ scale: 1.03 }}
          >
            <motion.div
              animate={hovered === 'user' ? { y: [-6, 6, -6] } : { y: 0 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <FaUser className="text-7xl text-blue-600 mb-4 drop-shadow" />
            </motion.div>
            <h3 className="text-2xl font-bold text-blue-700">Đăng nhập người dùng</h3>
            <p className="mt-2 text-sm opacity-70">Bạn là người dùng? Vào đây nè.</p>

            <div className="flex gap-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(59,130,246,0.6)' }}
                onClick={() => handleNavigate('login', 'user')}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold cursor-pointer"
              >
                Đăng nhập
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(96,165,250,0.5)' }}
                onClick={() => handleNavigate('register', 'user')}
                className="px-4 py-2 rounded-xl bg-blue-300 text-blue-900 font-semibold cursor-pointer"
              >
                Đăng ký
              </motion.button>
            </div>
          </motion.div>

          {/* DOCTOR */}
          <motion.div
            className={`flex-1 flex flex-col items-center justify-center rounded-2xl cursor-pointer p-6 text-center shadow-inner transition-all duration-300 ${
              hovered === 'user' ? 'bg-gray-100 opacity-50' : 'bg-green-100'
            }`}
            onMouseEnter={() => setHovered('doctor')}
            onMouseLeave={() => setHovered(null)}
            whileHover={{ scale: 1.03 }}
          >
            <motion.div
              animate={hovered === 'doctor' ? { y: [-6, 6, -6] } : { y: 0 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <FaUserMd className="text-7xl text-green-600 mb-4 drop-shadow" />
            </motion.div>
            <h3 className="text-2xl font-bold text-green-700">Đăng nhập bác sĩ</h3>
            <p className="mt-2 text-sm opacity-70">Bạn là bác sĩ? Chọn phía này nhé.</p>

            <div className="flex gap-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(34,197,94,0.5)' }}
                onClick={() => handleNavigate('login', 'doctor')}
                className="px-4 py-2 rounded-xl bg-green-600 text-white font-semibold cursor-pointer"
              >
                Đăng nhập
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(134,239,172,0.5)' }}
                onClick={() => handleNavigate('register', 'doctor')}
                className="px-4 py-2 rounded-xl bg-green-300 text-green-900 font-semibold cursor-pointer"
              >
                Đăng ký
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DefaultLogin;
