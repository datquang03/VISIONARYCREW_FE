import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex justify-between items-center px-6 py-4 bg-slate-900 bg-opacity-80 backdrop-blur-md shadow-lg"
    >
      {/* Logo bên trái */}
      <Link to="/" className="text-2xl font-bold text-white tracking-wider">
        <motion.span
          whileHover={{ scale: 1.1, color: '#38bdf8' }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          Visionary Crew
        </motion.span>
      </Link>

      {/* Nút đăng nhập bên phải */}
      <Link to="/login">
        <motion.button
          whileHover={{
            scale: 1.05,
            backgroundColor: '#38bdf8',
            color: '#0f172a',
            boxShadow: '0px 0px 15px rgba(56,189,248,0.6)',
          }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-xl bg-slate-700 text-white font-semibold transition-all duration-300 cursor-pointer shadow-lg hover:bg-slate-600 hover:text-white"
        >
          Đăng nhập
        </motion.button>
      </Link>
    </motion.nav>
  );
};

export default Navbar;
