import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctorByRegisterId, reRegisterDoctor } from '../../../redux/APIs/slices/doctorRegisterSlice';
import DoctorDetailModal from '../components/DoctorDetailModal';

const statusColor = {
  pending: 'text-yellow-700 bg-yellow-100',
  accepted: 'text-green-600 bg-green-100',
  rejected: 'text-red-600 bg-red-100',
};

const DoctorRegisterForm = () => {
  const dispatch = useDispatch();
  const { doctorDetail, doctorDetailStatus, doctorDetailMessage } = useSelector(state => state.doctorRegisterSlice);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [errorSave, setErrorSave] = useState(null);
  const [successSave, setSuccessSave] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [zoom, setZoom] = useState(1);
  const [education, setEducation] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);
  const [schoolInput, setSchoolInput] = useState([""]);
  const [workplaceInput, setWorkplaceInput] = useState("");
  const [recentJob, setRecentJob] = useState("");

  useEffect(() => {
    dispatch(getDoctorByRegisterId());
  }, [dispatch]);

  useEffect(() => {
    if (doctorDetail && doctorDetail.doctor) {
      setFormData({
        username: doctorDetail.doctor.username || '',
        email: doctorDetail.doctor.email || '',
        phone: doctorDetail.doctor.phone || '',
        dateOfBirth: doctorDetail.doctor.dateOfBirth ? doctorDetail.doctor.dateOfBirth.slice(0, 10) : '',
        fullName: doctorDetail.doctor.fullName || '',
        address: doctorDetail.doctor.address || '',
        doctorType: doctorDetail.doctor.doctorType || '',
        workplace: doctorDetail.doctor.workplace || '',
        description: doctorDetail.doctor.description || '',
        certifications: doctorDetail.doctor.certifications
          ? doctorDetail.doctor.certifications.map(cert => ({
              url: cert.url,
              description: cert.description || '',
              _id: cert._id,
            }))
          : [],
        avatar: doctorDetail.doctor.avatar || '',
      });
    }
  }, [doctorDetail]);

  useEffect(() => {
    if (isEditing && doctorDetail && doctorDetail.doctor) {
      setEducation(
        doctorDetail.doctor.education && doctorDetail.doctor.education.length > 0
          ? doctorDetail.doctor.education.map(e => ({
              institution: e.institution || "",
              degree: e.degree || "",
              year: e.year || ""
            }))
          : [{ institution: "", degree: "", year: "" }]
      );
      setWorkExperience(
        doctorDetail.doctor.workExperience && doctorDetail.doctor.workExperience.length > 0
          ? doctorDetail.doctor.workExperience.map(w => ({
              workplace: w.workplace || "",
              position: w.position || "",
              startYear: w.startYear || "",
              endYear: w.endYear || ""
            }))
          : [{ workplace: "", position: "", startYear: "", endYear: "" }]
      );
      setSchoolInput(
        doctorDetail.doctor.education && doctorDetail.doctor.education.length > 0
          ? doctorDetail.doctor.education.map(e => e.institution || "")
          : [""]
      );
      setWorkplaceInput(doctorDetail.doctor.workplace || "");
      setRecentJob(doctorDetail.doctor.recentJob || "");
    }
  }, [isEditing, doctorDetail]);

  const handleEdit = () => {
    setIsEditing(true);
    setSuccessSave(false);
    setErrorSave(null);
    setFormData(prev => ({
      ...prev,
      certifications: doctorDetail.doctor.certifications
        ? doctorDetail.doctor.certifications.map(cert => ({
            url: cert.url,
            description: cert.description || '',
            _id: cert._id,
          }))
        : [],
    }));
  };

  const handleEducationChange = (idx, field, value) => {
    setEducation(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
    if (field === 'institution') {
      setSchoolInput(prev => prev.map((item, i) => i === idx ? value : item));
    }
  };

  const handleAddEducation = () => {
    setEducation(prev => [...prev, { institution: "", degree: "", year: "" }]);
    setSchoolInput(prev => [...prev, ""]);
  };

  const handleRemoveEducation = (idx) => {
    setEducation(prev => prev.filter((_, i) => i !== idx));
    setSchoolInput(prev => prev.filter((_, i) => i !== idx));
  };

  const handleWorkExperienceChange = (idx, field, value) => {
    setWorkExperience(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const handleAddWorkExperience = () => {
    setWorkExperience(prev => [...prev, { workplace: "", position: "", startYear: "", endYear: "" }]);
  };

  const handleRemoveWorkExperience = (idx) => {
    setWorkExperience(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoadingSave(true);
    setErrorSave(null);
    setSuccessSave(false);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'certifications' && Array.isArray(value)) {
          const certDescriptions = value.map(cert => ({
            description: cert.description,
            url: cert.url || undefined,
            _id: cert._id || undefined,
          }));
          data.append('certifications', JSON.stringify(certDescriptions));
          value.forEach(cert => cert.file && data.append('certificationImages', cert.file));
        } else if (key === 'avatar' && value && value instanceof File) {
          data.append('avatar', value);
        } else {
          data.append(key, value);
        }
      });
      const eduArr = education
        .filter(e => e.institution.trim() !== "" || e.degree.trim() !== "" || e.year)
        .map(e => ({
          institution: e.institution,
          degree: e.degree,
          year: e.year ? Number(e.year) : undefined,
        }));
      data.append('education', JSON.stringify(eduArr));
      const workArr = workExperience
        .filter(w => w.workplace.trim() !== "" || w.position.trim() !== "" || w.startYear)
        .map(w => ({
          workplace: w.workplace,
          position: w.position,
          startYear: w.startYear ? Number(w.startYear) : undefined,
          endYear: w.endYear ? Number(w.endYear) : undefined,
        }));
      data.append('workExperience', JSON.stringify(workArr));
      data.append('workplace', workplaceInput);
      data.append('recentJob', recentJob);
      data.append('doctorId', doctorDetail.doctor.doctorId);
      await dispatch(reRegisterDoctor(data));
      setIsEditing(false);
      setSuccessSave(true);
      dispatch(getDoctorByRegisterId());
      setRecentJob("");
    } catch {
      setErrorSave('Có lỗi khi lưu.');
    } finally {
      setLoadingSave(false);
    }
  };

  const handleImageClick = (url) => {
    setImageUrl(url);
    setShowImage(true);
  };

  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      setZoom((z) => Math.max(0.5, Math.min(3, z - e.deltaY * 0.001)));
    }
  };

  const handleZoomIn = () => setZoom((z) => Math.min(3, z + 0.2));
  const handleZoomOut = () => setZoom((z) => Math.max(0.5, z - 0.2));
  const handleCloseImage = () => {
    setShowImage(false);
    setZoom(1);
  };

  const handleAddCertification = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const newCerts = files.map((file) => ({ file, url: URL.createObjectURL(file), description: '' }));
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications ? [...prev.certifications, ...newCerts] : [...newCerts],
    }));
  };

  const handleRemoveCertification = (index) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  const handleCertDescriptionChange = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.certifications];
      updated[index].description = value;
      return { ...prev, certifications: updated };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 7v7m0 0H7m5 0h5" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Đơn đăng ký bác sĩ</h1>
              <p className="text-gray-600 mt-1">Quản lý thông tin đăng ký của bạn</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {doctorDetailStatus === 'loading' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-blue-600 font-medium">Đang tải dữ liệu...</p>
          </div>
        )}

        {/* Error State */}
        {doctorDetailStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Không thể tải dữ liệu</h3>
            <p className="text-red-600">{doctorDetailMessage}</p>
          </div>
        )}

        {/* Main Content */}
        {doctorDetail && doctorDetail.doctor && !showDetail && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Status Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-white font-semibold text-lg">{doctorDetail.doctor.fullName}</h2>
                    <p className="text-blue-100 text-sm">{doctorDetail.doctor.email}</p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColor[doctorDetail.doctor.status] || 'text-yellow-700 bg-yellow-100'}`}>
                  {doctorDetail.doctor.status === 'accepted' ? 'Đã chấp nhận' : doctorDetail.doctor.status === 'pending' ? 'Đang chờ duyệt' : 'Bị từ chối'}
                </span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Họ tên</span>
                  </div>
                  <p className="text-gray-900 font-medium">{doctorDetail.doctor.fullName}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</span>
                  </div>
                  <p className="text-gray-900 font-medium">{doctorDetail.doctor.email}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Chuyên khoa</span>
                  </div>
                  <p className="text-gray-900 font-medium">{doctorDetail.doctor.doctorType}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Trạng thái</span>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColor[doctorDetail.doctor.status] || 'text-yellow-700 bg-yellow-100'}`}>
                    {doctorDetail.doctor.status === 'accepted' ? 'Đã chấp nhận' : doctorDetail.doctor.status === 'pending' ? 'Đang chờ duyệt' : 'Bị từ chối'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 text-center">
                <button
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  onClick={() => setShowDetail(true)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Xem chi tiết và chỉnh sửa
                </button>
                <p className="text-xs text-gray-500 mt-3">* Bấm vào để xem chi tiết và chỉnh sửa</p>
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        <DoctorDetailModal
          doctorDetail={doctorDetail}
          isOpen={showDetail}
          onClose={() => setShowDetail(false)}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          formData={formData}
          setFormData={setFormData}
          education={education}
          setEducation={setEducation}
          workExperience={workExperience}
          setWorkExperience={setWorkExperience}
          schoolInput={schoolInput}
          setSchoolInput={setSchoolInput}
          workplaceInput={workplaceInput}
          setWorkplaceInput={setWorkplaceInput}
          recentJob={recentJob}
          setRecentJob={setRecentJob}
          loadingSave={loadingSave}
          errorSave={errorSave}
          successSave={successSave}
          onSave={handleSave}
          onEdit={handleEdit}
          showImage={showImage}
          setShowImage={setShowImage}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          zoom={zoom}
          setZoom={setZoom}
          handleImageClick={handleImageClick}
          handleWheel={handleWheel}
          handleZoomIn={handleZoomIn}
          handleZoomOut={handleZoomOut}
          handleCloseImage={handleCloseImage}
          handleAddCertification={handleAddCertification}
          handleRemoveCertification={handleRemoveCertification}
          handleCertDescriptionChange={handleCertDescriptionChange}
          handleEducationChange={handleEducationChange}
          handleAddEducation={handleAddEducation}
          handleRemoveEducation={handleRemoveEducation}
          handleWorkExperienceChange={handleWorkExperienceChange}
          handleAddWorkExperience={handleAddWorkExperience}
          handleRemoveWorkExperience={handleRemoveWorkExperience}
        />
      </div>
    </div>
  );
};

export default DoctorRegisterForm;