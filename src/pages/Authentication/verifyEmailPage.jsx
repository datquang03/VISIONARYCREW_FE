import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope } from "react-icons/fa";
import CustomButton from "../../components/buttons/CustomButton";
import { setNull, verifyEmail } from "../../redux/APIs/slices/authSlice";
import { CustomToast } from "../../components/Toast/CustomToast";

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, isLoading, isSuccess, message } = useSelector(
    (state) => state.authSlice
  );

  const [formData, setFormData] = useState({ email: "", code: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoading) {
      dispatch(verifyEmail(formData));
    }
  };

  useEffect(() => {
    if (isError) {
      CustomToast({ message, type: "error" });
      setTimeout(() => dispatch(setNull()), 3000);
    }
    if (isSuccess) {
      CustomToast({ message, type: "success" });
      setFormData({
        code: "",
        email: "",
      });
      setTimeout(() => {
        dispatch(setNull());
        navigate("/login/user");
      }, 1000);
    }
  }, [isSuccess, isError, dispatch, navigate]);

  useEffect(() => {
    return () => {
      dispatch(setNull());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-cyan-300 flex items-center justify-center px-4">
      <CustomButton text="Trở về" to="/login" position="top-left" />
      <motion.div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="text-3xl font-bold text-blue-700 text-center mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Xác minh Email
        </motion.h2>

        {isError && message && (
          <motion.p
            className="text-red-500 text-center mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {message}
          </motion.p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              disabled={isLoading}
              className={`w-full pl-10 py-3 rounded-xl border border-gray-300 focus:outline-none ${
                isLoading ? "bg-gray-100 cursor-not-allowed" : "focus:ring-2 focus:ring-blue-400"
              }`}
              required
            />
          </div>

          {/* Verification Code */}
          <div className="relative">
            <input
              name="code"
              type="text"
              value={formData.code}
              onChange={handleChange}
              placeholder="Mã xác minh"
              disabled={isLoading}
              className={`w-full pl-10 py-3 rounded-xl border border-gray-300 focus:outline-none ${
                isLoading ? "bg-gray-100 cursor-not-allowed" : "focus:ring-2 focus:ring-blue-400"
              }`}
              required
            />
          </div>

          {/* Submit button */}
          <motion.button
            type="submit"
            whileHover={{ scale: isLoading ? 1 : 1.05 }}
            whileTap={{ scale: isLoading ? 1 : 0.95 }}
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-semibold shadow-md transition flex items-center justify-center ${
              isLoading
                ? "bg-blue-300 text-gray-100 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
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
                Đang xác minh...
              </>
            ) : (
              "Xác minh"
            )}
          </motion.button>
        </form>

        <p className="text-center text-sm mt-4">
          Chưa nhận được mã?{" "}
          <Link to="/register/user" className="text-blue-500 underline">
            Đăng ký lại
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;