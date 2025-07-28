import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getPendingSchedules, 
  acceptRegisterSchedule, 
  rejectRegisterSchedule,
  getMySchedules,
  selectPendingSchedules, 
  selectMySchedules,
  selectTotalSchedules,
  selectGetPendingLoading,
  selectAcceptLoading,
  selectRejectLoading,
  selectScheduleError,
  selectScheduleSuccess,
  clearScheduleState
} from '../../../redux/APIs/slices/scheduleSlice';
import { FaCheck, FaTimes, FaUser, FaCalendar, FaClock, FaPhone, FaEnvelope, FaEye, FaList } from 'react-icons/fa';
import { AnimatePresence } from 'framer-motion';
import {CustomToast} from '../../../components/Toast/CustomToast';

const DoctorPendingSchedule = () => {
  const dispatch = useDispatch();
  const pendingSchedules = useSelector(selectPendingSchedules);
  const mySchedules = useSelector(selectMySchedules);
  const totalSchedules = useSelector(selectTotalSchedules);
  const loading = useSelector(selectGetPendingLoading);
  const acceptLoading = useSelector(selectAcceptLoading);
  const rejectLoading = useSelector(selectRejectLoading);
  const error = useSelector(selectScheduleError);
  const success = useSelector(selectScheduleSuccess);
  
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [activeTab, setActiveTab] = useState('pending'); // 'all', 'pending', 'accepted', 'rejected'

  useEffect(() => {
    dispatch(getPendingSchedules());
    dispatch(getMySchedules()); // Thêm getMySchedules để có dữ liệu cho stats
    return () => {
      dispatch(clearScheduleState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      CustomToast({ message: error, type: 'error' });
    }
    if (success) {
      CustomToast({ message: success, type: 'success' });
    }
  }, [error, success]);

  const handleAccept = async (scheduleId) => {
    try {
      await dispatch(acceptRegisterSchedule(scheduleId)).unwrap();
      dispatch(getPendingSchedules()); // Refresh pending list
      dispatch(getMySchedules()); // Refresh my schedules để cập nhật stats
    } catch {
      // Error handled by slice
    }
  };

  const handleReject = async (scheduleId) => {
    if (!rejectReason.trim()) {
      CustomToast({ message: 'Vui lòng nhập lý do từ chối', type: 'error' });
      return;
    }
    
    try {
      await dispatch(rejectRegisterSchedule({ scheduleId, rejectedReason: rejectReason })).unwrap();
      setRejectReason('');
      setShowDetailModal(false);
      setSelectedSchedule(null);
      dispatch(getPendingSchedules()); // Refresh pending list
      dispatch(getMySchedules()); // Refresh my schedules để cập nhật stats
    } catch {
      // Error handled by slice
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

  const getStatusColor = (schedule) => {
    switch (schedule.status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'booked':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'available':
        // Available mà có rejectedReason thì là "Đã từ chối", không có thì là "Đang chờ"
        return schedule.rejectedReason 
          ? 'bg-red-100 text-red-800 border-red-200'
          : 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (schedule) => {
    switch (schedule.status) {
      case 'pending':
        return 'Đang chờ xác nhận';
      case 'booked':
        return 'Đã xác nhận';
      case 'rejected':
        return 'Đã từ chối';
      case 'available':
        // Available mà có rejectedReason thì là "Đã từ chối", không có thì là "Đang chờ"
        return schedule.rejectedReason ? 'Đã từ chối' : 'Đang chờ';
      default:
        return 'Không xác định';
    }
  };

  // Tính toán stats từ cả pendingSchedules và mySchedules
  const pendingCount = pendingSchedules.filter(s => s.status === 'pending').length;
  const acceptedCount = mySchedules.filter(s => s.status === 'booked' && s.patient).length;
  const rejectedCount = mySchedules.filter(s => s.status === 'available' && !s.patient && s.rejectedReason).length;
  // Sử dụng totalSchedules từ Redux thay vì tính toán
  const totalSchedulesCount = totalSchedules;

  // Lọc schedules theo activeTab
  const getFilteredSchedules = () => {
    switch (activeTab) {
      case 'all':
        // Tab "All" hiển thị tất cả schedules từ mySchedules
        return mySchedules;
      case 'pending':
        return pendingSchedules.filter(s => s.status === 'pending');
      case 'accepted':
        return mySchedules.filter(s => s.status === 'booked' && s.patient);
      case 'rejected':
        // Lịch bị từ chối sẽ có status "available" và patient = null
        return mySchedules.filter(s => s.status === 'available' && !s.patient && s.rejectedReason);
      default:
        return pendingSchedules;
    }
  };

  const filteredSchedules = getFilteredSchedules();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-blue-600 font-medium">Đang tải danh sách lịch hẹn...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl">
              <FaClock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Quản lý lịch hẹn</h1>
              <p className="text-gray-600 mt-1">Xem và quản lý tất cả lịch hẹn của bạn</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            className={`bg-white rounded-xl p-6 shadow-lg border border-gray-100 cursor-pointer transition-all duration-200 hover:shadow-xl ${activeTab === 'all' ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng số lịch</p>
                <p className="text-2xl font-bold text-gray-900">{totalSchedulesCount}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaList className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div 
            className={`bg-white rounded-xl p-6 shadow-lg border border-gray-100 cursor-pointer transition-all duration-200 hover:shadow-xl ${activeTab === 'pending' ? 'ring-2 ring-yellow-500' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đang chờ</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FaClock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div 
            className={`bg-white rounded-xl p-6 shadow-lg border border-gray-100 cursor-pointer transition-all duration-200 hover:shadow-xl ${activeTab === 'accepted' ? 'ring-2 ring-green-500' : ''}`}
            onClick={() => setActiveTab('accepted')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã xác nhận</p>
                <p className="text-2xl font-bold text-green-600">{acceptedCount}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FaCheck className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div 
            className={`bg-white rounded-xl p-6 shadow-lg border border-gray-100 cursor-pointer transition-all duration-200 hover:shadow-xl ${activeTab === 'rejected' ? 'ring-2 ring-red-500' : ''}`}
            onClick={() => setActiveTab('rejected')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã từ chối</p>
                <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <FaTimes className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {filteredSchedules.length === 0 ? (
          <div 
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCalendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {activeTab === 'all' && 'Không có lịch hẹn nào'}
              {activeTab === 'pending' && 'Không có lịch hẹn đang chờ'}
              {activeTab === 'accepted' && 'Không có lịch hẹn đã xác nhận'}
              {activeTab === 'rejected' && 'Không có lịch hẹn đã từ chối'}
            </h3>
            <p className="text-gray-600">
              {activeTab === 'all' && 'Bạn chưa có lịch hẹn nào được tạo'}
              {activeTab === 'pending' && 'Hiện tại không có lịch hẹn nào đang chờ xác nhận'}
              {activeTab === 'accepted' && 'Chưa có lịch hẹn nào được xác nhận'}
              {activeTab === 'rejected' && 'Chưa có lịch hẹn nào bị từ chối'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {activeTab === 'all' && `Tất cả lịch hẹn (${filteredSchedules.length})`}
                {activeTab === 'pending' && `Lịch hẹn đang chờ (${filteredSchedules.length})`}
                {activeTab === 'accepted' && `Lịch hẹn đã xác nhận (${filteredSchedules.length})`}
                {activeTab === 'rejected' && `Lịch hẹn đã từ chối (${filteredSchedules.length})`}
              </h3>
            </div>
            
            {/* Tab "All" không có scroll, các tab khác có scroll */}
            <div className={activeTab === 'all' ? '' : (filteredSchedules.length >= 3 ? 'max-h-[600px] overflow-y-auto scroll-bar-hidden' : '')}>
              <div className={`space-y-4 p-6 ${activeTab === 'all' ? '' : ''}`}>
                <AnimatePresence>
                  {filteredSchedules.map((schedule) => (
                    <div
                      key={schedule._id}
                      className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200"
                    >
                      {/* Header */}
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center overflow-hidden">
                              {schedule.patient?.avatar ? (
                                <img 
                                  src={schedule.patient.avatar} 
                                  alt={schedule.patient.username || 'Avatar'} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <FaUser className="w-5 h-5 text-white" />
                              )}
                            </div>
                            <div>
                              <h3 className="text-white font-semibold text-lg">
                                {schedule.patient?.username || 'Lịch hẹn trống'}
                              </h3>
                              <p className="text-blue-100 text-sm">
                                {schedule.patient?.email || 'Không có thông tin bệnh nhân'}
                              </p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(schedule)}`}>
                            {getStatusText(schedule)}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Left Column */}
                          <div className="space-y-4">
                            {/* Date & Time */}
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FaCalendar className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Ngày hẹn</p>
                                <p className="font-semibold text-gray-900">{formatDate(schedule.date)}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <FaClock className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Thời gian</p>
                                <p className="font-semibold text-gray-900">
                                  {formatTime(schedule.timeSlot.startTime)} - {formatTime(schedule.timeSlot.endTime)}
                                </p>
                              </div>
                            </div>

                            {/* Appointment Type */}
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">Loại hẹn:</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                schedule.appointmentType === 'online' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {schedule.appointmentType === 'online' ? 'Trực tuyến' : 'Tại phòng khám'}
                              </span>
                            </div>
                          </div>

                          {/* Right Column */}
                          <div className="space-y-4">
                            {/* Patient Info */}
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              <h4 className="font-semibold text-gray-900 mb-3">
                                {schedule.patient ? 'Thông tin bệnh nhân' : 'Thông tin lịch hẹn'}
                              </h4>
                              <div className="space-y-2">
                                {schedule.patient ? (
                                  <>
                                    <div className="flex items-center gap-2">
                                      <FaEnvelope className="w-4 h-4 text-gray-400" />
                                      <span className="text-sm text-gray-600">{schedule.patient?.email || 'N/A'}</span>
                                    </div>
                                    {schedule.patient?.phone && (
                                      <div className="flex items-center gap-2">
                                        <FaPhone className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">{schedule.patient.phone}</span>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <div className="text-sm text-gray-600">
                                    {schedule.rejectedReason ? (
                                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                        <p className="text-red-800">
                                          <span className="font-semibold">Lý do từ chối:</span> {schedule.rejectedReason}
                                        </p>
                                      </div>
                                    ) : (
                                      <p>Lịch hẹn chưa có người đăng ký</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Notes */}
                            {schedule.notes && (
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="text-sm text-yellow-800">
                                  <span className="font-semibold">Ghi chú:</span> {schedule.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex gap-3">
                          <button
                            onClick={() => {
                              setSelectedSchedule(schedule);
                              setShowDetailModal(true);
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <FaEye className="w-4 h-4" />
                            Chi tiết
                          </button>
                          
                          {/* Chỉ hiển thị nút Accept/Reject cho pending schedules có patient */}
                          {schedule.status === 'pending' && schedule.patient && (
                            <>
                              <button
                                onClick={() => handleAccept(schedule._id)}
                                disabled={acceptLoading}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {acceptLoading ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                  <FaCheck className="w-4 h-4" />
                                )}
                                {acceptLoading ? 'Đang xác nhận...' : 'Xác nhận'}
                              </button>
                              
                              <button
                                onClick={() => {
                                  setSelectedSchedule(schedule);
                                  setShowDetailModal(true);
                                }}
                                disabled={rejectLoading}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {rejectLoading ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                  <FaTimes className="w-4 h-4" />
                                )}
                                {rejectLoading ? 'Đang từ chối...' : 'Từ chối'}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedSchedule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div 
              className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Chi tiết lịch hẹn</h3>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedSchedule(null);
                    setRejectReason('');
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {selectedSchedule.patient ? 'Thông tin bệnh nhân' : 'Thông tin lịch hẹn'}
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {selectedSchedule.patient ? (
                      <>
                        <p><span className="font-medium">Tên:</span> {selectedSchedule.patient?.username}</p>
                        <p><span className="font-medium">Email:</span> {selectedSchedule.patient?.email}</p>
                        {selectedSchedule.patient?.phone && (
                          <p><span className="font-medium">SĐT:</span> {selectedSchedule.patient.phone}</p>
                        )}
                      </>
                    ) : (
                      <div>
                        {selectedSchedule.rejectedReason ? (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-red-800">
                              <span className="font-semibold">Lý do từ chối:</span> {selectedSchedule.rejectedReason}
                            </p>
                          </div>
                        ) : (
                          <p><span className="font-medium">Trạng thái:</span> Lịch hẹn chưa có người đăng ký</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Thông tin lịch hẹn</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p><span className="font-medium">Ngày:</span> {formatDate(selectedSchedule.date)}</p>
                    <p><span className="font-medium">Thời gian:</span> {formatTime(selectedSchedule.timeSlot.startTime)} - {formatTime(selectedSchedule.timeSlot.endTime)}</p>
                    <p><span className="font-medium">Loại hẹn:</span> {selectedSchedule.appointmentType === 'online' ? 'Trực tuyến' : 'Tại phòng khám'}</p>
                    {selectedSchedule.notes && (
                      <p><span className="font-medium">Ghi chú:</span> {selectedSchedule.notes}</p>
                    )}
                  </div>
                </div>

                {selectedSchedule.status === 'pending' && selectedSchedule.patient && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Lý do từ chối</h4>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Nhập lý do từ chối (bắt buộc)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 resize-none"
                      rows={3}
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setSelectedSchedule(null);
                      setRejectReason('');
                    }}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Đóng
                  </button>
                  
                  {selectedSchedule.status === 'pending' && selectedSchedule.patient && (
                    <button
                      onClick={() => handleReject(selectedSchedule._id)}
                      disabled={!rejectReason.trim() || rejectLoading}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {rejectLoading ? 'Đang từ chối...' : 'Từ chối'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPendingSchedule;
