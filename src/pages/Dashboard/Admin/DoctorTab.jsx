import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDoctors } from '../../../redux/APIs/slices/doctorRegisterSlice';
import { FaClock, FaCheckCircle, FaTimesCircle, FaUserMd, FaInfoCircle } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ShortLoading from '../../../components/Loading/ShortLoading';
import { gsap } from 'gsap';

const DoctorCard = ({ doctor, onView }) => (
  <div className="p-3 sm:p-5 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border border-blue-100 h-full">
    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 truncate">{doctor.fullName}</h3>
    <p className="text-xs sm:text-sm text-gray-600 truncate">Email: {doctor.email}</p>
    <p className="text-xs sm:text-sm text-gray-600 truncate">Phone: {doctor.phone}</p>
    <p className="text-xs sm:text-sm text-gray-600 truncate">Type: {doctor.doctorType}</p>
    <p className="text-xs sm:text-sm text-gray-600 mb-3">
      Status: <span className={`font-semibold ml-1 ${
        doctor.doctorApplicationStatus === 'accepted'
          ? 'text-green-600'
          : doctor.doctorApplicationStatus === 'rejected'
          ? 'text-red-500'
          : 'text-yellow-500'
      }`}>
        {doctor.doctorApplicationStatus === 'accepted' && 'Đã chấp nhận'}
        {doctor.doctorApplicationStatus === 'rejected' && 'Đã từ chối'}
        {doctor.doctorApplicationStatus === 'pending' && 'Chờ duyệt'}
      </span>
    </p>
    <button
      onClick={() => onView(doctor)}
      className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
    >
      <FaInfoCircle /> Xem chi tiết
    </button>
  </div>
);

const DoctorsTabPage = () => {
  const dispatch = useDispatch();
  const { allDoctors, isLoading } = useSelector((state) => state.doctorRegisterSlice);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const wrapperRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    dispatch(getAllDoctors());
  }, [dispatch]);

  useEffect(() => {
    if (wrapperRef.current) {
      gsap.fromTo(wrapperRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 });
    }
  }, []);

  useEffect(() => {
    if (showModal && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' }
      );
    }
  }, [showModal]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowModal(false);
        setSelectedDoctor(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const filteredDoctors = allDoctors.filter((doc) => doc.doctorApplicationStatus === activeTab);

  const tabList = [
    { key: 'pending', label: 'Chờ duyệt', icon: <FaClock /> },
    { key: 'accepted', label: 'Đã chấp nhận', icon: <FaCheckCircle /> },
    { key: 'rejected', label: 'Đã từ chối', icon: <FaTimesCircle /> },
  ];

  return (
    <div ref={wrapperRef} className="max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <FaUserMd className="text-2xl sm:text-3xl text-blue-500" />
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Quản lý Bác sĩ</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 sm:gap-3 border-b pb-2 overflow-x-auto scrollbar-hide">
        {tabList.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <ShortLoading />
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <FaUserMd className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Không có bác sĩ nào</h3>
            <p className="text-gray-500">Chưa có bác sĩ nào trong danh sách này.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredDoctors.map((doctor, index) => (
              <div
                key={doctor._id}
                style={{ animationDelay: `${index * 100}ms` }}
                className="animate-fade-in"
              >
                <DoctorCard doctor={doctor} onView={setSelectedDoctor} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Chi tiết Bác sĩ</h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedDoctor(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Họ và tên:</label>
                  <p className="text-sm sm:text-base text-gray-900 mt-1">{selectedDoctor.fullName}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Email:</label>
                  <p className="text-sm sm:text-base text-gray-900 mt-1 break-all">{selectedDoctor.email}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Số điện thoại:</label>
                  <p className="text-sm sm:text-base text-gray-900 mt-1">{selectedDoctor.phone}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Chuyên khoa:</label>
                  <p className="text-sm sm:text-base text-gray-900 mt-1">{selectedDoctor.doctorType}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Trạng thái:</label>
                  <p className={`text-sm sm:text-base font-semibold mt-1 ${
                    selectedDoctor.doctorApplicationStatus === 'accepted'
                      ? 'text-green-600'
                      : selectedDoctor.doctorApplicationStatus === 'rejected'
                      ? 'text-red-500'
                      : 'text-yellow-500'
                  }`}>
                    {selectedDoctor.doctorApplicationStatus === 'accepted' && 'Đã chấp nhận'}
                    {selectedDoctor.doctorApplicationStatus === 'rejected' && 'Đã từ chối'}
                    {selectedDoctor.doctorApplicationStatus === 'pending' && 'Chờ duyệt'}
                  </p>
                </div>
                
                {selectedDoctor.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Mô tả:</label>
                    <p className="text-sm sm:text-base text-gray-900 mt-1">{selectedDoctor.description}</p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedDoctor(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm sm:text-base"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out both;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default DoctorsTabPage;