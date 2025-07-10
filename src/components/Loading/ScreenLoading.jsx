import React from 'react';
import { motion } from 'framer-motion';
import {
  FaStethoscope,
  FaUserMd,
  FaHeartbeat,
  FaHospitalAlt,
} from 'react-icons/fa';

// Danh sách icon
const icons = [FaStethoscope, FaUserMd, FaHeartbeat, FaHospitalAlt];

// Tạo icon bay ngẫu nhiên
const generateFloatingIcons = () =>
  Array.from({ length: 12 }).map((_, i) => {
    const Icon = icons[i % icons.length];
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const size = 24 + Math.random() * 20;
    const duration = 4 + Math.random() * 4;

    return { Icon, x, y, size, duration, key: `${i}-${Date.now()}` };
  });

const floatingIcons = generateFloatingIcons();

const ScreenLoading = ({ text }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center text-white overflow-hidden">
      {/* Spinner */}
      <motion.div
        className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full mb-6 z-20"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      />

      {/* Icon bay khắp màn hình */}
      {floatingIcons.map(({ Icon, x, y, size, duration, key }) => (
        <motion.div
          key={key}
          className="absolute text-blue-400"
          style={{ left: x, top: y, fontSize: size }}
          animate={{
            x: [0, 10, -10, 0],
            y: [0, -10, 10, 0],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatType: 'mirror',
          }}
        >
          <Icon />
        </motion.div>
      ))}

      {/* Text có animation */}
      <motion.p
        className="text-lg mt-6 text-center font-semibold z-20"
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: [0, 1],
          y: [10, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'mirror' }}
      >
        {text}
      </motion.p>
    </div>
  );
};

export default ScreenLoading;
