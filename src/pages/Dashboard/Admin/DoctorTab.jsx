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
  <div className="p-5 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border border-blue-100">
    <h3 className="text-lg font-bold text-gray-800 mb-1">{doctor.fullName}</h3>
    <p className="text-sm text-gray-600">Email: {doctor.email}</p>
    <p className="text-sm text-gray-600">Phone: {doctor.phone}</p>
    <p className="text-sm text-gray-600">Type: {doctor.doctorType}</p>
    <p className="text-sm text-gray-600">
      Status: <span className={`font-semibold ml-1 ${
        doctor.doctorApplicationStatus === 'accepted'
          ? 'text-green-600'
          : doctor.doctorApplicationStatus === 'rejected'
          ? 'text-red-500'
          : 'text-yellow-500'
      }`}>
        {doctor.doctorApplicationStatus}
      </span>
    </p>
    <button
      onClick={() => onView(doctor)}
      className="mt-4 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm flex items-center gap-2"
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
      gsap.fromTo(modalRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.4 });
    }
  }, [showModal]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setShowModal(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showModal]);

  const filteredDoctors = allDoctors.filter((doc) => doc.doctorApplicationStatus === activeTab);

  const tabList = [
    { key: 'pending', label: 'Chờ duyệt', icon: <FaClock /> },
    { key: 'accepted', label: 'Đã chấp nhận', icon: <FaCheckCircle /> },
    { key: 'rejected', label: 'Đã từ chối', icon: <FaTimesCircle /> },
  ];

  return (
    <div
      ref={wrapperRef}
      className="relative bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-xl max-w-6xl mx-auto"
    >
      <style>
        {`
          .scroll-bar-hidden {
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE 10+ */
          }
          .scroll-bar-hidden::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Edge */
          }
        `}
      </style>
      {/* Background Blur & Border */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-200 via-white to-blue-300 opacity-40 backdrop-blur-md border border-blue-100 shadow-inner -z-10" />

      {/* Header */}
      <div className="flex items-center mb-6">
        <FaUserMd className="text-3xl text-blue-500 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Bác sĩ</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b pb-2 overflow-x-auto scrollbar-hide">
        {tabList.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all duration-300 text-sm font-medium whitespace-nowrap
              ${activeTab === tab.key
                ? 'bg-white shadow text-blue-600 border-b-2 border-blue-500'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <ShortLoading text="Đang tải danh sách bác sĩ..." />
      ) : filteredDoctors.length === 0 ? (
        <p className="mt-6 text-gray-500 text-center text-xl font-medium bg-blue-100 p-4 rounded-lg shadow-md animate-fadeIn">
          Không có bác sĩ nào trong mục này.
        </p>
      ) : (
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          navigation
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
          className="mt-6"
        >
          {filteredDoctors.map((doctor) => (
            <SwiperSlide key={doctor._id}>
              <DoctorCard doctor={doctor} onView={(d) => { setSelectedDoctor(d); setShowModal(true); }} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Modal */}
      {showModal && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm pt-50">
          <div
            ref={modalRef}
            className="bg-white p-8 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto scroll-bar-hidden"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Chi tiết bác sĩ</h2>
            <div className="space-y-4 text-gray-700">
              {selectedDoctor.avatar ? (
                <div className="flex justify-center">
                  <img
                    src={selectedDoctor.avatar}
                    alt="Avatar bác sĩ"
                    className="w-24 h-24 rounded-full object-cover"
                    onError={(e) => (e.target.src = '/path/to/fallback-image.jpg')}
                  />
                </div>
              ) : (
                <p className="text-center text-gray-500 italic">Không có ảnh đại diện</p>
              )}
              <p><strong>Họ tên:</strong> {selectedDoctor.fullName}</p>
              <p><strong>Email:</strong> {selectedDoctor.email}</p>
              <p><strong>SĐT:</strong> {selectedDoctor.phone}</p>
              <p><strong>Địa chỉ:</strong> {selectedDoctor.address || 'Chưa cung cấp'}</p>
              <p><strong>Loại bác sĩ:</strong> {selectedDoctor.doctorType}</p>
              <p><strong>Nơi làm việc:</strong> {selectedDoctor.workplace || 'Chưa cung cấp'}</p>
              <p><strong>Ngày sinh:</strong> {new Date(selectedDoctor.dateOfBirth).toLocaleDateString()}</p>
              <p><strong>Ngày đăng ký:</strong> {new Date(selectedDoctor.createdAt).toLocaleDateString()}</p>
              <div>
                <strong>Chứng chỉ:</strong>
                {selectedDoctor.certifications?.length ? (
                  <div>
                    <ul className="list-disc pl-5 mb-4">
                      {selectedDoctor.certifications.map((cert, i) => (
                        <li key={i}>{cert.description || `Chứng chỉ ${i + 1}`}</li>
                      ))}
                    </ul>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {selectedDoctor.certifications.map((cert, i) => (
                        cert.url && (
                          <div key={i} className="flex flex-col items-center">
                            <img
                              src={cert.url}
                              alt={`Chứng chỉ ${i + 1}`}
                              className="w-32 h-32 object-cover rounded-lg"
                              onError={(e) => (e.target.src = '/path/to/fallback-image.jpg')}
                            />
                            <p className="text-sm text-gray-600 mt-2">{cert.description || `Chứng chỉ ${i + 1}`}</p>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="italic">Không có chứng chỉ</p>
                )}
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsTabPage;