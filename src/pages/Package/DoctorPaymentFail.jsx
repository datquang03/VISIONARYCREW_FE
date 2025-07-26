import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const DoctorPaymentFail = () => {
  const bgRef = useRef(null);
  const navigate = useNavigate();
  const query = useQuery();

  // Lấy thông tin từ query params
  const orderCode = query.get("orderCode");
  const message = query.get("message") || "Thanh toán đã bị hủy hoặc gặp sự cố.";
  const packageType = query.get("packageType");
  const amount = query.get("amount");

  // GSAP background animation
  useEffect(() => {
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        backgroundPosition: '200% 100%',
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }
  }, []);

  return (
    <div
      ref={bgRef}
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(120deg, #a8edea 0%, #fed6e3 100%, #fcb69f 200%)',
        backgroundSize: '200% 200%',
        transition: 'background-position 1s',
      }}
    >
      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/30 shadow-lg"
            style={{
              width: `${Math.random() * 16 + 8}px`,
              height: `${Math.random() * 16 + 8}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              filter: 'blur(1.5px)',
            }}
            animate={{
              y: [0, Math.random() * 40 - 20, 0],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      {/* Card */}
      <motion.div
        className="relative z-10 bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border-4 border-white/60 flex flex-col items-center w-full max-w-lg"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 12 }}
        whileHover={{ scale: 1.03, boxShadow: '0 8px 40px 0 #fcb69f55' }}
      >
        <h1
          className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-red-400 via-pink-500 to-orange-400 bg-clip-text text-transparent drop-shadow-lg font-sans"
        >
          ❌ Thanh toán thất bại
        </h1>
        <div className="text-lg text-gray-600 mb-4">
          {message}
        </div>
        <ul className="mb-4 text-gray-700 text-left">
          {orderCode && <li><b>Mã đơn hàng:</b> {orderCode}</li>}
          {packageType && <li><b>Gói:</b> {packageType}</li>}
          {amount && <li><b>Số tiền:</b> {amount} VND</li>}
        </ul>
        <motion.div
          className="mt-6 inline-block px-8 py-3 rounded-full font-bold text-lg bg-gradient-to-r from-red-400 via-pink-400 to-orange-400 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-white/70 cursor-pointer"
          whileHover={{ scale: 1.08, boxShadow: '0 0 32px 0 #fcb69f99' }}
          onClick={() => navigate('/doctor/payment/history')}
        >
          Quay lại lịch sử thanh toán
        </motion.div>
      </motion.div>
      {/* Extra glow effect */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-200 rounded-full opacity-30 blur-3xl z-0 animate-pulse" />
      <div className="absolute -bottom-32 right-1/2 translate-x-1/2 w-[500px] h-[500px] bg-orange-200 rounded-full opacity-20 blur-3xl z-0 animate-pulse" />
    </div>
  );
};

export default DoctorPaymentFail; 