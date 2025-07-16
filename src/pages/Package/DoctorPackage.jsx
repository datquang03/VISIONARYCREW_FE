import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import DefaultLayout from '../../components/layout/defaulLayout';

const packages = [
  {
    id: 1,
    name: 'Gói mặc định',
    price: 'Miễn phí',
    features: ['Đăng lịch cơ bản', 'Tối đa 5 lịch mỗi tuần'],
    color: 'border-gray-400',
    bg: 'bg-gradient-to-br from-gray-300 to-gray-400',
    colorTransition: 'from-gray-400/70 to-transparent',
    smokeColor: 'from-gray-400/30 to-transparent',
  },
  {
    id: 2,
    name: 'Gói Bạc',
    price: '299.000₫ / tháng',
    features: ['Lịch nâng cao', 'Tối đa 20 lịch mỗi tuần', 'Hỗ trợ nhanh'],
    color: 'border-blue-500',
    bg: 'bg-gradient-to-br from-blue-300 to-blue-400',
    colorTransition: 'from-blue-500/70 to-transparent',
    smokeColor: 'from-blue-500/30 to-transparent',
  },
  {
    id: 3,
    name: 'Gói Vàng',
    price: '599.000₫ / tháng',
    features: ['Không giới hạn lịch', 'Ưu tiên tìm kiếm', 'Hỗ trợ 24/7'],
    color: 'border-yellow-500',
    bg: 'bg-gradient-to-br from-yellow-300 to-yellow-400',
    colorTransition: 'from-yellow-500/70 to-transparent',
    smokeColor: 'from-yellow-500/30 to-transparent',
  },
];

const cardVariants = {
  hover: {
    scale: 1.07,
    rotateX: 5,
    rotateY: -5,
    boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
};

const DoctorPackages = () => {
  const [selected, setSelected] = useState(null);

  return (
    <DefaultLayout>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-white mb-8">Chọn Gói Dịch Vụ</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
          {packages.map((pkg) => (
            <motion.div
              key={pkg.id}
              whileHover="hover"
              variants={cardVariants}
              onClick={() => setSelected(pkg)}
              className={`relative group rounded-xl p-6 flex flex-col justify-between items-center cursor-pointer h-[420px] w-full border-2 overflow-hidden ${pkg.color} ${pkg.bg} backdrop-blur-sm`}
            >
              {/* Hiệu ứng khói màu */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <div className={`absolute top-[-60%] left-[-60%] w-[220%] h-[220%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${pkg.smokeColor} opacity-0 group-hover:opacity-100 animate-none group-hover:animate-smoke-fade`} />
              </div>

              {/* Hiệu ứng phản chiếu ánh sáng */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-white/80 to-transparent opacity-0 group-hover:opacity-100 animate-none group-hover:animate-mirror-reflect rotate-45" />
              </div>

              {/* Gradient màu động */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <div className={`absolute top-[-60%] left-[-60%] w-[220%] h-[220%] bg-gradient-to-br ${pkg.colorTransition} opacity-0 group-hover:opacity-100 animate-none group-hover:animate-color-transition rotate-45`} />
              </div>

              {/* Nội dung */}
              <h2 className="text-2xl font-bold text-slate-800 mb-2 z-10">{pkg.name}</h2>
              <p className="text-xl font-semibold text-slate-700 mb-4 z-10">{pkg.price}</p>
              <ul className="text-slate-700 text-sm flex-1 space-y-3 mb-4 z-10">
                {pkg.features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="mt-auto bg-slate-800 text-white px-5 py-2 rounded-lg hover:bg-slate-900 z-10"
              >
                Mua ngay
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selected && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <h2 className="text-2xl font-bold mb-4 text-slate-800">{selected.name}</h2>
                <p className="text-slate-600 mb-4">{selected.price}</p>
                <ul className="text-slate-600 space-y-2 mb-6">
                  {selected.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setSelected(null)}
                    className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => {
                      alert(`Thanh toán cho ${selected.name}`);
                      setSelected(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
                  >
                    Xác nhận thanh toán
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom CSS animation */}
      <style jsx>{`
        @keyframes mirror-reflect {
          0% {
            transform: translate(-100%, -100%) rotate(45deg);
            opacity: 0;
          }
          50% {
            opacity: 0.85;
          }
          100% {
            transform: translate(100%, 100%) rotate(45deg);
            opacity: 0;
          }
        }

        @keyframes color-transition {
          0% {
            transform: translate(-100%, -100%) rotate(45deg);
            opacity: 0;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: translate(100%, 100%) rotate(45deg);
            opacity: 0;
          }
        }

        @keyframes smoke-fade {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          50% {
            transform: translateY(-15%) scale(1.1);
            opacity: 0.5;
          }
          100% {
            transform: translateY(-30%) scale(1.2);
            opacity: 0;
          }
        }

        .group-hover\\:animate-mirror-reflect:hover {
          animation: mirror-reflect 1.5s ease-out;
        }

        .group-hover\\:animate-color-transition:hover {
          animation: color-transition 1.8s ease-in-out;
        }

        .group-hover\\:animate-smoke-fade:hover {
          animation: smoke-fade 2.5s ease-in-out;
        }
      `}</style>
    </DefaultLayout>
  );
};

export default DoctorPackages;