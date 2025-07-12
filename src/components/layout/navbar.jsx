import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav
      className="fixed top-0 left-0 w-full z-[1000] bg-slate-900 bg-opacity-90 backdrop-blur-md shadow-md px-6 py-4 flex justify-between items-center"
    >
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-white tracking-wider">
        <motion.span
          whileHover={{ scale: 1.1, color: '#38bdf8' }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          Visionary Crew
        </motion.span>
      </Link>

      {/* Nút đăng nhập */}
      <Link to="/login">
        <motion.button
          whileHover={{
            scale: 1.05,
            backgroundColor: '#38bdf8',
            color: '#0f172a',
            boxShadow: '0px 0px 15px rgba(56,189,248,0.6)',
          }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-xl bg-slate-700 text-white font-semibold shadow-md transition-all duration-300"
        >
          Đăng nhập
        </motion.button>
      </Link>
    </motion.nav>
  );
};

export default Navbar;
