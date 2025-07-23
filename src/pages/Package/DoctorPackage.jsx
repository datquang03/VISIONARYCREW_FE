/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import DefaultLayout from '../../components/layout/defaulLayout';
import {
  getPackages,
  createPackagePayment,
  resetPaymentState,
} from '../../redux/APIs/slices/paymentSlice';

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
  const dispatch = useDispatch();
  const {
    packages,
    isLoading: packagesLoading,
    isError: packagesError,
    message,
    payment,
    isLoading: paymentLoading,
    isSuccess: paymentSuccess,
    upgradeInfo,
  } = useSelector((state) => state.paymentSlice);

  const [selected, setSelected] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(1);

  useEffect(() => {
    dispatch(getPackages());
  }, [dispatch]);

  // Redirect sau khi payment thành công
  useEffect(() => {
    if (payment && payment.paymentUrl) {
      window.location.replace(payment.paymentUrl);
    }
  }, [payment]);

  const handlePayment = () => {
    if (selected) {
      dispatch(createPackagePayment({ packageType: selected.type, duration: selectedDuration }));
    }
  };

  const displayedPackages = packagesLoading || packagesError || !packages.length
    ? [
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
      ]
    : packages.map((pkg, index) => ({
        ...pkg, // giữ toàn bộ trường gốc, bao gồm pricing
        id: index + 1,
        price: pkg.pricing
          ? Object.entries(pkg.pricing)
              .map(([duration, amount]) => `${amount.toLocaleString('vi-VN')}₫ / ${duration} tháng`)
              .join(' hoặc ')
          : 'Miễn phí',
        features: [
          `Tối đa ${pkg.benefits?.scheduleLimit ?? 'N/A'} lịch mỗi tuần`,
          pkg.benefits?.isPriority ? 'Ưu tiên hiển thị' : 'Không ưu tiên',
          pkg.benefits?.description,
        ].filter(Boolean),
        color: pkg.type === 'silver' ? 'border-blue-500' :
               pkg.type === 'gold' ? 'border-yellow-500' : 'border-gray-400',
        bg: pkg.type === 'silver' ? 'bg-gradient-to-br from-blue-300 to-blue-400' :
             pkg.type === 'gold' ? 'bg-gradient-to-br from-yellow-300 to-yellow-400' :
             'bg-gradient-to-br from-gray-300 to-gray-400',
        colorTransition: pkg.type === 'silver' ? 'from-blue-500/70 to-transparent' :
                         pkg.type === 'gold' ? 'from-yellow-500/70 to-transparent' :
                         'from-gray-400/70 to-transparent',
        smokeColor: pkg.type === 'silver' ? 'from-blue-500/30 to-transparent' :
                     pkg.type === 'gold' ? 'from-yellow-500/30 to-transparent' :
                     'from-gray-400/30 to-transparent',
      }));

  return (
    <DefaultLayout>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-8">Chọn Gói Dịch Vụ</h1>

        {packagesLoading && <p className="text-white">Đang tải gói dịch vụ...</p>}
        {packagesError && <p className="text-red-500">Lỗi: {message}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
          {displayedPackages.map((pkg) => (
            <motion.div
              key={pkg.id}
              whileHover="hover"
              variants={cardVariants}
              onClick={() => {
                console.log('Card clicked, pkg:', pkg); // Debug: log object khi click
                setSelected(pkg);
                setPaymentModalOpen(true);
                if (pkg.pricing) {
                  const firstDuration = Object.keys(pkg.pricing)[0];
                  setSelectedDuration(Number(firstDuration));
                } else {
                  setSelectedDuration(1);
                }
              }}
              className={`relative group rounded-xl p-6 flex flex-col justify-between items-center cursor-pointer h-[420px] w-full border-2 overflow-hidden ${pkg.color} ${pkg.bg} backdrop-blur-sm`}
            >
              <div className="absolute inset-0 z-0 pointer-events-none">
                <div className={`absolute top-[-60%] left-[-60%] w-[220%] h-[220%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${pkg.smokeColor} opacity-0 group-hover:opacity-100 animate-none group-hover:animate-smoke-fade`} />
              </div>
              <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-white/80 to-transparent opacity-0 group-hover:opacity-100 animate-none group-hover:animate-mirror-reflect rotate-45" />
              </div>
              <div className="absolute inset-0 z-0 pointer-events-none">
                <div className={`absolute top-[-60%] left-[-60%] w-[220%] h-[220%] bg-gradient-to-br ${pkg.colorTransition} opacity-0 group-hover:opacity-100 animate-none group-hover:animate-color-transition rotate-45`} />
              </div>

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
              {/* Nút Mua ngay đã bỏ, click card là mở modal luôn */}
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {paymentModalOpen && selected && (
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
                {console.log('selected in modal:', selected)}
                {console.log('paymentLoading:', paymentLoading, 'paymentSuccess:', paymentSuccess)}
                <h2 className="text-2xl font-bold mb-4 text-slate-800">{selected.name}</h2>

                {paymentLoading && (
                  <p className="flex items-center gap-2 text-blue-600">
                    <FaSpinner className="animate-spin" /> Đang xử lý thanh toán...
                  </p>
                )}

                {upgradeInfo && (
                  <div className="p-4 mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded">
                    <p><strong>Gói hiện tại:</strong> {upgradeInfo.fromPackage}</p>
                    <p><strong>Nâng cấp thành:</strong> {upgradeInfo.toPackage}</p>
                    <p><strong>Còn:</strong> {upgradeInfo.remainingDays} ngày</p>
                    <p className="italic">{upgradeInfo.note}</p>
                  </div>
                )}

                {/* Luôn render phần chọn duration và nút thanh toán để debug UI */}
                {/* {!paymentLoading && !paymentSuccess && ( */}
                <>
                  {message && (
                    <p className="text-red-500 mb-4">{message}</p>
                  )}

                  <p className="text-slate-600 mb-4">Xác nhận mua <strong>{selected.name}</strong> trong <strong>{selectedDuration} tháng</strong>?</p>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Chọn thời hạn:</label>
                    <select
                      value={selectedDuration}
                      onChange={(e) => setSelectedDuration(Number(e.target.value))}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      {selected.pricing &&
                        Object.entries(selected.pricing).map(([duration, amount]) => (
                          <option key={duration} value={Number(duration)}>
                            {duration} tháng - {Number(amount).toLocaleString('vi-VN')}₫
                          </option>
                        ))}
                      {!selected.pricing && (
                        <option value={1}>1 tháng</option>
                      )}
                    </select>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => {
                        dispatch(resetPaymentState());
                        setPaymentModalOpen(false);
                        setSelected(null);
                      }}
                      className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handlePayment}
                      className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
                      disabled={paymentLoading}
                    >
                      Thanh toán
                    </button>
                  </div>
                </>
                {/* )} */}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes mirror-reflect {
          0% { transform: translate(-100%, -100%) rotate(45deg); opacity: 0; }
          50% { opacity: 0.85; }
          100% { transform: translate(100%, 100%) rotate(45deg); opacity: 0; }
        }
        @keyframes color-transition {
          0% { transform: translate(-100%, -100%) rotate(45deg); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translate(100%, 100%) rotate(45deg); opacity: 0; }
        }
        @keyframes smoke-fade {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          50% { transform: translateY(-15%) scale(1.1); opacity: 0.5; }
          100% { transform: translateY(-30%) scale(1.2); opacity: 0; }
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
