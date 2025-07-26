import React, { useState, useEffect } from "react";
import {
  FaUserMd, FaLock, FaEye, FaEyeSlash, FaEnvelope, FaPhone, FaIdBadge, FaBirthdayCake, FaTimesCircle, FaPlus, FaHospital, FaMapMarkerAlt
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { doctorRegisterAcc, setNull } from "../../../redux/APIs/slices/authSlice";
import { CustomToast } from "../../../components/Toast/CustomToast";
import { doctorTypeOptions } from '../../../components/data/DoctorTypeData';
import { doctorJobOptions } from '../../../components/data/DoctorJobData';
import { hospitalSchoolOptions } from '../../../components/data/HospitalSchoolData';
import { hospitalOptions } from '../../../components/data/HospitalData';
import ShortLoading from "../../../components/Loading/ShortLoading";

const DoctorRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, isSuccessReg, message } = useSelector((state) => state.authSlice);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    password: "",
    fullName: "",
    address: "",
    doctorType: "",
    avatar: null,
    description: "",
    recentJob: "",
  });
  const [certificationImages, setCertificationImages] = useState([]); // [{file, description}]
  const [education, setEducation] = useState([{ institution: "", degree: "", year: "" }]);
  const [workExperience, setWorkExperience] = useState([{ workplace: "", position: "", startYear: "", endYear: "" }]);

  // Thêm state cho autocomplete
  const [showDoctorTypeSuggestions, setShowDoctorTypeSuggestions] = useState(false);
  const [customDoctorType, setCustomDoctorType] = useState("");
  const [showRecentJobSuggestions, setShowRecentJobSuggestions] = useState(false);
  const [customRecentJob, setCustomRecentJob] = useState("");
  const [showSchoolSuggestions, setShowSchoolSuggestions] = useState([false]);
  const [schoolInput, setSchoolInput] = useState([""]);
  const [showWorkplaceSuggestions, setShowWorkplaceSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, field) => {
    const files = Array.from(e.target.files);
    if (field === "avatar") {
      setFormData((prev) => ({ ...prev, avatar: files[0] }));
    } else {
      const newCerts = files.map((file) => ({ file, description: "" }));
      setCertificationImages((prev) => [...prev, ...newCerts]);
    }
  };
  const removeImage = (field, index = null) => {
    if (field === "avatar") {
      setFormData((prev) => ({ ...prev, avatar: null }));
    } else {
      setCertificationImages((prev) => prev.filter((_, i) => i !== index));
    }
  };
  const handleCertDescriptionChange = (index, value) => {
    const updated = [...certificationImages];
    updated[index].description = value;
    setCertificationImages(updated);
  };
  // Education
  const handleEducationChange = (idx, field, value) => {
    setEducation(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };
  const handleAddEducation = () => setEducation(prev => [...prev, { institution: "", degree: "", year: "" }]);
  const handleRemoveEducation = (idx) => setEducation(prev => prev.filter((_, i) => i !== idx));
  // WorkExperience
  const handleWorkExpChange = (idx, field, value) => {
    setWorkExperience(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };
  const handleAddWorkExp = () => setWorkExperience(prev => [...prev, { workplace: "", position: "", startYear: "", endYear: "" }]);
  const handleRemoveWorkExp = (idx) => setWorkExperience(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      CustomToast({ message: "Mật khẩu và xác nhận mật khẩu không khớp!", type: "error" });
      return;
    }
    const data = new FormData();
    // Basic fields
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("dateOfBirth", formData.dateOfBirth);
    data.append("password", formData.password);
    data.append("fullName", formData.fullName);
    data.append("address", formData.address);
    data.append("doctorType", formData.doctorType);
    data.append("description", formData.description);
    data.append("recentJob", formData.recentJob);
    // Avatar
    if (formData.avatar) data.append("avatar", formData.avatar);
    // Certifications
    const certDescriptions = certificationImages.map(({ description }) => ({ description }));
    data.append("certifications", JSON.stringify(certDescriptions));
    certificationImages.forEach(({ file }) => data.append("certificationImages", file));
    // Education
    data.append("education", JSON.stringify(education));
    // WorkExperience
    data.append("workExperience", JSON.stringify(workExperience));
    // Không còn workplaceArr
    dispatch(doctorRegisterAcc(data));
  };

  useEffect(() => {
    if (isError) {
      CustomToast({ message: message || "Đăng ký thất bại!", type: "error" });
      setTimeout(() => dispatch(setNull()), 2000);
    }
    if (isSuccessReg) {
      CustomToast({ message: message || "Đăng ký thành công!", type: "success" });
      setFormData({
        username: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        password: "",
        fullName: "",
        address: "",
        doctorType: "",
        avatar: null,
        description: "",
        recentJob: "",
      });
      setCertificationImages([]);
      setEducation([{ institution: "", degree: "", year: "" }]);
      setWorkExperience([{ workplace: "", position: "", startYear: "", endYear: "" }]);
      setConfirmPassword("");
      setTimeout(() => {
        dispatch(setNull());
        navigate("/login/doctor");
      }, 1000);
    }
  }, [isSuccessReg, isError, message, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-2 md:p-4">
      <form onSubmit={handleSubmit} className="bg-white p-4 md:p-8 rounded-2xl shadow-lg w-full max-w-full md:max-w-2xl space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-700 mb-4">Đăng ký Bác sĩ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <InputField icon={<FaUserMd />} name="username" placeholder="Tên đăng nhập" value={formData.username} onChange={handleInputChange} />
          <InputField icon={<FaIdBadge />} name="fullName" placeholder="Họ và tên" value={formData.fullName} onChange={handleInputChange} />
          <InputField icon={<FaEnvelope />} name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
          <InputField icon={<FaPhone />} name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleInputChange} />
          <InputField type="date" icon={<FaBirthdayCake />} name="dateOfBirth" placeholder="Ngày sinh" value={formData.dateOfBirth} onChange={handleInputChange} />
          <InputField icon={<FaMapMarkerAlt />} name="address" placeholder="Địa chỉ" value={formData.address} onChange={handleInputChange} />
          {/* DoctorType autocomplete */}
          <div className="flex items-center relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FaHospital />
            </span>
            <input
              type="text"
              name="doctorType"
              placeholder="Chuyên khoa"
              value={typeof formData.doctorType === 'string' ? formData.doctorType : (Array.isArray(formData.doctorType) ? formData.doctorType[0] : '')}
              onChange={e => {
                handleInputChange({ target: { name: 'doctorType', value: e.target.value } });
                setShowDoctorTypeSuggestions(true);
              }}
              onFocus={() => setShowDoctorTypeSuggestions(true)}
              onBlur={() => setTimeout(() => setShowDoctorTypeSuggestions(false), 150)}
              className="w-full pl-10 py-2 rounded-xl border border-gray-300 focus:outline-none bg-white focus:ring-2 focus:ring-blue-400"
              autoComplete="off"
              required
            />
            {showDoctorTypeSuggestions && (
              <ul className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-y-auto z-20">
                {doctorTypeOptions.filter(t => t.name.toLowerCase().includes((formData.doctorType || '').toLowerCase())).map(t => (
                  <li
                    key={t.id}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-gray-700"
                    onMouseDown={() => {
                      handleInputChange({ target: { name: 'doctorType', value: t.name } });
                      setShowDoctorTypeSuggestions(false);
                    }}
                  >
                    {t.name}
                  </li>
                ))}
              </ul>
            )}
            {formData.doctorType === 'Khác' && (
              <input
                type="text"
                placeholder="Nhập chuyên khoa khác"
                value={customDoctorType}
                onChange={e => setCustomDoctorType(e.target.value)}
                className="w-full mt-2 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none bg-white focus:ring-2 focus:ring-blue-400"
              />
            )}
          </div>
          {/* RecentJob autocomplete */}
          <div className="flex items-center relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FaIdBadge />
            </span>
            <input
              type="text"
              name="recentJob"
              placeholder="Nơi làm việc hiện tại"
              value={formData.recentJob}
              onChange={e => {
                handleInputChange({ target: { name: 'recentJob', value: e.target.value } });
                setShowRecentJobSuggestions(true);
              }}
              onFocus={() => setShowRecentJobSuggestions(true)}
              onBlur={() => setTimeout(() => setShowRecentJobSuggestions(false), 150)}
              className="w-full pl-10 py-2 rounded-xl border border-gray-300 focus:outline-none bg-white focus:ring-2 focus:ring-blue-400"
              autoComplete="off"
              required
            />
            {showRecentJobSuggestions && (
              <ul className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-y-auto z-20">
                {doctorJobOptions.filter(j => j.name.toLowerCase().includes((formData.recentJob || '').toLowerCase())).map(j => (
                  <li
                    key={j.id}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-gray-700"
                    onMouseDown={() => {
                      handleInputChange({ target: { name: 'recentJob', value: j.name } });
                      setShowRecentJobSuggestions(false);
                    }}
                  >
                    {j.name}
                  </li>
                ))}
              </ul>
            )}
            {formData.recentJob === 'Khác' && (
              <input
                type="text"
                placeholder="Nhập nơi làm việc hiện tại khác"
                value={customRecentJob}
                onChange={e => setCustomRecentJob(e.target.value)}
                className="w-full mt-2 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none bg-white focus:ring-2 focus:ring-blue-400"
              />
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="flex items-center relative">
            <span className="absolute left-3 text-gray-400"><FaLock /></span>
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Mật khẩu" value={formData.password} onChange={handleInputChange} className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
            <span className="absolute right-3 text-gray-400 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
          </div>
          <div className="flex items-center relative">
            <span className="absolute left-3 text-gray-400"><FaLock /></span>
            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Xác nhận mật khẩu" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
            <span className="absolute right-3 text-gray-400 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</span>
          </div>
        </div>
        {/* Avatar Upload */}
        <div className="w-full flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <ImageUpload label="Ảnh đại diện" file={formData.avatar} onChange={e => handleImageChange(e, "avatar")} onRemove={() => removeImage("avatar")} />
          </div>
        </div>
        {/* Certification Upload with description */}
        <div>
          <label className="block mb-1 text-gray-600 font-medium">Ảnh chứng chỉ hành nghề (kèm mô tả)</label>
          <div className="flex flex-wrap gap-4">
            {certificationImages.map(({ file, description }, index) => (
              <div key={index} className="relative w-28">
                <img src={URL.createObjectURL(file)} alt={`cert-${index}`} className="w-28 h-28 object-cover rounded-xl" />
                <button type="button" className="absolute -top-2 -right-2 text-red-600 bg-white rounded-full shadow" onClick={() => removeImage("certificationImages", index)}><FaTimesCircle size={18} /></button>
                <input type="text" placeholder="Mô tả" value={description} onChange={e => handleCertDescriptionChange(index, e.target.value)} className="mt-1 w-full px-2 py-1 text-sm border border-gray-300 rounded-lg" />
              </div>
            ))}
            <label className="flex items-center justify-center w-28 h-28 border-2 border-dashed border-gray-300 bg-gray-100 rounded-xl cursor-pointer hover:border-blue-400">
              <FaPlus size={20} className="text-gray-500" />
              <input type="file" accept="image/*" multiple onChange={e => handleImageChange(e, "certificationImages")} className="hidden" />
            </label>
          </div>
        </div>
        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-600 font-medium mb-1 flex items-center"><FaIdBadge className="mr-2 text-gray-400" />Mô tả về bản thân, kinh nghiệm</label>
          <textarea name="description" placeholder="Mô tả về bản thân, kinh nghiệm, ..." value={formData.description || ''} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none bg-white min-h-[60px] resize-y focus:ring-2 focus:ring-blue-400" />
        </div>
        {/* Education */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-600 font-medium mb-1 flex items-center"><FaIdBadge className="mr-2 text-gray-400" />Học vấn (nhiều dòng)</label>
          {education.map((edu, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-1 items-center relative">
              <div className="relative">
                <input
                  type="text"
                  value={schoolInput[idx]}
                  onChange={e => {
                    setSchoolInput(prev => prev.map((item, i) => (i === idx ? e.target.value : item)));
                    setEducation(prev => prev.map((item, i) => i === idx ? { ...item, institution: e.target.value } : item));
                    setShowSchoolSuggestions(prev => prev.map((show, i) => (i === idx ? true : show)));
                  }}
                  onFocus={() => setShowSchoolSuggestions(prev => prev.map((show, i) => (i === idx ? true : show)))}
                  onBlur={() => setTimeout(() => setShowSchoolSuggestions(prev => prev.map((show, i) => (i === idx ? false : show))), 150)}
                  placeholder="Nhập hoặc chọn trường/đơn vị đào tạo"
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none bg-white focus:ring-2 focus:ring-blue-400"
                />
                {showSchoolSuggestions[idx] && (
                  <ul className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-y-auto z-20">
                    {hospitalSchoolOptions.filter(s => s.name.toLowerCase().includes((schoolInput[idx] || '').toLowerCase())).map(s => (
                      <li
                        key={s.id}
                        className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-gray-700"
                        onMouseDown={() => {
                          setSchoolInput(prev => prev.map((item, i) => (i === idx ? s.name : item)));
                          setEducation(prev => prev.map((item, i) => i === idx ? { ...item, institution: s.name } : item));
                          setShowSchoolSuggestions(prev => prev.map((show, i) => (i === idx ? false : show)));
                        }}
                      >
                        {s.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <input type="text" value={edu.degree} onChange={e => handleEducationChange(idx, "degree", e.target.value)} placeholder="Bằng cấp" className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input type="number" min="1900" max={new Date().getFullYear()} value={edu.year} onChange={e => handleEducationChange(idx, "year", e.target.value)} placeholder="Năm tốt nghiệp" className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              {education.length > 1 && (<button type="button" className="ml-2 w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-full shadow text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 hover:scale-110 cursor-pointer" onClick={() => handleRemoveEducation(idx)}><span className="text-lg font-bold">×</span></button>)}
            </div>
          ))}
          <button type="button" className="text-blue-600 font-semibold mt-1" onClick={handleAddEducation}>+ Thêm học vấn</button>
        </div>
        {/* WorkExperience */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-600 font-medium mb-1 flex items-center"><FaIdBadge className="mr-2 text-gray-400" />Kinh nghiệm làm việc (nhiều dòng)</label>
          {workExperience.map((exp, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-1 items-center relative">
              <div className="relative">
                <input
                  type="text"
                  value={exp.workplace}
                  onChange={e => {
                    handleWorkExpChange(idx, "workplace", e.target.value);
                    setShowWorkplaceSuggestions(prev => {
                      const arr = [...prev];
                      arr[idx] = true;
                      return arr;
                    });
                  }}
                  onFocus={() => setShowWorkplaceSuggestions(prev => {
                    const arr = [...prev];
                    arr[idx] = true;
                    return arr;
                  })}
                  onBlur={() => setTimeout(() => setShowWorkplaceSuggestions(prev => {
                    const arr = [...prev];
                    arr[idx] = false;
                    return arr;
                  }), 150)}
                  placeholder="Nơi làm việc"
                  className="w-full min-w-0 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none bg-white focus:ring-2 focus:ring-blue-400"
                  autoComplete="off"
                />
                {showWorkplaceSuggestions[idx] && (
                  <ul className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-y-auto z-20">
                    {hospitalOptions.filter(h => h.name.toLowerCase().includes((exp.workplace || '').toLowerCase())).map(h => (
                      <li
                        key={h.id}
                        className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-gray-700"
                        onMouseDown={() => {
                          handleWorkExpChange(idx, "workplace", h.name);
                          setShowWorkplaceSuggestions(prev => {
                            const arr = [...prev];
                            arr[idx] = false;
                            return arr;
                          });
                        }}
                      >
                        {h.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <input type="text" value={exp.position} onChange={e => handleWorkExpChange(idx, "position", e.target.value)} placeholder="Vị trí" className="w-full min-w-0 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none bg-white focus:ring-2 focus:ring-blue-400" />
              <input type="number" min="1900" max={new Date().getFullYear()} value={exp.startYear} onChange={e => handleWorkExpChange(idx, "startYear", e.target.value)} placeholder="Năm bắt đầu" className="w-full min-w-0 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none bg-white focus:ring-2 focus:ring-blue-400" />
              <input type="number" min="1900" max={new Date().getFullYear()} value={exp.endYear} onChange={e => handleWorkExpChange(idx, "endYear", e.target.value)} placeholder="Năm kết thúc (có thể bỏ trống)" className="w-full min-w-0 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none bg-white focus:ring-2 focus:ring-blue-400" />
              {workExperience.length > 1 && (<button type="button" className="ml-2 w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-full shadow text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 hover:scale-110 cursor-pointer" onClick={() => handleRemoveWorkExp(idx)}><span className="text-lg font-bold">×</span></button>)}
            </div>
          ))}
          <button type="button" className="text-blue-600 font-semibold mt-1" onClick={handleAddWorkExp}>+ Thêm kinh nghiệm</button>
        </div>
        <button type="submit" className="w-full py-2 rounded-xl font-semibold shadow-md bg-blue-600 text-white hover:bg-blue-700 transition text-base md:text-lg" disabled={isLoading}>
          {isLoading ? <ShortLoading text={"Đang đăng ký..."} /> : "Đăng ký"}
        </button>
      </form>
    </div>
  );
};

const InputField = ({ icon, name, placeholder, value, onChange, type = "text" }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-10 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
      required
    />
  </div>
);

const ImageUpload = ({ label, file, onChange, onRemove }) => (
  <div>
    <label className="block mb-1 text-gray-600 font-medium">{label}</label>
    {file ? (
      <div className="relative w-32 h-32">
        <img src={URL.createObjectURL(file)} alt="avatar" className="w-full h-full object-cover rounded-xl" />
        <button type="button" className="absolute -top-2 -right-2 text-red-600 bg-white rounded-full shadow" onClick={onRemove}><FaTimesCircle size={20} /></button>
      </div>
    ) : (
      <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 bg-gray-100 rounded-xl cursor-pointer hover:border-blue-400">
        <FaPlus size={30} className="text-gray-500" />
        <input type="file" accept="image/*" onChange={onChange} className="hidden" />
      </label>
    )}
  </div>
);

export default DoctorRegister;