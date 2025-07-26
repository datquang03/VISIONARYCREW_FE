import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctorByRegisterId, reRegisterDoctor } from '../../../redux/APIs/slices/doctorRegisterSlice';
import { FaPlus, FaTimesCircle } from 'react-icons/fa';
import ShortLoading from '../../../components/Loading/ShortLoading';

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
        avatar: null,
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full animate-fade-in">
      <h2 className="text-xl sm:text-2xl mb-6 sm:mb-8 text-blue-700 font-bold flex items-center gap-2">
        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 7v7m0 0H7m5 0h5" />
        </svg>
        Đơn đăng ký bác sĩ của bạn
      </h2>
      {doctorDetailStatus === 'loading' && (
        <p className="text-base sm:text-lg text-blue-500 animate-pulse text-center">Đang tải dữ liệu...</p>
      )}
      {doctorDetailStatus === 'error' && (
        <p className="text-red-500 text-center text-sm sm:text-base">{doctorDetailMessage}</p>
      )}
      {doctorDetail && doctorDetail.doctor && !showDetail && (
        <div className="animate-fade-in">
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-semibold">Họ tên</p>
                <p className="text-gray-800 text-sm sm:text-base">{doctorDetail.doctor.fullName}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-semibold">Email</p>
                <p className="text-gray-800 text-sm sm:text-base">{doctorDetail.doctor.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-semibold">Chuyên khoa</p>
                <p className="text-gray-800 text-sm sm:text-base">{doctorDetail.doctor.doctorType}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-semibold">Trạng thái</p>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[doctorDetail.doctor.status] || 'text-yellow-700 bg-yellow-100'}`}>
                  {doctorDetail.doctor.status === 'accepted' ? 'Đã chấp nhận' : doctorDetail.doctor.status === 'pending' ? 'Đang chờ duyệt' : 'Bị từ chối'}
                </span>
              </div>
            </div>
            <button
              className="w-full bg-blue-50 text-blue-600 py-2 text-sm sm:text-base font-semibold hover:bg-blue-100 transition-colors"
              onClick={() => setShowDetail(true)}
            >
              Xem chi tiết và chỉnh sửa
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">* Bấm vào để xem chi tiết và chỉnh sửa</p>
        </div>
      )}
      {doctorDetail && doctorDetail.doctor && showDetail && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl animate-fade-in">
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl sm:text-3xl"
              onClick={() => setShowDetail(false)}
            >
              &times;
            </button>
            <form onSubmit={handleSave} className="space-y-4 sm:space-y-6">
              <div className="flex flex-col items-center gap-4 mb-4">
                {doctorDetail.doctor.avatar && (
                  <img
                    src={doctorDetail.doctor.avatar}
                    alt="avatar"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow border object-cover"
                  />
                )}
                <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${statusColor[doctorDetail.doctor.status] || 'text-yellow-700 bg-yellow-100'}`}>
                  {doctorDetail.doctor.status === 'accepted' ? 'Đã chấp nhận' : doctorDetail.doctor.status === 'pending' ? 'Đang chờ duyệt' : 'Bị từ chối'}
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Tên đăng nhập</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing || doctorDetail.doctor.status === 'accepted'}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Số điện thoại</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing || doctorDetail.doctor.status === 'accepted'}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Ngày sinh</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    disabled={!isEditing || doctorDetail.doctor.status === 'accepted'}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Họ tên</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={!isEditing || doctorDetail.doctor.status === 'accepted'}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Địa chỉ</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing || doctorDetail.doctor.status === 'accepted'}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Chuyên khoa</label>
                  <input
                    type="text"
                    name="doctorType"
                    value={formData.doctorType}
                    onChange={handleChange}
                    disabled={!isEditing || doctorDetail.doctor.status === 'accepted'}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Mô tả</label>
                  {isEditing ? (
                    <textarea
                      name="description"
                      value={typeof formData.description === 'string' ? formData.description : (formData.description ? JSON.stringify(formData.description) : '')}
                      onChange={handleChange}
                      disabled={doctorDetail.doctor.status === 'accepted'}
                      className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-sm sm:text-base resize-y"
                      rows={4}
                    />
                  ) : (
                    <p className="text-sm sm:text-base text-gray-700">
                      {typeof doctorDetail.doctor.description === 'string' ? doctorDetail.doctor.description : (doctorDetail.doctor.description ? JSON.stringify(doctorDetail.doctor.description) : <span className="text-gray-400">Chưa cập nhật</span>)}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Chứng chỉ</label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {isEditing
                      ? formData.certifications && formData.certifications.length > 0 && formData.certifications.map((cert, idx) => (
                          <div key={cert._id || idx} className="relative w-28 sm:w-32 flex flex-col items-center border rounded-lg p-2 bg-gray-50 shadow-sm hover:scale-105 transition-transform">
                            <img
                              src={cert.file ? cert.url : cert.url}
                              alt="cert"
                              className="w-full h-16 sm:h-20 object-cover rounded mb-2 cursor-pointer"
                              onClick={() => handleImageClick(cert.url)}
                            />
                            <input
                              type="text"
                              placeholder="Mô tả"
                              value={cert.description}
                              onChange={e => handleCertDescriptionChange(idx, e.target.value)}
                              className="w-full px-2 py-1 text-xs border rounded-lg"
                            />
                            <button
                              type="button"
                              className="absolute -top-2 -right-2 text-red-600 bg-white rounded-full shadow p-1"
                              onClick={() => handleRemoveCertification(idx)}
                            >
                              <FaTimesCircle size={16} />
                            </button>
                          </div>
                        ))
                      : doctorDetail.doctor.certifications && doctorDetail.doctor.certifications.length > 0 && doctorDetail.doctor.certifications.map((cert, idx) => (
                          <div key={cert._id || idx} className="w-28 sm:w-32 flex flex-col items-center border rounded-lg p-2 bg-gray-50 shadow-sm hover:scale-105 transition-transform cursor-pointer">
                            <img
                              src={cert.url}
                              alt="cert"
                              className="w-full h-16 sm:h-20 object-cover rounded mb-2"
                              onClick={() => handleImageClick(cert.url)}
                            />
                            <span className="text-xs text-gray-700 text-center">{cert.description}</span>
                          </div>
                        ))}
                    {isEditing && (
                      <label className="flex items-center justify-center w-28 sm:w-32 h-20 sm:h-24 border-2 border-dashed border-gray-300 bg-gray-100 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
                        <FaPlus size={20} className="text-gray-500" />
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleAddCertification}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Học vấn</label>
                  {isEditing ? (
                    <div className="space-y-2 mt-2">
                      {education.map((edu, idx) => (
                        <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                          <input
                            type="text"
                            placeholder="Trường học"
                            value={schoolInput[idx]}
                            onChange={e => handleEducationChange(idx, 'institution', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-sm sm:text-base"
                          />
                          <input
                            type="text"
                            placeholder="Bằng cấp"
                            value={edu.degree}
                            onChange={e => handleEducationChange(idx, 'degree', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-sm sm:text-base"
                          />
                          <input
                            type="number"
                            placeholder="Năm"
                            value={edu.year}
                            onChange={e => handleEducationChange(idx, 'year', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-sm sm:text-base"
                          />
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-800 flex items-center justify-center"
                            onClick={() => handleRemoveEducation(idx)}
                          >
                            <FaTimesCircle size={18} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                        onClick={handleAddEducation}
                      >
                        Thêm học vấn
                      </button>
                    </div>
                  ) : Array.isArray(doctorDetail.doctor.education) ? (
                    doctorDetail.doctor.education.length > 0 ? (
                      <ul className="list-disc pl-4 text-sm sm:text-base">
                        {doctorDetail.doctor.education.map((edu, idx) => (
                          <li key={edu._id || idx}>
                            <span className="font-semibold">{edu.institution}</span>
                            {edu.degree && <> - {edu.degree}</>}
                            {edu.year && <> ({edu.year})</>}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 text-sm sm:text-base">Chưa cập nhật</p>
                    )
                  ) : (
                    <p className="text-sm sm:text-base">{typeof doctorDetail.doctor.education === 'string' ? doctorDetail.doctor.education : <span className="text-gray-400">Chưa cập nhật</span>}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Kinh nghiệm làm việc</label>
                  {isEditing ? (
                    <div className="space-y-2 mt-2">
                      {workExperience.map((work, idx) => (
                        <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                          <input
                            type="text"
                            placeholder="Nơi làm việc"
                            value={work.workplace}
                            onChange={e => handleWorkExperienceChange(idx, 'workplace', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-sm sm:text-base"
                          />
                          <input
                            type="text"
                            placeholder="Vị trí"
                            value={work.position}
                            onChange={e => handleWorkExperienceChange(idx, 'position', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-sm sm:text-base"
                          />
                          <input
                            type="number"
                            placeholder="Năm bắt đầu"
                            value={work.startYear}
                            onChange={e => handleWorkExperienceChange(idx, 'startYear', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-sm sm:text-base"
                          />
                          <input
                            type="number"
                            placeholder="Năm kết thúc"
                            value={work.endYear}
                            onChange={e => handleWorkExperienceChange(idx, 'endYear', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-sm sm:text-base"
                          />
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-800 flex items-center justify-center"
                            onClick={() => handleRemoveWorkExperience(idx)}
                          >
                            <FaTimesCircle size={18} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                        onClick={handleAddWorkExperience}
                      >
                        Thêm kinh nghiệm
                      </button>
                    </div>
                  ) : Array.isArray(doctorDetail.doctor.workExperience) ? (
                    doctorDetail.doctor.workExperience.length > 0 ? (
                      <ul className="list-disc pl-4 text-sm sm:text-base">
                        {doctorDetail.doctor.workExperience.map((work, idx) => (
                          <li key={work._id || idx}>
                            <span className="font-semibold">{work.workplace}</span>
                            {work.position && <> - {work.position}</>}
                            {(work.startYear || work.endYear) && (
                              <> ({work.startYear}{work.endYear ? ` - ${work.endYear}` : ""})</>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 text-sm sm:text-base">Chưa cập nhật</p>
                    )
                  ) : (
                    <p className="text-sm sm:text-base">{typeof doctorDetail.doctor.workExperience === 'string' ? doctorDetail.doctor.workExperience : <span className="text-gray-400">Chưa cập nhật</span>}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Công việc gần đây nhất</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="recentJob"
                      value={recentJob}
                      onChange={e => setRecentJob(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-sm sm:text-base"
                    />
                  ) : (
                    <p className="text-sm sm:text-base">{typeof doctorDetail.doctor.recentJob === 'string' ? doctorDetail.doctor.recentJob : (doctorDetail.doctor.recentJob ? JSON.stringify(doctorDetail.doctor.recentJob) : <span className="text-gray-400">Chưa cập nhật</span>)}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Ngày nộp đơn</label>
                  <p className="text-sm sm:text-base text-gray-700">{doctorDetail.doctor.submittedAt}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Ngày cập nhật</label>
                  <p className="text-sm sm:text-base text-gray-700">{doctorDetail.doctor.updatedAt}</p>
                </div>
                {doctorDetail.doctor.status === 'rejected' && doctorDetail.doctor.rejectionMessage && (
                  <div>
                    <label className="block text-sm font-semibold text-red-600">Lý do từ chối</label>
                    <p className="text-sm sm:text-base text-red-600">{doctorDetail.doctor.rejectionMessage}</p>
                  </div>
                )}
              </div>
              {errorSave && <div className="text-red-500 text-sm sm:text-base mt-2">{errorSave}</div>}
              {successSave && <div className="text-green-600 text-sm sm:text-base mt-2">Cập nhật thành công! Đơn sẽ được duyệt lại.</div>}
              <div className="flex justify-end gap-4 mt-4">
                {doctorDetail.doctor.status !== 'accepted' && !isEditing && (
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm sm:text-base font-semibold"
                    onClick={handleEdit}
                  >
                    Sửa đơn đăng ký
                  </button>
                )}
                {isEditing && (
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition-colors text-sm sm:text-base font-semibold disabled:opacity-50"
                    disabled={loadingSave}
                  >
                    {loadingSave ? <ShortLoading text="Đang lưu" /> : 'Lưu thay đổi'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
      {showImage && (
        <div className="fixed inset-0 z-[1101] flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg p-4 max-w-[90vw] max-h-[90vh] overflow-hidden">
            <img
              src={imageUrl}
              alt="cert-full"
              className="max-h-[70vh] max-w-full rounded-lg object-contain"
              style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s' }}
              draggable={false}
              onWheel={handleWheel}
            />
            <button
              className="absolute top-2 right-2 text-white bg-red-500 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold hover:bg-red-600 transition-colors"
              onClick={handleCloseImage}
            >
              &times;
            </button>
            <div className="flex justify-center gap-2 mt-4">
              <button
                type="button"
                className="bg-gray-200 rounded-full px-3 py-1 text-lg font-bold hover:bg-gray-300"
                onClick={handleZoomOut}
              >
                -
              </button>
              <button
                type="button"
                className="bg-gray-200 rounded-full px-3 py-1 text-lg font-bold hover:bg-gray-300"
                onClick={handleZoomIn}
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.7s cubic-bezier(0.4,0,0.2,1) both;
        }
      `}</style>
    </div>
  );
};

export default DoctorRegisterForm;