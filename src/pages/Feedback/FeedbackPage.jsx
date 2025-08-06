import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaStar, FaCalendarAlt, FaClock, FaUserMd, FaCheckCircle, FaEye, FaComment, FaStethoscope, FaTimes } from 'react-icons/fa';
import { createFeedback, selectCreateFeedbackLoading, getFeedbackBySchedule } from '../../redux/APIs/slices/feedbackSlice';
import { getMyRegisteredSchedules } from '../../redux/APIs/slices/scheduleSlice';
import FeedbackForm from '../../components/FeedbackForm/FeedbackForm';
import { CustomToast } from '../../components/Toast/CustomToast';
import { getSchedulesNeedingFeedback, getSchedulesWithFeedback, markFeedbackAsSubmitted, getSkippedScheduleIds, clearExpiredSkippedFeedbacks } from '../../utils/feedbackUtils';
import DefaultLayout from '../../components/layout/defaulLayout';

const FeedbackPage = () => {
  const dispatch = useDispatch();
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDetailSchedule, setSelectedDetailSchedule] = useState(null);
  const [detailFeedback, setDetailFeedback] = useState(null);
  const createLoading = useSelector(selectCreateFeedbackLoading);
  const { myRegisteredSchedules } = useSelector(state => state.scheduleSlice);
  const { user } = useSelector(state => state.authSlice);

  useEffect(() => {
    if (user && user.role === 'user') {
      dispatch(getMyRegisteredSchedules());
    }
  }, [user, dispatch]);

  // Get completed schedules that need feedback
  const getPendingFeedbacks = () => {
    return getSchedulesNeedingFeedback(myRegisteredSchedules);
  };

  const getCompletedFeedbacks = () => {
    return getSchedulesWithFeedback(myRegisteredSchedules);
  };

  const getSkippedFeedbacks = () => {
    const skippedIds = getSkippedScheduleIds();
    const feedbackSubmitted = JSON.parse(localStorage.getItem('feedbackSubmitted') || '[]');
    
    return myRegisteredSchedules.filter(schedule => 
      schedule.status === 'completed' && 
      skippedIds.includes(schedule._id) &&
      !feedbackSubmitted.includes(schedule._id)
    );
  };

  const handleUnSkip = (scheduleId) => {
    const skippedFeedbacks = JSON.parse(localStorage.getItem('skippedFeedbacks') || '[]');
    const filteredSkipped = skippedFeedbacks.filter(item => item.scheduleId !== scheduleId);
    localStorage.setItem('skippedFeedbacks', JSON.stringify(filteredSkipped));
    
    // Refresh data
    dispatch(getMyRegisteredSchedules());
    CustomToast.success('Đã thêm lại vào danh sách cần đánh giá');
  };

  const handleFeedbackSubmit = async (feedbackData) => {
    try {
      await dispatch(createFeedback({
        ...feedbackData,
        scheduleId: selectedSchedule._id
      })).unwrap();
      
      // Mark feedback as submitted
      markFeedbackAsSubmitted(selectedSchedule._id);
      
      setShowFeedbackForm(false);
      setSelectedSchedule(null);
      CustomToast.success('Cảm ơn bạn đã đánh giá!');
      
      // Refresh schedules
      dispatch(getMyRegisteredSchedules());
    } catch (error) {
      console.error('Error submitting feedback:', error);
      
      // Check if error is due to already existing feedback
      if (error.includes('đã đánh giá')) {
        // Mark as submitted in localStorage to prevent future attempts
        markFeedbackAsSubmitted(selectedSchedule._id);
        
        setShowFeedbackForm(false);
        setSelectedSchedule(null);
        CustomToast.info('Lịch hẹn này đã được đánh giá trước đó.');
        
        // Refresh to update UI
        dispatch(getMyRegisteredSchedules());
      } else {
        CustomToast.error('Có lỗi xảy ra khi gửi đánh giá');
      }
    }
  };

  const handleViewDetail = async (schedule) => {
    setSelectedDetailSchedule(schedule);
    setShowDetailModal(true);
    
    // Fetch feedback detail
    try {
      const response = await dispatch(getFeedbackBySchedule(schedule._id)).unwrap();
      setDetailFeedback(response.feedback);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setDetailFeedback(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`text-lg ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  const pendingFeedbacks = getPendingFeedbacks();
  const completedFeedbacks = getCompletedFeedbacks();
  const skippedFeedbacks = getSkippedFeedbacks();

  if (!user || user.role !== 'user') {
    return (
      <DefaultLayout>
        <div className="min-h-screen flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-white p-8 rounded-2xl shadow-xl"
          >
            <FaStethoscope className="text-blue-500 text-6xl mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Trang này chỉ dành cho bệnh nhân.</p>
          </motion.div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl shadow-2xl p-8 mb-8 text-white">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 mb-4"
              >
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <FaStar className="text-white text-3xl" />
                </div>
                <h1 className="text-3xl font-bold">Đánh giá dịch vụ khám chữa bệnh</h1>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/90 text-lg leading-relaxed"
              >
                Chia sẻ trải nghiệm của bạn để giúp chúng tôi cải thiện chất lượng dịch vụ
              </motion.p>
            </div>

            {/* Main Content - Top Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Pending Feedbacks */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 text-white">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <FaStar className="text-2xl" />
                    Cần đánh giá ({pendingFeedbacks.length})
                  </h2>
                  <p className="text-red-100 mt-2">Các buổi khám cần được đánh giá</p>
                </div>
                
                <div className="p-6 max-h-[400px] overflow-y-auto">
                  {pendingFeedbacks.length === 0 ? (
                    <div className="text-center py-12">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                      >
                        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">Tuyệt vời!</h3>
                      <p className="text-gray-500">Bạn đã hoàn thành tất cả đánh giá</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingFeedbacks.map((schedule, index) => (
                        <motion.div
                          key={schedule._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="border-2 border-red-200 rounded-xl p-5 bg-gradient-to-r from-red-50 to-pink-50 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="bg-blue-500 rounded-full p-2">
                                  <FaUserMd className="text-white text-sm" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-800 text-lg">
                                    Bác sĩ {schedule.doctor?.username || 'N/A'}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {schedule.doctor?.specialization || 'Chuyên khoa'}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <FaCalendarAlt className="text-blue-500" />
                                  <span className="font-medium">{formatDate(schedule.date)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <FaClock className="text-green-500" />
                                  <span>{schedule.timeSlot?.startTime} - {schedule.timeSlot?.endTime}</span>
                                </div>
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedSchedule(schedule);
                                setShowFeedbackForm(true);
                              }}
                              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              Đánh giá ngay
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Completed Feedbacks */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <FaCheckCircle className="text-2xl" />
                    Đã đánh giá ({completedFeedbacks.length})
                  </h2>
                  <p className="text-green-100 mt-2">Lịch sử đánh giá đã hoàn thành</p>
                </div>
                
                <div className="p-6 max-h-[400px] overflow-y-auto">
                  {completedFeedbacks.length === 0 ? (
                    <div className="text-center py-12">
                      <FaComment className="text-gray-400 text-6xl mx-auto mb-4" />
                      <p className="text-gray-500">Chưa có đánh giá nào</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {completedFeedbacks.map((schedule, index) => (
                        <motion.div
                          key={schedule._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="border-2 border-green-200 rounded-xl p-5 bg-gradient-to-r from-green-50 to-emerald-50 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="bg-green-500 rounded-full p-2">
                                  <FaUserMd className="text-white text-sm" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-800 text-lg">
                                    Bác sĩ {schedule.doctor?.username || 'N/A'}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {schedule.doctor?.specialization || 'Chuyên khoa'}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <FaCalendarAlt className="text-blue-500" />
                                  <span className="font-medium">{formatDate(schedule.date)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <FaClock className="text-green-500" />
                                  <span>{schedule.timeSlot?.startTime} - {schedule.timeSlot?.endTime}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg font-medium">
                                <FaCheckCircle />
                                <span>Đã đánh giá</span>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleViewDetail(schedule)}
                                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                              >
                                <FaEye />
                                Xem chi tiết
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Skipped Feedbacks - Full Width */}
            {skippedFeedbacks.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6 text-white">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <FaClock className="text-2xl" />
                    Đã hoãn ({skippedFeedbacks.length})
                  </h2>
                  <p className="text-orange-100 mt-2">Các đánh giá đã hoãn tạm thời</p>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {skippedFeedbacks.map((schedule, index) => (
                      <motion.div
                        key={schedule._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="border-2 border-orange-200 rounded-xl p-4 bg-gradient-to-r from-orange-50 to-yellow-50 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="bg-orange-500 rounded-full p-2">
                              <FaUserMd className="text-white text-xs" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-800 text-sm">
                                Bác sĩ {schedule.doctor?.username || 'N/A'}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {schedule.doctor?.specialization || 'Chuyên khoa'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-600 text-xs">
                              <FaCalendarAlt className="text-blue-500" />
                              <span className="font-medium">{formatDate(schedule.date)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 text-xs">
                              <FaClock className="text-green-500" />
                              <span>{schedule.timeSlot?.startTime} - {schedule.timeSlot?.endTime}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                setSelectedSchedule(schedule);
                                setShowFeedbackForm(true);
                              }}
                              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-2 px-3 rounded-lg font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              Đánh giá ngay
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleUnSkip(schedule._id)}
                              className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-1.5 px-3 rounded-lg font-medium text-xs"
                            >
                              Bỏ hoãn
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Feedback Form Modal */}
        {showFeedbackForm && selectedSchedule && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Đánh giá buổi khám
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowFeedbackForm(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    <FaTimes />
                  </motion.button>
                </div>
                
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong className="text-gray-800">Bác sĩ:</strong> {selectedSchedule.doctor?.username}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong className="text-gray-800">Ngày:</strong> {formatDate(selectedSchedule.date)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong className="text-gray-800">Giờ:</strong> {selectedSchedule.timeSlot?.startTime} - {selectedSchedule.timeSlot?.endTime}
                    </p>
                  </div>
                </div>
                
                <FeedbackForm
                  schedule={selectedSchedule}
                  onSuccess={handleFeedbackSubmit}
                  onClose={() => setShowFeedbackForm(false)}
                  loading={createLoading}
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedDetailSchedule && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 pt-20">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto scroll-bar-hidden mt-4"
            >
              {/* Header with gradient background */}
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 p-4 rounded-t-2xl text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <FaEye className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Chi tiết đánh giá</h3>
                      <p className="text-blue-100 text-sm mt-1">Thông tin buổi khám và đánh giá</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowDetailModal(false)}
                    className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-300"
                  >
                    <FaTimes className="text-white text-lg" />
                  </motion.button>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Schedule Info */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-blue-200/50 shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-2">
                        <FaStethoscope className="text-white" />
                      </div>
                      <h4 className="font-bold text-lg text-gray-800">Thông tin buổi khám</h4>
                    </div>
                    
                    <div className="grid gap-3">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full p-2">
                          <FaUserMd className="text-white text-sm" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Bác sĩ</p>
                          <p className="font-bold text-gray-800">{selectedDetailSchedule.doctor?.username}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-2">
                          <FaCalendarAlt className="text-white text-sm" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Ngày khám</p>
                          <p className="font-bold text-gray-800">{formatDate(selectedDetailSchedule.date)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-2">
                          <FaClock className="text-white text-sm" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Thời gian</p>
                          <p className="font-bold text-gray-800">{selectedDetailSchedule.timeSlot?.startTime} - {selectedDetailSchedule.timeSlot?.endTime}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Feedback Info */}
                {detailFeedback ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-2xl"></div>
                    <div className="relative bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-yellow-200/50 shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full p-2">
                          <FaStar className="text-white" />
                        </div>
                        <h4 className="font-bold text-lg text-gray-800">Đánh giá của bạn</h4>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                          <p className="text-sm font-semibold text-gray-600 mb-3">Xếp hạng:</p>
                          <div className="flex items-center gap-3">
                            {renderStars(detailFeedback.rating)}
                            <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold rounded-full">
                              {detailFeedback.rating === 5 ? 'Xuất sắc' : 
                               detailFeedback.rating === 4 ? 'Tốt' :
                               detailFeedback.rating === 3 ? 'Khá' :
                               detailFeedback.rating === 2 ? 'Trung bình' : 'Cần cải thiện'}
                            </span>
                          </div>
                        </div>
                        
                        {detailFeedback.comment && (
                          <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                            <p className="text-sm font-semibold text-gray-600 mb-2">Nhận xét:</p>
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                              <p className="text-gray-700 leading-relaxed italic text-sm">"{detailFeedback.comment}"</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                          <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Thời gian đánh giá:</p>
                            <p className="text-gray-700 font-medium text-sm">{formatDateTime(detailFeedback.createdAt)}</p>
                          </div>
                          {detailFeedback.isAnonymous && (
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                              <span className="flex items-center gap-2">
                                🕶️ Ẩn danh
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="relative">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                      <div className="absolute inset-0 rounded-full bg-blue-100/20 animate-pulse"></div>
                    </div>
                    <p className="text-gray-600 font-medium">Đang tải thông tin đánh giá...</p>
                    <p className="text-gray-400 text-sm mt-2">Vui lòng chờ trong giây lát</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default FeedbackPage; 