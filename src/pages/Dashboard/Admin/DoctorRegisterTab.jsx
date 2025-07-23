import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { gsap } from 'gsap';
import { FaUserMd, FaCheck, FaTimes } from 'react-icons/fa';
import { getPendingDoctors, handleDoctorApplication } from '../../../redux/APIs/slices/doctorRegisterSlice';
import { CustomToast } from '../../../components/Toast/CustomToast';
import ShortLoading from '../../../components/Loading/ShortLoading';

const DoctorRegisterTab = () => {
  const dispatch = useDispatch();
  const {
    pendingDoctors,
    isLoading,
    isSuccess,
    isError,
    message,
    handleApplicationStatus,
    handleApplicationMessage
  } = useSelector((state) => state.doctorRegisterSlice);

  const contentRef = useRef(null);
  const modalRef = useRef(null);
  const noDoctorsRef = useRef(null);
  const rejectionModalRef = useRef(null);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  useEffect(() => {
    dispatch(getPendingDoctors());
    gsap.fromTo(contentRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
  }, [dispatch]);

  useEffect(() => {
    if (showModal && modalRef.current) {
      gsap.fromTo(modalRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.4 });
    }
  }, [showModal]);

  useEffect(() => {
    if (showRejectionModal && rejectionModalRef.current) {
      gsap.fromTo(rejectionModalRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4 });
    }
  }, [showRejectionModal]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (showRejectionModal) setShowRejectionModal(false);
        else if (showModal) setShowModal(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showModal, showRejectionModal]);

  useEffect(() => {
    if (isError && message) CustomToast({ message, type: 'error' });
    else if (isSuccess && message && pendingDoctors.length > 0) CustomToast({ message, type: 'success' });
  }, [isError, isSuccess, message]);

  useEffect(() => {
    if (handleApplicationStatus && handleApplicationMessage) {
      CustomToast({
        message: handleApplicationMessage,
        type: handleApplicationStatus === 'success' ? 'success' : 'error',
      });
    }
  }, [handleApplicationStatus, handleApplicationMessage]);

  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
    setRejectionMessage('');
  };

  const handleApprove = (doctorId) => {
    dispatch(handleDoctorApplication({ doctorId, status: 'accepted' }));
    setShowModal(false);
  };

  const handleReject = (doctorId) => {
    if (rejectionMessage.trim()) {
      dispatch(handleDoctorApplication({ doctorId, status: 'rejected', rejectionMessage }));
      setShowModal(false);
      setShowRejectionModal(false);
      setRejectionMessage('');
    } else {
      CustomToast({ message: 'Vui lòng nhập lý do từ chối', type: 'error' });
    }
  };

  return (
    <div ref={contentRef}>
      {/* Header */}
      <div className="flex items-center mb-6">
        <FaUserMd className="text-3xl text-blue-500 mr-3" />
        <h2 className="text-3xl font-bold text-gray-900">Quản lý đăng ký bác sĩ</h2>
      </div>

      {isLoading && <ShortLoading text="Đang lấy danh sách bác sĩ đăng kí" />}

      {isSuccess && pendingDoctors.length === 0 && (
        <div ref={noDoctorsRef} className="text-center mt-6">
          <p className="text-gray-500 text-xl font-medium bg-blue-100 p-4 rounded-lg shadow-md animate-fadeIn">
            Không có đơn đăng ký nào
          </p>
        </div>
      )}

      {isSuccess && pendingDoctors.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {pendingDoctors.map((doctor) => (
            <div key={doctor.id} className="p-5 bg-white rounded-lg shadow-md hover:shadow-xl">
              <h3 className="text-xl font-semibold text-gray-800">{doctor.fullName}</h3>
              <p className="text-gray-600 mt-1">Email: {doctor.email}</p>
              <p className="text-gray-600">Số điện thoại: {doctor.phone}</p>
              <p className="text-gray-600">Loại bác sĩ: {doctor.doctorType}</p>
              <button
                onClick={() => handleViewDetails(doctor)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Xem chi tiết
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal xem chi tiết */}
      {showModal && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm pt-50">
          <div
            ref={modalRef}
            className="bg-white p-8 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto scroll-bar-hidden"
          >
            <h3 className="text-2xl font-bold mb-4">Chi tiết bác sĩ</h3>
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
              <p><strong>Loại:</strong> {selectedDoctor.doctorType}</p>
              <p><strong>Nơi làm:</strong> {selectedDoctor.workplace || 'Chưa cung cấp'}</p>
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
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => handleApprove(selectedDoctor.id)} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                <FaCheck className="inline-block mr-2" /> Chấp nhận
              </button>
              <button onClick={() => setShowRejectionModal(true)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                <FaTimes className="inline-block mr-2" /> Từ chối
              </button>
              <button onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal nhập lý do từ chối */}
      {showRejectionModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center min-h-screen backdrop-blur-sm">
          <div ref={rejectionModalRef} className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
            <h4 className="text-xl font-semibold mb-4">Lý do từ chối</h4>
            <textarea
              value={rejectionMessage}
              onChange={(e) => setRejectionMessage(e.target.value)}
              placeholder="Nhập lý do từ chối"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              rows={4}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowRejectionModal(false)} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                Hủy
              </button>
              <button onClick={() => handleReject(selectedDoctor.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorRegisterTab;