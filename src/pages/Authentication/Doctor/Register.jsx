import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUserMd,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaPhone,
  FaIdBadge,
  FaBirthdayCake,
  FaTimesCircle,
  FaPlus,
  FaHospital,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../components/buttons/CustomButton"; // ✅ IMPORT CustomButton

const doctorTypeOptions = [
  { label: "Bác sĩ đa khoa", value: "general" },
  { label: "Bác sĩ tim mạch", value: "cardiologist" },
  { label: "Bác sĩ da liễu", value: "dermatologist" },
  { label: "Bác sĩ nhi", value: "pediatrician" },
  { label: "Khác", value: "other" },
];

const DoctorRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
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
    certificationImages: [],
  });

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
      setFormData((prev) => ({
        ...prev,
        certificationImages: [...prev.certificationImages, ...newCerts],
      }));
    }
  };

  const removeImage = (field, index = null) => {
    if (field === "avatar") {
      setFormData((prev) => ({ ...prev, avatar: null }));
    } else {
      setFormData((prev) => ({
        ...prev,
        certificationImages: prev.certificationImages.filter((_, i) => i !== index),
      }));
    }
  };

  const handleCertDescriptionChange = (index, value) => {
    const updated = [...formData.certificationImages];
    updated[index].description = value;
    setFormData((prev) => ({ ...prev, certificationImages: updated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "certificationImages") {
        const certDescriptions = value.map(({ description }) => ({ description }));
        data.append("certifications", JSON.stringify(certDescriptions));
        value.forEach(({ file }) => data.append("certificationImages", file));
      } else if (key === "avatar" && value) {
        data.append("avatar", value);
      } else {
        data.append(key, value);
      }
    });

    console.log("FormData đã sẵn sàng gửi lên server!");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4 space-y-4">
      {/* ✅ Nút trở về top-left */}
      <CustomButton text="Trở về" to="/login" position="top-left" />
      <div className="flex flex-col justify-center items-center">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl space-y-6 overflow-y-auto custom-scroll"
      >
        <h2 className="text-3xl font-bold text-center text-blue-700">Đăng ký Bác sĩ</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField icon={<FaUserMd />} name="username" placeholder="Tên đăng nhập" value={formData.username} onChange={handleInputChange} />
          <InputField icon={<FaIdBadge />} name="fullName" placeholder="Họ và tên" value={formData.fullName} onChange={handleInputChange} />
          <InputField icon={<FaEnvelope />} name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
          <InputField icon={<FaPhone />} name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleInputChange} />
          <InputField type="date" icon={<FaBirthdayCake />} name="dateOfBirth" placeholder="Ngày sinh" value={formData.dateOfBirth} onChange={handleInputChange} />
          <InputField icon={<FaMapMarkerAlt />} name="address" placeholder="Địa chỉ" value={formData.address} onChange={handleInputChange} />

          {/* Doctor Type Select */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaHospital /></span>
            <select
              name="doctorType"
              value={formData.doctorType}
              onChange={handleInputChange}
              className="w-full pl-10 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              required
            >
              <option value="">Chọn chuyên khoa</option>
              {doctorTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div className="relative flex items-center">
            <span className="absolute left-3 text-gray-400"><FaLock /></span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <span className="absolute right-3 text-gray-400 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        {/* Avatar Upload */}
        <ImageUpload
          label="Ảnh đại diện"
          file={formData.avatar}
          onChange={(e) => handleImageChange(e, "avatar")}
          onRemove={() => removeImage("avatar")}
        />

        {/* Certification Upload with description */}
        <div>
          <label className="block mb-1 text-gray-600 font-medium">Ảnh chứng chỉ hành nghề (kèm mô tả)</label>
          <div className="flex flex-wrap gap-4">
            {formData.certificationImages.map(({ file, description }, index) => (
              <div key={index} className="relative w-28">
                <img src={URL.createObjectURL(file)} alt={`cert-${index}`} className="w-28 h-28 object-cover rounded-xl" />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 text-red-600 bg-white rounded-full shadow"
                  onClick={() => removeImage("certificationImages", index)}
                >
                  <FaTimesCircle size={18} />
                </button>
                <input
                  type="text"
                  placeholder="Mô tả"
                  value={description}
                  onChange={(e) => handleCertDescriptionChange(index, e.target.value)}
                  className="mt-1 w-full px-2 py-1 text-sm border border-gray-300 rounded-lg"
                />
              </div>
            ))}
            <label className="flex items-center justify-center w-28 h-28 border-2 border-dashed border-gray-300 bg-gray-100 rounded-xl cursor-pointer hover:border-blue-400 transition">
              <FaPlus size={20} className="text-gray-500" />
              <input type="file" accept="image/*" multiple onChange={(e) => handleImageChange(e, "certificationImages")} className="hidden" />
            </label>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-lg font-semibold"
        >
          Đăng ký
        </button>
      </motion.form>
    </div>
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
        <button type="button" className="absolute -top-2 -right-2 text-red-600 bg-white rounded-full shadow" onClick={onRemove}>
          <FaTimesCircle size={20} />
        </button>
      </div>
    ) : (
      <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 bg-gray-100 rounded-xl cursor-pointer hover:border-blue-400 transition">
        <FaPlus size={30} className="text-gray-500" />
        <input type="file" accept="image/*" onChange={onChange} className="hidden" />
      </label>
    )}
  </div>
);

export default DoctorRegister;
