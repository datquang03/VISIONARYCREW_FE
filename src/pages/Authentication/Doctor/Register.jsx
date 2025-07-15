import React, { useEffect, useState } from "react";
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
import CustomButton from "../../../components/buttons/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { doctorRegisterAcc, setNull } from "../../../redux/APIs/slices/authSlice";
import { CustomToast } from "../../../components/Toast/CustomToast";

const doctorTypeOptions = [
  { label: "Bác sĩ đa khoa", value: "general" },
  { label: "Bác sĩ tim mạch", value: "cardiologist" },
  { label: "Bác sĩ da liễu", value: "dermatologist" },
  { label: "Bác sĩ nhi", value: "pediatrician" },
  { label: "Khác", value: "other" },
];

const DoctorRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, isError, isSuccessReg, message } = useSelector(
    (state) => state.authSlice
  );
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
    if (isLoading) return;
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
    if (isLoading) return;
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
    if (isLoading) return;
    const updated = [...formData.certificationImages];
    updated[index].description = value;
    setFormData((prev) => ({ ...prev, certificationImages: updated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
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
    dispatch(doctorRegisterAcc(data));
  };

  useEffect(() => {
    if (isError) {
      CustomToast({ message, type: "error" });
      setTimeout(() => dispatch(setNull()), 3000);
    }
    if (isSuccessReg) {
      CustomToast({ message, type: "success" });
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
        certificationImages: [],
      });
      setTimeout(() => {
        dispatch(setNull());
        navigate("/doctors/login");
      }, 1000);
    }
  }, [isSuccessReg, isError, dispatch, navigate]);

  useEffect(() => {
    return () => {
      dispatch(setNull());
    };
  }, [dispatch]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4 space-y-4">
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
            <InputField
              icon={<FaUserMd />}
              name="username"
              placeholder="Tên đăng nhập"
              value={formData.username}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <InputField
              icon={<FaIdBadge />}
              name="fullName"
              placeholder="Họ và tên"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <InputField
              icon={<FaEnvelope />}
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <InputField
              icon={<FaPhone />}
              name="phone"
              placeholder="Số điện thoại"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <InputField
              type="date"
              icon={<FaBirthdayCake />}
              name="dateOfBirth"
              placeholder="Ngày sinh"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <InputField
              icon={<FaMapMarkerAlt />}
              name="address"
              placeholder="Địa chỉ"
              value={formData.address}
              onChange={handleInputChange}
              disabled={isLoading}
            />

            {/* Doctor Type Select */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FaHospital />
              </span>
              <select
                name="doctorType"
                value={formData.doctorType}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full pl-10 py-2 rounded-xl border border-gray-300 focus:outline-none bg-white ${
                  isLoading ? "bg-gray-100 cursor-not-allowed" : "focus:ring-2 focus:ring-blue-400"
                }`}
                required
              >
                <option value="">Chọn chuyên khoa</option>
                {doctorTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-400">
                <FaLock />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full pl-10 pr-10 py-2 rounded-xl border border-gray-300 focus:outline-none ${
                  isLoading ? "bg-gray-100 cursor-not-allowed" : "focus:ring-2 focus:ring-blue-400"
                }`}
                required
              />
              <span
                className="absolute right-3 text-gray-400 cursor-pointer"
                onClick={() => !isLoading && setShowPassword(!showPassword)}
              >
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
            disabled={isLoading}
          />

          {/* Certification Upload with description */}
          <div>
            <label className="block mb-1 text-gray-600 font-medium">
              Ảnh chứng chỉ hành nghề (kèm mô tả)
            </label>
            <div className="flex flex-wrap gap-4">
              {formData.certificationImages.map(({ file, description }, index) => (
                <div key={index} className="relative w-28">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`cert-${index}`}
                    className="w-28 h-28 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 text-red-600 bg-white rounded-full shadow"
                    onClick={() => removeImage("certificationImages", index)}
                    disabled={isLoading}
                  >
                    <FaTimesCircle size={18} />
                  </button>
                  <input
                    type="text"
                    placeholder="Mô tả"
                    value={description}
                    onChange={(e) => handleCertDescriptionChange(index, e.target.value)}
                    disabled={isLoading}
                    className={`mt-1 w-full px-2 py-1 text-sm border border-gray-300 rounded-lg ${
                      isLoading ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
              ))}
              <label
                className={`flex items-center justify-center w-28 h-28 border-2 border-dashed border-gray-300 bg-gray-100 rounded-xl transition ${
                  isLoading ? "cursor-not-allowed" : "cursor-pointer hover:border-blue-400"
                }`}
              >
                <FaPlus size={20} className="text-gray-500" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageChange(e, "certificationImages")}
                  className="hidden"
                  disabled={isLoading}
                />
              </label>
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            whileHover={{ scale: isLoading ? 1 : 1.05 }}
            whileTap={{ scale: isLoading ? 1 : 0.95 }}
            disabled={isLoading}
            className={`w-full py-2 rounded-xl font-semibold shadow-md transition flex items-center justify-center ${
              isLoading
                ? "bg-blue-300 text-gray-100 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </>
            ) : (
              "Đăng ký"
            )}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};

const InputField = ({ icon, name, placeholder, value, onChange, type = "text", disabled }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full pl-10 py-2 rounded-xl border border-gray-300 focus:outline-none ${
        disabled ? "bg-gray-100 cursor-not-allowed" : "focus:ring-2 focus:ring-blue-400"
      }`}
      required
    />
  </div>
);

const ImageUpload = ({ label, file, onChange, onRemove, disabled }) => (
  <div>
    <label className="block mb-1 text-gray-600 font-medium">{label}</label>
    {file ? (
      <div className="relative w-32 h-32">
        <img src={URL.createObjectURL(file)} alt="avatar" className="w-full h-full object-cover rounded-xl" />
        <button
          type="button"
          className="absolute -top-2 -right-2 text-red-600 bg-white rounded-full shadow"
          onClick={onRemove}
          disabled={disabled}
        >
          <FaTimesCircle size={20} />
        </button>
      </div>
    ) : (
      <label
        className={`flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 bg-gray-100 rounded-xl transition ${
          disabled ? "cursor-not-allowed" : "cursor-pointer hover:border-blue-400"
        }`}
      >
        <FaPlus size={30} className="text-gray-500" />
        <input
          type="file"
          accept="image/*"
          onChange={onChange}
          className="hidden"
          disabled={disabled}
        />
      </label>
    )}
  </div>
);

export default DoctorRegister;