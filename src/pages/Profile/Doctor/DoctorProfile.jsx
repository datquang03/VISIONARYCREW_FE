/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { gsap } from 'gsap';
import { getDoctorProfile, updateDoctorProfile } from '../../../redux/APIs/slices/doctorProfileSlice';
import { CustomToast } from '../../../components/Toast/CustomToast';
import ShortLoading from '../../../components/Loading/ShortLoading';
import { Link } from 'react-router-dom';

const tabs = ['profile', 'settings', 'activity'];

const DoctorProfile = () => {
  const dispatch = useDispatch();
  const doctorProfile = useSelector((state) => state.doctorProfile || {});
  const { doctor, isLoading, isSuccess, isError, message } = doctorProfile;
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    doctorType: '',
    description: '',
    address: '',
    education: '',
    workExperience: '',
    recentJob: '',
  });
  const profileCardRef = useRef(null);

  useEffect(() => {
    dispatch(getDoctorProfile());
  }, [dispatch]);

  useEffect(() => {
    if (doctor) {
      setFormData({
        fullName: doctor.fullName || '',
        email: doctor.email || '',
        phone: doctor.phone || '',
        dateOfBirth: doctor.dateOfBirth || '',
        doctorType: doctor.doctorType || '',
        description: doctor.description || '',
        address: doctor.address || '',
        education: Array.isArray(doctor.education) ? doctor.education.join(', ') : '',
        workExperience: Array.isArray(doctor.workExperience) ? doctor.workExperience.join(', ') : '',
        recentJob: doctor.recentJob || '',
      });
    }
  }, [doctor]);

  useEffect(() => {
    if (profileCardRef.current) {
      gsap.fromTo(
        profileCardRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = () => {
    // Basic validation
    if (!formData.fullName || !formData.email) {
      CustomToast('Họ tên và email là bắt buộc!', 'error');
      return;
    }

    const updatedData = {
      ...formData,
      education: formData.education
        ? formData.education.split(',').map((item) => item.trim()).filter((item) => item)
        : [],
      workExperience: formData.workExperience
        ? formData.workExperience.split(',').map((item) => item.trim()).filter((item) => item)
        : [],
    };

    dispatch(updateDoctorProfile(updatedData)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        CustomToast('Cập nhật thành công!', 'success');
        dispatch(getDoctorProfile());
      } else {
        console.error('Update error:', res.payload); // Log for debugging
        CustomToast(res.payload?.message || 'Cập nhật thất bại', 'error');
      }
    });
  };

  const animateTabChange = () => {
    gsap.fromTo(
      '.tab-content',
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
    );
  };

  // Format date to dd/mm/yyyy for display
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Chưa cập nhật';
    try {
      let date;
      if (dateStr.includes('-') && dateStr.split('-')[0].length === 4) {
        // YYYY-MM-DD
        date = new Date(dateStr);
      } else if (dateStr.includes('-') && dateStr.split('-')[0].length === 2) {
        // DD-MM-YYYY
        const [day, month, year] = dateStr.split('-');
        date = new Date(`${year}-${month}-${day}`);
      } else {
        date = new Date(dateStr);
      }
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateStr);
        return 'Chưa cập nhật';
      }
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.warn('Date parsing error:', error, dateStr);
      return 'Chưa cập nhật';
    }
  };

  const renderTabContent = () => {
    const isDisabled = doctor?.status !== 'accepted';
    switch (activeTab) {
      case 'profile':
        return (
          <div className="tab-content p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-250px)]">
            <h2 className="text-2xl font-bold text-gray-800">Thông tin bác sĩ</h2>
            <div className="flex items-center gap-4">
              <img
                src={doctor?.avatar || '/default-avatar.png'}
                alt="avatar"
                className="w-24 h-24 rounded-full border shadow"
                ref={(el) => {
                  if (el) {
                    gsap.fromTo(
                      el,
                      { scale: 0.5, opacity: 0 },
                      { scale: 1, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' }
                    );
                  }
                }}
              />
              <div className="space-y-2 w-full">
                <Input label="Họ tên" name="fullName" value={formData.fullName} onChange={handleChange} disabled={isDisabled} />
                <Input label="Email" name="email" value={formData.email} onChange={handleChange} disabled={isDisabled} />
                <Input label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} disabled={isDisabled} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Ngày sinh"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                disabled={isDisabled}
              />
              <Input label="Chuyên khoa" name="doctorType" value={formData.doctorType} onChange={handleChange} disabled={isDisabled} />
              <Input
                label="Trạng thái đăng ký"
                value={
                  doctor?.status === 'accepted'
                    ? 'Đã chấp nhận'
                    : doctor?.status === 'pending'
                    ? 'Chờ duyệt'
                    : 'Từ chối'
                }
                disabled
                className={`font-semibold ${
                  doctor?.status === 'accepted' ? 'text-green-600' : 'text-yellow-600'
                }`}
              />
              <Input label="Vai trò" value={doctor?.role || 'Chưa cập nhật'} disabled />
              <Input label="Mô tả" name="description" value={formData.description} onChange={handleChange} disabled={isDisabled} />
              <Input label="Địa chỉ" name="address" value={formData.address} onChange={handleChange} disabled={isDisabled} />
              <Input
                label="Gói đăng ký"
                value={doctor?.subscription?.packageType || 'Chưa cập nhật'}
                disabled
              />
              <Input
                label="Ngày bắt đầu đăng ký"
                value={formatDate(doctor?.subscription?.startDate)}
                disabled
              />
              <Input
                label="Ngày kết thúc đăng ký"
                value={formatDate(doctor?.subscription?.endDate)}
                disabled
              />
              <Input
                label="Ưu tiên"
                value={doctor?.subscription?.isPriority ? 'Có' : 'Không'}
                disabled
              />
              <Input label="Ngày tạo" value={formatDate(doctor?.createdAt)} disabled />
              <Input label="Ngày cập nhật" value={formatDate(doctor?.updatedAt)} disabled

 />
              <Input
                label="Giới hạn lịch hàng tuần"
                value={`${doctor?.subscription?.scheduleLimits?.weekly || 0} (Đã dùng: ${doctor?.subscription?.scheduleLimits?.used || 0})`}
                disabled
              />
              <Input
                label="Ngày đặt lại lịch"
                value={formatDate(doctor?.subscription?.scheduleLimits?.resetDate)}
                disabled
              />
              <Input
                label="Tin nhắn từ chối"
                value={doctor?.rejectionMessage || 'Không có'}
                disabled
              />
              {/* Học vấn */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Học vấn</label>
                {Array.isArray(doctor?.education) && doctor.education.length > 0 ? (
                  <ul className="list-disc pl-5 text-sm text-gray-700">
                    {doctor.education.map(e => (
                      <li key={e._id}>{e.institution} - {e.degree} ({e.year})</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-400">Chưa cập nhật</span>
                )}
              </div>
              {/* Kinh nghiệm làm việc */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Kinh nghiệm làm việc</label>
                {Array.isArray(doctor?.workExperience) && doctor.workExperience.length > 0 ? (
                  <ul className="list-disc pl-5 text-sm text-gray-700">
                    {doctor.workExperience.map(w => (
                      <li key={w._id}>{w.workplace} - {w.position} ({w.startYear} - {w.endYear})</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-400">Chưa cập nhật</span>
                )}
              </div>
              <Input
                label="Công việc gần đây"
                name="recentJob"
                value={formData.recentJob}
                onChange={handleChange}
                disabled={isDisabled}
                placeholder="Nhập công việc gần đây"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Chứng chỉ</h3>
              {doctor?.certifications?.length ? (
                doctor.certifications.map((cert) => (
                  <div key={cert._id} className="flex items-center gap-2">
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {cert.description || 'Chứng chỉ'}
                    </a>
                    <span className="text-sm text-gray-500">
                      (Tải lên: {formatDate(cert.uploadedAt)})
                    </span>
                  </div>
                ))
              ) : (
                <p>Chưa có chứng chỉ</p>
              )}
            </div>
            <button
              onClick={handleUpdate}
              disabled={isDisabled}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onMouseEnter={(e) => gsap.to(e.target, { scale: 1.05, duration: 0.3 })}
              onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.3 })}
            >
              Cập nhật
            </button>
          </div>
        );

      case 'settings':
        return (
          <div className="tab-content p-6">
            <h2 className="text-2xl font-sm font-semibold text-gray-800">Cài đặt</h2>
            <p>Chức năng đang phát triển.</p>
          </div>
        );

      case 'activity':
        return (
          <div className="tab-content p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Hoạt động gần đây</h2>
            <Activity title="Lịch hẹn" items={doctor?.appointments || []} />
            <Activity title="Bệnh nhân" items={doctor?.patients || []} />
            <Activity title="Blog đã thích" items={doctor?.likedBlogs || []} />
            <Activity title="Cuộc trò chuyện" items={doctor?.conversations || []} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 md:pt-4 pb-24 md:pb-4 bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <Link
        to="/"
        className="fixed top-4 left-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center gap-2 group"
        onMouseEnter={(e) => gsap.to(e.target, { scale: 1.1, duration: 0.3 })}
        onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.3 })}
      >
        <svg
          className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Back to Home
      </Link>
      <div
        ref={profileCardRef}
        className="profile-card max-w-xl w-full bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        {isLoading && <ShortLoading text="Đang tải thông tin bác sĩ..." />}
        {isError && <div className="p-6 text-center text-red-500">{message}</div>}
        {!isSuccess && !isLoading && !isError && (
          <div className="p-6 text-center text-gray-500">Không có dữ liệu để hiển thị</div>
        )}
        {isSuccess && (
          <>
            <div className="bg-blue-600 p-6 text-white text-center">
              <h1
                className="text-3xl font-bold"
                ref={(el) => {
                  if (el) {
                    gsap.fromTo(
                      el,
                      { opacity: 0, y: -20 },
                      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
                    );
                  }
                }}
              >
                Thông tin bác sĩ
              </h1>
              <p className="text-sm mt-2">{message}</p>
            </div>

            <nav className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 py-4 px-6 text-center font-medium transition ${
                    activeTab === tab ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setActiveTab(tab);
                    animateTabChange();
                  }}
                  onMouseEnter={(e) => gsap.to(e.target, { scale: 1.05, duration: 0.3 })}
                  onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.3 })}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>

            {renderTabContent()}
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;

const Input = ({ label, name, value, onChange, type = 'text', disabled = false, className = '', placeholder }) => {
  const inputRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (inputRef.current && !hasAnimated.current) {
      gsap.fromTo(
        inputRef.current,
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
      );
      hasAnimated.current = true;
    }
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        ref={inputRef}
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`mt-1 w-full max-w-lg border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${className}`}
      />
    </div>
  );
};

const Activity = ({ title, items }) => {
  const activityRef = useRef(null);

  useEffect(() => {
    if (activityRef.current) {
      gsap.fromTo(
        activityRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <div ref={activityRef}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p>{items?.length ? items.join(', ') : `Chưa có ${title.toLowerCase()}`}</p>
    </div>
  );
};