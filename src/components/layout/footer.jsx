import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';

const footerLinks = [
  { label: 'Về chúng tôi', to: '/about' },
  { label: 'Liên hệ', to: '/contact' },
  { label: 'Điều khoản', to: '/terms' },
  { label: 'Chính sách', to: '/privacy' },
];

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white pt-6 pb-10 mt-auto"
    >
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Copyright */}
        <div className="text-center md:text-left text-sm opacity-80">
          © {new Date().getFullYear()} VisionaryCrew. All rights reserved.
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-4 justify-center md:justify-end">
          {footerLinks.map((link, index) => (
            <motion.div
              key={index}
              whileHover={{
                scale: 1.1,
                color: '#38bdf8',
              }}
              className="text-sm font-medium transition-all duration-200 cursor-pointer"
            >
              <Link to={link.to}>{link.label}</Link>
            </motion.div>
          ))}
        </div>

        {/* Scroll to top */}
        <motion.button
          whileHover={{ scale: 1.2 }}
          onClick={scrollToTop}
          className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-all duration-300"
          title="Scroll to top"
        >
          <FaArrowUp className="text-white" />
        </motion.button>
      </div>
    </motion.footer>
  );
};

export default Footer;
