import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkPackagePaymentStatus } from '../../redux/APIs/slices/paymentSlice';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const DoctorPaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderCode = searchParams.get('orderCode');
  const status = searchParams.get('status');
  const code = searchParams.get('code');
  const dispatch = useDispatch();
  const { payment, isLoading, message } = useSelector(state => state.paymentSlice);
  const bgRef = useRef(null);

  useEffect(() => {
    if (orderCode) {
      dispatch(checkPackagePaymentStatus(orderCode));
    }
  }, [orderCode, dispatch]);

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
        <motion.h1
          className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-green-400 via-pink-500 to-orange-400 bg-clip-text text-transparent drop-shadow-lg"
          animate={{ scale: [1, 1.08, 1], textShadow: [
            '0 0 0px #fff',
            '0 0 16px #fcb69f, 0 0 8px #a8edea',
            '0 0 0px #fff',
          ] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        >
          {status === 'PAID' && code === '00' ? '🎉 Thanh toán thành công!' : '❌ Thanh toán thất bại'}
        </motion.h1>
        {isLoading && <motion.p className="text-lg text-gray-600 mb-4" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>Đang kiểm tra trạng thái thanh toán...</motion.p>}
        {payment && (
          <motion.div
            className="mb-4 text-gray-700 text-lg w-full text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold">Gói:</span> <span className="uppercase tracking-wider text-pink-500 font-semibold">{payment.packageType}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold">Thời hạn:</span> <span className="text-orange-500 font-semibold">{payment.packageDuration} tháng</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold">Số tiền:</span> <span className="text-green-600 font-semibold">{Number(payment.amount).toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold">Mô tả:</span> <span>{payment.description}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold">Trạng thái:</span> <span className="uppercase tracking-wider text-green-600 font-bold">{payment.status}</span>
            </div>
          </motion.div>
        )}
        {message && <motion.p className="text-red-500 mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{message}</motion.p>}
        <motion.a
          href="/doctor/dashboard"
          className="mt-6 inline-block px-8 py-3 rounded-full font-bold text-lg bg-gradient-to-r from-green-400 via-pink-400 to-orange-400 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-white/70"
          whileHover={{ scale: 1.08, boxShadow: '0 0 32px 0 #fcb69f99' }}
        >
          Về trang Dashboard
        </motion.a>
      </motion.div>
      {/* Extra glow effect */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-200 rounded-full opacity-30 blur-3xl z-0 animate-pulse" />
      <div className="absolute -bottom-32 right-1/2 translate-x-1/2 w-[500px] h-[500px] bg-orange-200 rounded-full opacity-20 blur-3xl z-0 animate-pulse" />
    </div>
  );
};

export default DoctorPaymentSuccess;