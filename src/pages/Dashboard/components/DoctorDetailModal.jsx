import React, { useState } from 'react';
import { FaPlus, FaTimesCircle } from 'react-icons/fa';
import ShortLoading from '../../../components/Loading/ShortLoading';

const statusColor = {
  pending: 'text-yellow-700 bg-yellow-100',
  accepted: 'text-green-600 bg-green-100',
  rejected: 'text-red-600 bg-red-100',
};

const DoctorDetailModal = ({ 
  doctorDetail, 
  isOpen, 
  onClose, 
  isEditing, 
  setIsEditing, 
  formData, 
  setFormData, 
  education, 
  setEducation, 
  workExperience, 
  setWorkExperience, 
  schoolInput, 
  setSchoolInput, 
  workplaceInput, 
  setWorkplaceInput, 
  recentJob, 
  setRecentJob, 
  loadingSave, 
  errorSave, 
  successSave, 
  onSave, 
  onEdit,
  showImage,
  setShowImage,
  imageUrl,
  setImageUrl,
  zoom,
  setZoom,
  handleImageClick,
  handleWheel,
  handleZoomIn,
  handleZoomOut,
  handleCloseImage,
  handleAddCertification,
  handleRemoveCertification,
  handleCertDescriptionChange,
  handleEducationChange,
  handleAddEducation,
  handleRemoveEducation,
  handleWorkExperienceChange,
  handleAddWorkExperience,
  handleRemoveWorkExperience
}) => {
  if (!isOpen || !doctorDetail?.doctor) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
          <button
            type="button"
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            ×
          </button>
          
          <form onSubmit={onSave} className="space-y-6">
            <div className="flex flex-col items-center gap-4 mb-6">
              {doctorDetail.doctor.avatar && (
                <img
                  src={doctorDetail.doctor.avatar}
                  alt="avatar"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-lg border-2 border-gray-200 object-cover"
                />
              )}
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColor[doctorDetail.doctor.status] || 'text-yellow-700 bg-yellow-100'}`}>
                {doctorDetail.doctor.status === 'accepted' ? 'Đã chấp nhận' : doctorDetail.doctor.status === 'pending' ? 'Đang chờ duyệt' : 'Bị từ chối'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tên đăng nhập</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                  disabled={!isEditing || doctorDetail.doctor.status === 'accepted'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 focus:outline-none disabled:opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                  disabled={!isEditing || doctorDetail.doctor.status === 'accepted'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 focus:outline-none disabled:opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày sinh</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                  disabled={!isEditing || doctorDetail.doctor.status === 'accepted'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 focus:outline-none disabled:opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Họ tên</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                  disabled={!isEditing || doctorDetail.doctor.status === 'accepted'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 focus:outline-none disabled:opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                  disabled={!isEditing || doctorDetail.doctor.status === 'accepted'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 focus:outline-none disabled:opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Chuyên khoa</label>
                <input
                  type="text"
                  name="doctorType"
                  value={formData.doctorType}
                  onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                  disabled={!isEditing || doctorDetail.doctor.status === 'accepted'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả</label>
              {isEditing ? (
                <textarea
                  name="description"
                  value={typeof formData.description === 'string' ? formData.description : (formData.description ? JSON.stringify(formData.description) : '')}
                  onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                  disabled={doctorDetail.doctor.status === 'accepted'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 focus:outline-none resize-y min-h-[100px] disabled:opacity-50"
                  rows={4}
                />
              ) : (
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 min-h-[100px]">
                  {typeof doctorDetail.doctor.description === 'string' ? doctorDetail.doctor.description : (doctorDetail.doctor.description ? JSON.stringify(doctorDetail.doctor.description) : <span className="text-gray-400">Chưa cập nhật</span>)}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Chứng chỉ</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {isEditing
                  ? formData.certifications && formData.certifications.length > 0 && formData.certifications.map((cert, idx) => (
                      <div key={cert._id || idx} className="relative border border-gray-200 rounded-lg p-3 bg-gray-50 hover:shadow-md transition-shadow">
                        <img
                          src={cert.file ? cert.url : cert.url}
                          alt="cert"
                          className="w-full h-24 object-cover rounded mb-2 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => handleImageClick(cert.url)}
                        />
                        <input
                          type="text"
                          placeholder="Mô tả"
                          value={cert.description}
                          onChange={e => handleCertDescriptionChange(idx, e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 text-red-600 bg-white rounded-full shadow-lg p-1 hover:bg-red-50 transition-colors"
                          onClick={() => handleRemoveCertification(idx)}
                        >
                          <FaTimesCircle size={16} />
                        </button>
                      </div>
                    ))
                  : doctorDetail.doctor.certifications && doctorDetail.doctor.certifications.length > 0 && doctorDetail.doctor.certifications.map((cert, idx) => (
                      <div key={cert._id || idx} className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:shadow-md transition-shadow cursor-pointer">
                        <img
                          src={cert.url}
                          alt="cert"
                          className="w-full h-24 object-cover rounded mb-2 hover:opacity-80 transition-opacity"
                          onClick={() => handleImageClick(cert.url)}
                        />
                        <p className="text-xs text-gray-700 text-center">{cert.description}</p>
                      </div>
                    ))}
                {isEditing && (
                  <label className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                    <div className="text-center">
                      <FaPlus size={24} className="text-gray-400 mx-auto mb-2" />
                      <span className="text-xs text-gray-500">Thêm ảnh</span>
                    </div>
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
              <label className="block text-sm font-semibold text-gray-700 mb-3">Học vấn</label>
              {isEditing ? (
                <div className="space-y-3">
                  {education.map((edu, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <input
                        type="text"
                        placeholder="Trường học"
                        value={schoolInput[idx]}
                        onChange={e => handleEducationChange(idx, 'institution', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Bằng cấp"
                        value={edu.degree}
                        onChange={e => handleEducationChange(idx, 'degree', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Năm"
                        value={edu.year}
                        onChange={e => handleEducationChange(idx, 'year', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800 flex items-center justify-center p-2 rounded-lg hover:bg-red-50 transition-colors"
                        onClick={() => handleRemoveEducation(idx)}
                      >
                        <FaTimesCircle size={18} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                    onClick={handleAddEducation}
                  >
                    + Thêm học vấn
                  </button>
                </div>
              ) : Array.isArray(doctorDetail.doctor.education) ? (
                doctorDetail.doctor.education.length > 0 ? (
                  <div className="space-y-2">
                    {doctorDetail.doctor.education.map((edu, idx) => (
                      <div key={edu._id || idx} className="p-3 bg-gray-50 rounded-lg">
                        <span className="font-semibold text-gray-800">{edu.institution}</span>
                        {edu.degree && <span className="text-gray-600"> - {edu.degree}</span>}
                        {edu.year && <span className="text-gray-500"> ({edu.year})</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">Chưa cập nhật</p>
                )
              ) : (
                <p className="text-sm">{typeof doctorDetail.doctor.education === 'string' ? doctorDetail.doctor.education : <span className="text-gray-400">Chưa cập nhật</span>}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Kinh nghiệm làm việc</label>
              {isEditing ? (
                <div className="space-y-3">
                  {workExperience.map((work, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                      <input
                        type="text"
                        placeholder="Nơi làm việc"
                        value={work.workplace}
                        onChange={e => handleWorkExperienceChange(idx, 'workplace', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Vị trí"
                        value={work.position}
                        onChange={e => handleWorkExperienceChange(idx, 'position', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Năm bắt đầu"
                        value={work.startYear}
                        onChange={e => handleWorkExperienceChange(idx, 'startYear', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Năm kết thúc"
                        value={work.endYear}
                        onChange={e => handleWorkExperienceChange(idx, 'endYear', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800 flex items-center justify-center p-2 rounded-lg hover:bg-red-50 transition-colors"
                        onClick={() => handleRemoveWorkExperience(idx)}
                      >
                        <FaTimesCircle size={18} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                    onClick={handleAddWorkExperience}
                  >
                    + Thêm kinh nghiệm
                  </button>
                </div>
              ) : Array.isArray(doctorDetail.doctor.workExperience) ? (
                doctorDetail.doctor.workExperience.length > 0 ? (
                  <div className="space-y-2">
                    {doctorDetail.doctor.workExperience.map((work, idx) => (
                      <div key={work._id || idx} className="p-3 bg-gray-50 rounded-lg">
                        <span className="font-semibold text-gray-800">{work.workplace}</span>
                        {work.position && <span className="text-gray-600"> - {work.position}</span>}
                        {(work.startYear || work.endYear) && (
                          <span className="text-gray-500"> ({work.startYear}{work.endYear ? ` - ${work.endYear}` : ""})</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">Chưa cập nhật</p>
                )
              ) : (
                <p className="text-sm">{typeof doctorDetail.doctor.workExperience === 'string' ? doctorDetail.doctor.workExperience : <span className="text-gray-400">Chưa cập nhật</span>}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Công việc gần đây nhất</label>
              {isEditing ? (
                <input
                  type="text"
                  name="recentJob"
                  value={recentJob}
                  onChange={e => setRecentJob(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              ) : (
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600">
                  {typeof doctorDetail.doctor.recentJob === 'string' ? doctorDetail.doctor.recentJob : (doctorDetail.doctor.recentJob ? JSON.stringify(doctorDetail.doctor.recentJob) : <span className="text-gray-400">Chưa cập nhật</span>)}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày nộp đơn</label>
                <p className="text-sm text-gray-700 px-4 py-3 bg-gray-50 rounded-lg">{doctorDetail.doctor.submittedAt}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày cập nhật</label>
                <p className="text-sm text-gray-700 px-4 py-3 bg-gray-50 rounded-lg">{doctorDetail.doctor.updatedAt}</p>
              </div>
            </div>
            
            {doctorDetail.doctor.status === 'rejected' && doctorDetail.doctor.rejectionMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <label className="block text-sm font-semibold text-red-600 mb-2">Lý do từ chối</label>
                <p className="text-sm text-red-600">{doctorDetail.doctor.rejectionMessage}</p>
              </div>
            )}
            
            {errorSave && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{errorSave}</p>
              </div>
            )}
            
            {successSave && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-600 text-sm">Cập nhật thành công! Đơn sẽ được duyệt lại.</p>
              </div>
            )}
            
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
              {doctorDetail.doctor.status !== 'accepted' && !isEditing && (
                <button
                  type="button"
                  className="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors font-semibold"
                  onClick={onEdit}
                >
                  Sửa đơn đăng ký
                </button>
              )}
              {isEditing && (
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loadingSave}
                >
                  {loadingSave ? <ShortLoading text="Đang lưu" /> : 'Lưu thay đổi'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      
      {showImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative bg-white rounded-lg p-6 max-w-[90vw] max-h-[90vh] overflow-hidden">
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
              ×
            </button>
            <div className="flex justify-center gap-2 mt-4">
              <button
                type="button"
                className="bg-gray-200 rounded-full px-3 py-1 text-lg font-bold hover:bg-gray-300 transition-colors"
                onClick={handleZoomOut}
              >
                -
              </button>
              <button
                type="button"
                className="bg-gray-200 rounded-full px-3 py-1 text-lg font-bold hover:bg-gray-300 transition-colors"
                onClick={handleZoomIn}
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorDetailModal; 