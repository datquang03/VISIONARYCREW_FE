import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const positionClass = {
  'top-left': 'fixed top-4 left-4',
  'top-right': 'fixed top-4 right-4',
  'bottom-left': 'fixed bottom-4 left-4',
  'bottom-right': 'fixed bottom-4 right-4',
  'center': 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
};

const CustomButton = ({ text, to, position }) => {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate(to)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{
        scale: 1.12,
        boxShadow: '0 0 30px rgba(59, 130, 246, 0.8)',
      }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className={`
        relative overflow-hidden z-50 ${positionClass[position] || ''} 
        px-8 py-4 rounded-2xl text-white font-semibold cursor-pointer
        border border-white/30 shadow-lg backdrop-blur-md
        bg-gradient-to-r from-green-400 via-blue-500 to-purple-500
        bg-[length:200%_200%] bg-left
        transition-all duration-300
        hover:bg-right
      `}
      style={{
        backgroundSize: '200% 200%',
        backgroundPosition: 'left center',
        backgroundImage: 'linear-gradient(to right, #34d399, #3b82f6, #8b5cf6)',
      }}
    >
      <span className="relative z-10">{text}</span>
      {/* Optional blur overlay if needed */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.1 }}
        transition={{ duration: 0.4 }}
        style={{
          backdropFilter: 'blur(2px)',
        }}
      />
    </motion.button>
  );
};

export default CustomButton;
