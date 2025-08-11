import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaCalendarCheck, FaUserMd, FaCreditCard } from 'react-icons/fa';
import DefaultLayout from '../../components/layout/defaulLayout';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDoctors } from '../../redux/APIs/slices/doctorRegisterSlice';
import { getPackages } from '../../redux/APIs/slices/paymentSlice';
import { useNavigate } from 'react-router-dom';

const AboutUsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Lấy data từ Redux store với cấu trúc đúng
  const doctorState = useSelector((state) => state.doctorRegisterSlice);
  const paymentState = useSelector((state) => state.paymentSlice);

  useEffect(() => {
    dispatch(getAllDoctors());
    dispatch(getPackages());
  }, [dispatch]);

  // Debug logs
  console.log('Doctor State:', doctorState);
  console.log('Payment State:', paymentState);

  const features = [
    {
      icon: <FaRobot className="text-4xl text-blue-600" />,
      title: "Trợ lý AI Thông minh",
      description: "Hỗ trợ tư vấn sức khỏe 24/7 với chatbot AI thông minh"
    },
    {
      icon: <FaCalendarCheck className="text-4xl text-blue-600" />,
      title: "Đặt Lịch Dễ Dàng",
      description: "Hệ thống đặt lịch thông minh với cập nhật thời gian thực"
    },
    {
      icon: <FaUserMd className="text-4xl text-blue-600" />,
      title: "Đội Ngũ Y Bác Sĩ",
      description: "Đội ngũ bác sĩ chuyên khoa với nhiều năm kinh nghiệm"
    },
    {
      icon: <FaCreditCard className="text-4xl text-blue-600" />,
      title: "Thanh Toán Linh Hoạt",
      description: "Nhiều gói dịch vụ phù hợp cho bác sĩ và bệnh nhân"
    }
  ];

  // Xử lý dữ liệu bác sĩ
  const displayedDoctors = doctorState?.doctors?.slice(0, 3) || [];
  const isDoctorsLoading = doctorState?.loading;

  // Xử lý dữ liệu packages
  const displayedPackages = paymentState?.packages?.length > 0
    ? paymentState.packages.map((pkg) => ({
        ...pkg,
        price: pkg.pricing["1"],
        features: pkg.benefits.features || [],
        color: 
          pkg.type === 'silver' ? 'border-blue-500' :
          pkg.type === 'gold' ? 'border-yellow-500' :
          pkg.type === 'diamond' ? 'border-purple-500' :
          'border-gray-400'
      }))
    : [];
  const isPackagesLoading = paymentState?.isLoading;

  const handleRegisterClick = () => {
    navigate('/register/doctor');
  };

  return (
    <DefaultLayout>
      {/* Hero Section - Improved Mobile */}
      <motion.section 
        className="relative min-h-[60vh] md:h-[80vh] flex items-center justify-center text-center px-4 py-16 md:py-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 mix-blend-multiply" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Chăm Sóc Sức Khỏe Thông Minh
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-gray-700 mb-8 px-4 md:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Kết nối bệnh nhân với bác sĩ chuyên khoa thông qua nền tảng công nghệ hiện đại
          </motion.p>
        </div>
      </motion.section>

      {/* AI Assistant Section - Improved Mobile */}
      <motion.section 
        className="py-12 md:py-20 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-32 md:w-64 h-32 md:h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-32 md:w-64 h-32 md:h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
          <motion.div 
            className="flex-1 w-full md:w-auto"
            initial={{ x: -50 }}
            whileInView={{ x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 text-center md:text-left">
              AI Assistant - Trợ Lý Thông Minh 24/7
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-6 text-center md:text-left px-4 md:px-0">
              Trợ lý AI của chúng tôi luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi. Với khả năng hiểu và phản hồi thông minh,
              AI Assistant sẽ giúp bạn:
            </p>
            <ul className="space-y-4 px-4 md:px-0">
              <motion.li 
                className="flex items-center text-gray-700 bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <FaRobot className="text-blue-600 text-2xl mr-4" /> 
                <span>Tư vấn sức khỏe ban đầu</span>
              </motion.li>
              <motion.li 
                className="flex items-center text-gray-700 bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <FaRobot className="text-purple-600 text-2xl mr-4" /> 
                <span>Hướng dẫn sử dụng website</span>
              </motion.li>
              <motion.li 
                className="flex items-center text-gray-700 bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <FaRobot className="text-indigo-600 text-2xl mr-4" /> 
                <span>Đặt lịch khám thông minh</span>
              </motion.li>
            </ul>
          </motion.div>

          <motion.div 
            className="flex-1 w-full md:w-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="w-full h-[400px] md:h-[500px] bg-white rounded-2xl shadow-2xl p-4 md:p-6 relative overflow-hidden backdrop-blur-lg bg-opacity-80">
              <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center px-6">
                <FaRobot className="text-white text-2xl mr-3" />
                <span className="text-white text-lg font-semibold">AI Assistant</span>
              </div>
              <div className="mt-20 space-y-4">
                <motion.div 
                  className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4 max-w-[80%] ml-auto shadow-md"
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-gray-800">Xin chào, tôi có thể giúp gì cho bạn?</p>
                </motion.div>
                <motion.div 
                  className="bg-gray-100 rounded-lg p-4 max-w-[80%] shadow-md"
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <p className="text-gray-800">Tôi muốn đặt lịch khám với bác sĩ</p>
                </motion.div>
                <motion.div 
                  className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4 max-w-[80%] ml-auto shadow-md"
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <p className="text-gray-800">Tôi sẽ giúp bạn đặt lịch khám. Bạn có thể cho tôi biết chuyên khoa bạn muốn khám không?</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section - Improved Mobile */}
      <section className="py-12 md:py-20 px-4 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-32 md:w-64 h-32 md:h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Tính Năng Nổi Bật
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 md:p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 backdrop-blur-lg bg-opacity-80 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-sm md:text-base text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section - Improved Mobile */}
      <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-32 md:w-64 h-32 md:h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute bottom-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Đội Ngũ Chuyên Gia
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {isDoctorsLoading ? (
              <div className="col-span-full text-center text-gray-500">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                Đang tải thông tin bác sĩ...
              </div>
            ) : displayedDoctors.length > 0 ? (
              displayedDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor._id || index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 backdrop-blur-lg bg-opacity-80 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden">
                    <img
                      src={doctor.avatar || '/images/default-doctor.jpg'}
                      alt={doctor.fullName}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-4 md:p-6 bg-white">
                    <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">{doctor.fullName}</h3>
                    <p className="text-blue-600 font-medium text-sm md:text-base">{doctor.specialty}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                Không có thông tin bác sĩ
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Section - Improved Mobile */}
      <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-32 md:w-64 h-32 md:h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Bảng Giá Dịch Vụ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {isPackagesLoading ? (
              <div className="col-span-full text-center text-gray-500">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                Đang tải thông tin gói dịch vụ...
              </div>
            ) : displayedPackages.length > 0 ? (
              displayedPackages.map((pkg, index) => (
                <motion.div
                  key={pkg.type}
                  className={`bg-white rounded-xl shadow-lg p-6 md:p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 backdrop-blur-lg bg-opacity-80 relative
                    ${pkg.popular ? 'border-2 border-blue-500' : 'border border-gray-100'}
                    ${pkg.recommended ? 'border-2 border-yellow-500' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  {pkg.popular && (
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs md:text-sm font-medium shadow-lg">
                      Phổ biến
                    </div>
                  )}
                  {pkg.recommended && (
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1 rounded-full text-xs md:text-sm font-medium shadow-lg">
                      Đề xuất
                    </div>
                  )}
                  <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-gray-800">{pkg.name}</h3>
                  <p className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6 md:mb-8">
                    {pkg.price.toLocaleString('vi-VN')}đ
                    <span className="text-sm md:text-base font-normal text-gray-600">/tháng</span>
                  </p>
                  <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">{pkg.benefits.description}</p>
                  <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-sm md:text-base text-gray-700">
                        <svg
                          className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={handleRegisterClick}
                    className={`w-full py-3 md:py-4 rounded-lg font-semibold transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-opacity-50 transform hover:-translate-y-1 text-sm md:text-base
                      ${pkg.recommended 
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white focus:ring-yellow-500'
                        : pkg.popular
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white focus:ring-blue-500'
                          : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white focus:ring-gray-500'
                      }`}
                  >
                    Đăng Ký Ngay
                  </button>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                Không có thông tin gói dịch vụ
              </div>
            )}
          </div>
        </div>
      </section>

      <style>
        {`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          
          /* Custom scrollbar for webkit browsers */
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
          
          /* Smooth scrolling for the whole page */
          html {
            scroll-behavior: smooth;
          }
          
          /* Better touch scrolling on iOS */
          * {
            -webkit-overflow-scrolling: touch;
          }
        `}
      </style>
    </DefaultLayout>
  );
};

export default AboutUsPage;
