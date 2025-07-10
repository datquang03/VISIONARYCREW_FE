// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { FaEnvelope } from 'react-icons/fa';
// import CustomButton from '../../components/buttons/CustomButton';
// import { clearError, verifyEmail } from '../../redux/APIs/slices/userAuthSlices';

// const VerifyEmail = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loading, error } = useSelector((state) => state.userAuth);

//   const [formData, setFormData] = useState({ email: '', code: '' });

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log('Submitting verify email form with data:', formData);
//     dispatch(clearError());
//     const result = await dispatch(verifyEmail(formData));
//     if (verifyEmail.fulfilled.match(result)) {
//       console.log('Email verification successful, redirecting to login');
//       navigate('/login/user');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-200 to-cyan-300 flex items-center justify-center px-4">
//       <CustomButton text="Trở về" to="/login" position="top-left" />
//       <motion.div
//         className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8"
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.6 }}
//       >
//         <motion.h2
//           className="text-3xl font-bold text-blue-700 text-center mb-6"
//           initial={{ y: -20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//         >
//           Xác minh Email
//         </motion.h2>

//         {error && (
//           <motion.p
//             className="text-red-500 text-center mb-4"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//           >
//             {error}
//           </motion.p>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Email */}
//           <div className="relative">
//             <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
//             <input
//               name="email"
//               type="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Email"
//               className="w-full pl-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               required
//             />
//           </div>

//           {/* Verification Code */}
//           <div className="relative">
//             <input
//               name="code"
//               type="text"
//               value={formData.code}
//               onChange={handleChange}
//               placeholder="Mã xác minh"
//               className="w-full pl-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               required
//             />
//           </div>

//           {/* Submit button */}
//           <motion.button
//             type="submit"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-blue-600 transition cursor-pointer flex items-center justify-center"
//             disabled={loading}
//           >
//             {loading ? 'Đang xác minh...' : 'Xác minh'}
//           </motion.button>
//         </form>

//         <p className="text-center text-sm mt-4">
//           Chưa nhận được mã?{' '}
//           <Link to="/register" className="text-blue-500 underline">
//             Đăng ký lại
//           </Link>
//         </p>
//       </motion.div>
//     </div>
//   );
// };

// export default VerifyEmail;