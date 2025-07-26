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
  // State cho education/workExperience khi edit
  const [education, setEducation] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);
  // Autocomplete cho trường học
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

  // Khi vào edit, map education/workExperience ra state
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

  // Khi bấm Sửa, copy lại danh sách chứng chỉ từ backend nếu chưa có file
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

  // Education handlers
  const handleEducationChange = (idx, field, value) => {
    setEducation(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };
  const handleAddEducation = () => {
    setEducation(prev => [...prev, { institution: "", degree: "", year: "" }]);
    setSchoolInput(prev => [...prev, ""]);
  };
  const handleRemoveEducation = (idx) => {
    setEducation(prev => prev.filter((_, i) => i !== idx));
    setSchoolInput(prev => prev.filter((_, i) => i !== idx));
  };
  // WorkExperience handlers
  const handleWorkExperienceChange = (idx, field, value) => {
    setWorkExperience(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };
  const handleAddWorkExperience = () => {
    setWorkExperience(prev => [...prev, { workplace: "", position: "", startYear: "", endYear: "" }]);
  };
  const handleRemoveWorkExperience = (idx) => {
    setWorkExperience(prev => prev.filter((_, i) => i !== idx));
  };

  // Khi submit, chuẩn hóa education/workExperience
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
      // Education
      const eduArr = education
        .filter(e => e.institution.trim() !== "" || e.degree.trim() !== "" || e.year)
        .map(e => ({
          institution: e.institution,
          degree: e.degree,
          year: e.year ? Number(e.year) : undefined,
        }));
      data.append('education', JSON.stringify(eduArr));
      // WorkExperience
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

  // Xử lý click vào ảnh chứng chỉ
  const handleImageClick = (url) => {
    setImageUrl(url);
    setShowImage(true);
  };

  // Xử lý zoom in/out bằng nút hoặc wheel
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

  // Thêm ảnh chứng chỉ
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
    <div className="p-6 animate-fade-in max-w-7xl w-full">
      <h2 className="text-2xl mb-8 text-blue-700 font-bold flex items-center gap-2">
        <svg className="w-7 h-7 text-blue-500 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 7v7m0 0H7m5 0h5" /></svg>
        Đơn đăng ký bác sĩ của bạn
      </h2>
      {doctorDetailStatus === 'loading' && <p className="text-lg text-blue-500 animate-pulse">Đang tải dữ liệu...</p>}
      {doctorDetailStatus === 'error' && <p className="text-red-500">{doctorDetailMessage}</p>}
      {doctorDetail && doctorDetail.doctor && !showDetail && (
        <div className="overflow-x-auto animate-fade-in">
          <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-xl">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 to-blue-200">
                <th className="px-4 py-2 border-b-2 border-gray-200 text-gray-700 text-center">Họ tên</th>
                <th className="px-4 py-2 border-b-2 border-gray-200 text-gray-700 text-center">Email</th>
                <th className="px-4 py-2 border-b-2 border-gray-200 text-gray-700 text-center">Chuyên khoa</th>
                <th className="px-4 py-2 border-b-2 border-gray-200 text-gray-700 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className="transition-all duration-200 hover:bg-blue-50 hover:scale-[1.01] cursor-pointer"
                onClick={() => setShowDetail(true)}
              >
                <td className="px-4 py-2 border-b text-center">{doctorDetail.doctor.fullName}</td>
                <td className="px-4 py-2 border-b text-center">{doctorDetail.doctor.email}</td>
                <td className="px-4 py-2 border-b text-center">{doctorDetail.doctor.doctorType}</td>
                <td className={`px-4 py-2 border-b text-center rounded-full text-xs font-semibold ${statusColor[doctorDetail.doctor.status] || 'text-yellow-700 bg-yellow-100'}`}>{
                  doctorDetail.doctor.status === 'accepted' ? 'Đã chấp nhận' : doctorDetail.doctor.status === 'pending' ? 'Đang chờ duyệt' : 'Bị từ chối'
                }</td>
              </tr>
            </tbody>
          </table>
          <div className="text-xs text-gray-500 mt-2">* Bấm vào dòng để xem chi tiết và chỉnh sửa</div>
        </div>
      )}
      {doctorDetail && doctorDetail.doctor && showDetail && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-opacity-30 backdrop-blur-sm">
          <div
            className="bg-white rounded-xl mt-50 p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative scroll-bar-hidden shadow-2xl animate-fade-in"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`
              .scroll-bar-hidden::-webkit-scrollbar { display: none; }
            `}</style>
            <button type="button" className="absolute top-4 right-6 text-gray-400 hover:text-gray-700 text-3xl z-10" onClick={() => setShowDetail(false)}>&times;</button>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex flex-col items-center gap-4 mb-4">
                {doctorDetail.doctor.avatar && (
                  <img src={doctorDetail.doctor.avatar} alt="avatar" className="w-24 h-24 rounded-full shadow border object-cover" />
                )}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[doctorDetail.doctor.status] || 'text-yellow-700 bg-yellow-100'}`}>{
                  doctorDetail.doctor.status === 'accepted' ? 'Đã chấp nhận' : doctorDetail.doctor.status === 'pending' ? 'Đang chờ duyệt' : 'Bị từ chối'
                }</span>
              </div>
              <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow animate-fade-in">
                <tbody>
                  <tr>
                    <td className="font-semibold px-4 py-2 border-b">Tên đăng nhập</td>
                    <td className="px-4 py-2 border-b">
                      <input type="text" name="username" value={formData.username} onChange={handleChange} disabled className="w-full px-2 py-1 border rounded bg-gray-50" />
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold px-4 py-2 border-b">Email</td>
                    <td className="px-4 py-2 border-b">
                      <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing || doctorDetail.doctor.status === 'accepted'} className="w-full px-2 py-1 border rounded bg-gray-50" />
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold px-4 py-2 border-b">Số điện thoại</td>
                    <td className="px-4 py-2 border-b">
                      <input type="text" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing || doctorDetail.doctor.status === 'accepted'} className="w-full px-2 py-1 border rounded bg-gray-50" />
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold px-4 py-2 border-b">Ngày sinh</td>
                    <td className="px-4 py-2 border-b">
                      <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} disabled={!isEditing || doctorDetail.doctor.status === 'accepted'} className="w-full px-2 py-1 border rounded bg-gray-50" />
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold px-4 py-2 border-b">Họ tên</td>
                    <td className="px-4 py-2 border-b">
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} disabled={!isEditing || doctorDetail.doctor.status === 'accepted'} className="w-full px-2 py-1 border rounded bg-gray-50" />
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold px-4 py-2 border-b">Địa chỉ</td>
                    <td className="px-4 py-2 border-b">
                      <input type="text" name="address" value={formData.address} onChange={handleChange} disabled={!isEditing || doctorDetail.doctor.status === 'accepted'} className="w-full px-2 py-1 border rounded bg-gray-50" />
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold px-4 py-2 border-b">Chuyên khoa</td>
                    <td className="px-4 py-2 border-b">
                      <input type="text" name="doctorType" value={formData.doctorType} onChange={handleChange} disabled={!isEditing || doctorDetail.doctor.status === 'accepted'} className="w-full px-2 py-1 border rounded bg-gray-50" />
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold px-4 py-2 border-b">Mô tả</td>
                    <td className="px-4 py-2 border-b">
                      {isEditing ? (
                        <textarea name="description" value={typeof formData.description === 'string' ? formData.description : (formData.description ? JSON.stringify(formData.description) : '')} onChange={handleChange} disabled={doctorDetail.doctor.status === 'accepted'} className="w-full px-2 py-1 border rounded bg-gray-50" />
                      ) : (
                        <span>{typeof doctorDetail.doctor.description === 'string' ? doctorDetail.doctor.description : (doctorDetail.doctor.description ? JSON.stringify(doctorDetail.doctor.description) : <span className="text-gray-400">Chưa cập nhật</span>)}</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold px-4 py-2 border-b align-top">Chứng chỉ</td>
                    <td className="px-4 py-2 border-b">
                      <div className="flex flex-wrap gap-4 items-center">
                        {isEditing
                          ? formData.certifications && formData.certifications.length > 0 && formData.certifications.map((cert, idx) => (
                              <div key={cert._id || idx} className="relative flex flex-col items-center border rounded p-2 bg-gray-50 shadow-sm cursor-pointer hover:scale-105 transition-all group">
                                <img
                                  src={cert.file ? cert.url : cert.url}
                                  alt="cert"
                                  className="w-24 h-16 object-cover rounded mb-1"
                                  onClick={() => handleImageClick(cert.url)}
                                />
                                <input
                                  type="text"
                                  placeholder="Mô tả"
                                  value={cert.description}
                                  onChange={e => handleCertDescriptionChange(idx, e.target.value)}
                                  className="mt-1 w-full px-2 py-1 text-xs border border-gray-300 rounded-lg"
                                />
                                <button
                                  type="button"
                                  className="absolute -top-2 -right-2 text-red-600 bg-white rounded-full shadow"
                                  onClick={() => handleRemoveCertification(idx)}
                                >
                                  <FaTimesCircle size={18} />
                                </button>
                              </div>
                            ))
                          : doctorDetail.doctor.certifications && doctorDetail.doctor.certifications.length > 0 && doctorDetail.doctor.certifications.map((cert, idx) => (
                              <div key={cert._id || idx} className="flex flex-col items-center border rounded p-2 bg-gray-50 shadow-sm cursor-pointer hover:scale-105 transition-all group">
                                <img
                                  src={cert.url}
                                  alt="cert"
                                  className="w-24 h-16 object-cover rounded mb-1"
                                  onClick={() => handleImageClick(cert.url)}
                                />
                                <span className="text-xs text-gray-700 mt-1">{cert.description}</span>
                              </div>
                            ))}
                        {isEditing && (
                          <label
                            className="flex items-center justify-center w-24 h-16 border-2 border-dashed border-gray-300 bg-gray-100 rounded-xl transition cursor-pointer hover:border-blue-400"
                          >
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
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold px-4 py-2 border-b">Học vấn</td>
                    <td className="px-4 py-2 border-b">
                      {isEditing ? (
                        education.map((edu, idx) => (
                          <div key={idx} className="flex items-center gap-2 mb-2">
                            <input
                              type="text"
                              placeholder="Trường học"
                              value={schoolInput[idx]}
                              onChange={e => handleEducationChange(idx, 'institution', e.target.value)}
                              className="w-full px-2 py-1 border rounded bg-gray-50"
                            />
                            <input
                              type="text"
                              placeholder="Bằng cấp"
                              value={edu.degree}
                              onChange={e => handleEducationChange(idx, 'degree', e.target.value)}
                              className="w-full px-2 py-1 border rounded bg-gray-50"
                            />
                            <input
                              type="number"
                              placeholder="Năm"
                              value={edu.year}
                              onChange={e => handleEducationChange(idx, 'year', e.target.value)}
                              className="w-full px-2 py-1 border rounded bg-gray-50"
                            />
                            <button
                              type="button"
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleRemoveEducation(idx)}
                            >
                              <FaTimesCircle size={18} />
                            </button>
                          </div>
                        ))
                      ) : Array.isArray(doctorDetail.doctor.education) ? (
                        doctorDetail.doctor.education.length > 0 ? (
                          <ul className="list-disc pl-4">
                            {doctorDetail.doctor.education.map((edu, idx) => (
                              <li key={edu._id || idx}>
                                <span className="font-semibold">{edu.institution}</span>
                                {edu.degree && <> - {edu.degree}</>}
                                {edu.year && <> ({edu.year})</>}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400">Chưa cập nhật</span>
                        )
                      ) : (
                        <span>{typeof doctorDetail.doctor.education === 'string' ? doctorDetail.doctor.education : <span className="text-gray-400">Chưa cập nhật</span>}</span>
                      )}
                      {isEditing && (
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                          onClick={handleAddEducation}
                        >
                          Thêm học vấn
                        </button>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold px-4 py-2 border-b">Kinh nghiệm làm việc</td>
                    <td className="px-4 py-2 border-b">
                      {isEditing ? (
                        workExperience.map((work, idx) => (
                          <div key={idx} className="flex items-center gap-2 mb-2">
                            <input
                              type="text"
                              placeholder="Nơi làm việc"
                              value={work.workplace}
                              onChange={e => handleWorkExperienceChange(idx, 'workplace', e.target.value)}
                              className="w-full px-2 py-1 border rounded bg-gray-50"
                            />
                            <input
                              type="text"
                              placeholder="Vị trí"
                              value={work.position}
                              onChange={e => handleWorkExperienceChange(idx, 'position', e.target.value)}
                              className="w-full px-2 py-1 border rounded bg-gray-50"
                            />
                            <input
                              type="number"
                              placeholder="Năm bắt đầu"
                              value={work.startYear}
                              onChange={e => handleWorkExperienceChange(idx, 'startYear', e.target.value)}
                              className="w-full px-2 py-1 border rounded bg-gray-50"
                            />
                            <input
                              type="number"
                              placeholder="Năm kết thúc"
                              value={work.endYear}
                              onChange={e => handleWorkExperienceChange(idx, 'endYear', e.target.value)}
                              className="w-full px-2 py-1 border rounded bg-gray-50"
                            />
                            <button
                              type="button"
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleRemoveWorkExperience(idx)}
                            >
                              <FaTimesCircle size={18} />
                            </button>
                          </div>
                        ))
                      ) : Array.isArray(doctorDetail.doctor.workExperience) ? (
                        doctorDetail.doctor.workExperience.length > 0 ? (
                          <ul className="list-disc pl-4">
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
                          <span className="text-gray-400">Chưa cập nhật</span>
                        )
                      ) : (
                        <span>{typeof doctorDetail.doctor.workExperience === 'string' ? doctorDetail.doctor.workExperience : <span className="text-gray-400">Chưa cập nhật</span>}</span>
                      )}
                      {isEditing && (
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                          onClick={handleAddWorkExperience}
                        >
                          Thêm kinh nghiệm
                        </button>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold px-4 py-2 border-b">Công việc gần đây nhất</td>
                    <td className="px-4 py-2 border-b">
                      {isEditing ? (
                        <input
                          type="text"
                          name="recentJob"
                          value={recentJob}
                          onChange={e => setRecentJob(e.target.value)}
                          className="w-full px-2 py-1 border rounded bg-gray-50"
                        />
                      ) : (
                        <span>{typeof doctorDetail.doctor.recentJob === 'string' ? doctorDetail.doctor.recentJob : (doctorDetail.doctor.recentJob ? JSON.stringify(doctorDetail.doctor.recentJob) : <span className="text-gray-400">Chưa cập nhật</span>)}</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold px-4 py-2 border-b">Ngày nộp đơn</td>
                    <td className="px-4 py-2 border-b">{doctorDetail.doctor.submittedAt}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold px-4 py-2 border-b">Ngày cập nhật</td>
                    <td className="px-4 py-2 border-b">{doctorDetail.doctor.updatedAt}</td>
                  </tr>
                  {doctorDetail.doctor.status === 'rejected' && doctorDetail.doctor.rejectionMessage && (
                    <tr>
                      <td className="font-semibold px-4 py-2 border-b text-red-600">Lý do từ chối</td>
                      <td className="px-4 py-2 border-b text-red-600">{doctorDetail.doctor.rejectionMessage}</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {errorSave && <div className="text-red-500 mt-2">{errorSave}</div>}
              {successSave && <div className="text-green-600 mt-2">Cập nhật thành công! Đơn sẽ được duyệt lại.</div>}
              <div className="flex justify-end gap-4 mt-4">
                {doctorDetail.doctor.status !== 'accepted' && !isEditing && (
                  <button type="button" className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-all font-semibold" onClick={handleEdit}>
                    Sửa đơn đăng ký
                  </button>
                )}
                {isEditing && (
                  <button type="submit" className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition-all font-semibold" disabled={loadingSave}>
                    {loadingSave ? <ShortLoading text="Đang lưu" /> : 'Lưu thay đổi'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal xem ảnh chứng chỉ nhỏ nổi trên modal chi tiết */}
      {showImage && (
        <div className="fixed inset-0 z-[1101] flex items-center justify-center pointer-events-none mt-40">
          <div className="relative pointer-events-auto select-none" onWheel={handleWheel}>
            <img
              src={imageUrl}
              alt="cert-full"
              className="max-h-[80vh] max-w-[90vw] rounded-2xl shadow-2xl border-2 border-white object-contain"
              style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s' }}
              draggable={false}
            />
            <button
              className="absolute top-2 right-2 text-white bg-red-500 rounded-full border-2 border-white text-2xl font-bold z-20 transition-all duration-200 hover:bg-red-600 hover:scale-110 hover:rotate-12 shadow-lg w-10 h-10 flex items-center justify-center cursor-pointer"
              onClick={handleCloseImage}
              style={{ outline: 'none' }}
            >
              &times;
            </button>
            <div className="flex justify-center gap-2 mt-2">
              <button type="button" className="bg-gray-200 rounded-full px-3 py-1 text-lg font-bold hover:bg-gray-300" onClick={handleZoomOut} tabIndex={-1}>-</button>
              <button type="button" className="bg-gray-200 rounded-full px-3 py-1 text-lg font-bold hover:bg-gray-300" onClick={handleZoomIn} tabIndex={-1}>+</button>
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
          animation: fade-in 0.7s cubic-bezier(0.4,0,0.2,1) both;
        }
      `}</style>
    </div>
  );
};

export default DoctorRegisterForm;
