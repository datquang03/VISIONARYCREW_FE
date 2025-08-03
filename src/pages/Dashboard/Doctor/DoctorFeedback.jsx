import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getDoctorFeedback, getDoctorFeedbackStats } from '../../../redux/APIs/slices/feedbackSlice';
import { FaStar, FaUser, FaCalendar, FaClock, FaEye } from 'react-icons/fa';
import { CustomToast } from '../../../components/Toast/CustomToast';

const DoctorFeedback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { doctorFeedback, doctorFeedbackStats, loading, error } = useSelector(state => state.feedbackSlice);

  useEffect(() => {
    dispatch(getDoctorFeedback({ page: currentPage, limit: itemsPerPage }));
    dispatch(getDoctorFeedbackStats());
  }, [dispatch, currentPage, itemsPerPage]);

  useEffect(() => {
    if (error) {
      CustomToast.error(error);
    }
  }, [error]);

  const handleViewDetail = (feedback) => {
    setSelectedFeedback(feedback);
    setShowDetailModal(true);
  };

  const handleViewProfile = (userId, userType = 'patient') => {
    if (userType === 'patient') {
      navigate(`/profile/user/${userId}`);
    } else {
      navigate(`/profile/doctor/${userId}`);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`text-lg ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getRatingText = (rating) => {
    switch (rating) {
      case 1: return 'Rất không hài lòng';
      case 2: return 'Không hài lòng';
      case 3: return 'Bình thường';
      case 4: return 'Hài lòng';
      case 5: return 'Rất hài lòng';
      default: return '';
    }
  };

  const getRatingColor = (rating) => {
    switch (rating) {
      case 1: return 'text-red-600';
      case 2: return 'text-orange-600';
      case 3: return 'text-yellow-600';
      case 4: return 'text-blue-600';
      case 5: return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const totalPages = Math.ceil((doctorFeedback?.total || 0) / itemsPerPage);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Đánh giá từ bệnh nhân</h1>
      </div>

      {/* Stats Cards */}
      {doctorFeedbackStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <FaStar className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng đánh giá</p>
                <p className="text-2xl font-bold text-gray-900">{doctorFeedbackStats.totalFeedback || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <FaStar className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Điểm trung bình</p>
                <p className="text-2xl font-bold text-gray-900">
                  {doctorFeedbackStats.averageRating ? doctorFeedbackStats.averageRating.toFixed(1) : '0.0'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <FaStar className="text-yellow-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">5 sao</p>
                <p className="text-2xl font-bold text-gray-900">{doctorFeedbackStats.fiveStarCount || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <FaStar className="text-red-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">1-2 sao</p>
                <p className="text-2xl font-bold text-gray-900">{doctorFeedbackStats.lowRatingCount || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Danh sách đánh giá</h2>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Đang tải...</p>
          </div>
        ) : doctorFeedback?.feedback?.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {doctorFeedback.feedback.map((feedback) => (
              <div key={feedback._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex items-center space-x-1">
                        {renderStars(feedback.rating)}
                      </div>
                      <span className={`text-sm font-medium ${getRatingColor(feedback.rating)}`}>
                        {getRatingText(feedback.rating)}
                      </span>
                      {feedback.isAnonymous && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Ẩn danh
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaUser className="mr-2" />
                        <span>
                          {feedback.isAnonymous ? 'Bệnh nhân ẩn danh' : (
                            <button
                              onClick={() => handleViewProfile(feedback.patient._id, 'patient')}
                              className="text-blue-600 hover:text-blue-800 underline font-medium"
                            >
                              {feedback.patient?.username || 'Bệnh nhân'}
                            </button>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <FaCalendar className="mr-2" />
                        <span>{formatDate(feedback.schedule?.date)}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <FaClock className="mr-2" />
                        <span>
                          {feedback.schedule?.timeSlot?.startTime} - {feedback.schedule?.timeSlot?.endTime}
                        </span>
                      </div>

                      {feedback.comment && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{feedback.comment}</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      Đánh giá lúc: {new Date(feedback.createdAt).toLocaleString('vi-VN')}
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewDetail(feedback)}
                    className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaEye className="text-lg" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <FaStar className="text-4xl text-gray-300 mx-auto mb-4" />
            <p>Chưa có đánh giá nào</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Trang {currentPage} của {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Trước
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Chi tiết đánh giá</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaEye className="text-lg" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                {renderStars(selectedFeedback.rating)}
                <span className={`font-medium ${getRatingColor(selectedFeedback.rating)}`}>
                  {getRatingText(selectedFeedback.rating)}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <FaUser className="mr-2 text-gray-500" />
                  <span>
                    {selectedFeedback.isAnonymous ? 'Bệnh nhân ẩn danh' : (
                      <button
                        onClick={() => handleViewProfile(selectedFeedback.patient._id, 'patient')}
                        className="text-blue-600 hover:text-blue-800 underline font-medium"
                      >
                        {selectedFeedback.patient?.username || 'Bệnh nhân'}
                      </button>
                    )}
                  </span>
                </div>

                <div className="flex items-center">
                  <FaCalendar className="mr-2 text-gray-500" />
                  <span>{formatDate(selectedFeedback.schedule?.date)}</span>
                </div>

                <div className="flex items-center">
                  <FaClock className="mr-2 text-gray-500" />
                  <span>
                    {selectedFeedback.schedule?.timeSlot?.startTime} - {selectedFeedback.schedule?.timeSlot?.endTime}
                  </span>
                </div>

                {selectedFeedback.comment && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{selectedFeedback.comment}</p>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500">
                Đánh giá lúc: {new Date(selectedFeedback.createdAt).toLocaleString('vi-VN')}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
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

export default DoctorFeedback; 