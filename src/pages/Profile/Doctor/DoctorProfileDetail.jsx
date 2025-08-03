import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctorProfileById, selectSelectedProfile, selectGetDoctorLoading, selectUserProfileError, clearSelectedProfile } from '../../../redux/APIs/slices/userProfileSlice';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar, FaArrowLeft, FaEdit, FaStethoscope, FaBriefcase, FaGraduationCap } from 'react-icons/fa';
import { CustomToast } from '../../../components/Toast/CustomToast';
import ShortLoading from '../../../components/Loading/ShortLoading';

const DoctorProfileDetail = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const selectedProfile = useSelector(selectSelectedProfile);
  const loading = useSelector(selectGetDoctorLoading);
  const error = useSelector(selectUserProfileError);

  useEffect(() => {
    if (doctorId) {
      dispatch(getDoctorProfileById(doctorId));
    }

    return () => {
      dispatch(clearSelectedProfile());
    };
  }, [dispatch, doctorId]);

  useEffect(() => {
    if (error) {
      CustomToast.error(error);
    }
  }, [error]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`/doctor/profile/edit/${doctorId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted':
        return 'Đã chấp nhận';
      case 'pending':
        return 'Đang chờ';
      case 'rejected':
        return 'Từ chối';
      default:
        return 'Không xác định';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ShortLoading />
      </div>
    );
  }

  if (!selectedProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy thông tin bác sĩ</h2>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Quay lại
          </button>
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Thông tin bác sĩ</h1>
            <button
              onClick={handleEdit}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaEdit className="mr-2" />
              Chỉnh sửa
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Avatar Section */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-green-600 text-2xl font-bold">
                {selectedProfile.username?.charAt(0).toUpperCase() || 'D'}
              </div>
              <div className="ml-6 text-white">
                <h2 className="text-2xl font-bold">{selectedProfile.username || 'N/A'}</h2>
                <p className="text-green-100">Bác sĩ</p>
                {selectedProfile.specialization && (
                  <p className="text-green-200 text-sm">{selectedProfile.specialization}</p>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin cá nhân</h3>
                
                <div className="flex items-center space-x-3">
                  <FaUser className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Tên đăng nhập</p>
                    <p className="font-medium">{selectedProfile.username || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedProfile.email || 'N/A'}</p>
                  </div>
                </div>

                {selectedProfile.phone && (
                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Số điện thoại</p>
                      <p className="font-medium">{selectedProfile.phone}</p>
                    </div>
                  </div>
                )}

                {selectedProfile.address && (
                  <div className="flex items-center space-x-3">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Địa chỉ</p>
                      <p className="font-medium">{selectedProfile.address}</p>
                    </div>
                  </div>
                )}

                {selectedProfile.dateOfBirth && (
                  <div className="flex items-center space-x-3">
                    <FaCalendar className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Ngày sinh</p>
                      <p className="font-medium">{selectedProfile.dateOfBirth}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin chuyên môn</h3>
                
                <div className="space-y-3">
                  {selectedProfile.specialization && (
                    <div className="flex items-center space-x-3">
                      <FaStethoscope className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Chuyên khoa</p>
                        <p className="font-medium">{selectedProfile.specialization}</p>
                      </div>
                    </div>
                  )}

                  {selectedProfile.experience && (
                    <div className="flex items-center space-x-3">
                      <FaGraduationCap className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Kinh nghiệm</p>
                        <p className="font-medium">{selectedProfile.experience} năm</p>
                      </div>
                    </div>
                  )}

                  {selectedProfile.recentJob && (
                    <div className="flex items-center space-x-3">
                      <FaBriefcase className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Công việc hiện tại</p>
                        <p className="font-medium">{selectedProfile.recentJob}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-500">Trạng thái đăng ký</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedProfile.doctorApplicationStatus)}`}>
                      {getStatusText(selectedProfile.doctorApplicationStatus)}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Vai trò</p>
                    <p className="font-medium capitalize">{selectedProfile.role || 'doctor'}</p>
                  </div>

                  {selectedProfile.createdAt && (
                    <div>
                      <p className="text-sm text-gray-500">Ngày tạo tài khoản</p>
                      <p className="font-medium">{new Date(selectedProfile.createdAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                  )}

                  {selectedProfile.updatedAt && (
                    <div>
                      <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
                      <p className="font-medium">{new Date(selectedProfile.updatedAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {selectedProfile.description && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Mô tả</h3>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                  {selectedProfile.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileDetail; 