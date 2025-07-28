/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserProfile, updateUserProfile } from '../../../redux/APIs/slices/userProfileSlice';
import { CustomToast } from '../../../components/Toast/CustomToast';
import ShortLoading from '../../../components/Loading/ShortLoading';
import CustomButton from '../../../components/buttons/CustomButton';
const tabs = ['profile', 'settings', 'activity'];

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user, isLoading, isSuccess, isError, message } = useSelector((state) => state.userProfileSlice);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    dateOfBirth: '',
  });

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = () => {
    // Check if there are actual changes
    const hasChanges = Object.keys(formData).some(key => {
      const currentValue = formData[key];
      const originalValue = user[key];
      return currentValue !== originalValue;
    });

    if (!hasChanges) {
      CustomToast('Không có thay đổi nào để cập nhật!', 'info');
      return;
    }

    dispatch(updateUserProfile(formData)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        CustomToast('Cập nhật thành công!', 'success');
        dispatch(getUserProfile());
      } else {
        CustomToast(res.payload?.message || 'Cập nhật thất bại', 'error');
      }
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <motion.div
            key="profile"
            className="p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-250px)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-800">Cập nhật hồ sơ</h2>
            <div className="space-y-3">
              <Input label="Username" name="username" value={formData.username} onChange={handleChange} />
              <Input label="Email" name="email" value={formData.email} onChange={handleChange} />
              <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
              <Input label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
              <Input label="Role" value={user?.role} disabled />
              <Input label="Created At" value={user?.createdAt?.slice(0, 10)} disabled />
              <Input label="Updated At" value={user?.updatedAt?.slice(0, 10)} disabled />
            </div>
            <motion.button
              onClick={handleUpdate}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
              </svg>
              Cập nhật thông tin
            </motion.button>
          </motion.div>
        );

      case 'settings':
        return (
          <motion.div
            key="settings"
            className="p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-2xl font-bold text-gray-800">Cài đặt</h2>
            <p>Chức năng đang phát triển.</p>
          </motion.div>
        );

      case 'activity':
        return (
          <motion.div
            key="activity"
            className="p-6 space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-2xl font-bold text-gray-800">Hoạt động gần đây</h2>
            <Activity title="Liked Blogs" items={user?.likedBlogs} />
            <Activity title="Saved Blogs" items={user?.savedBlogs} />
            <Activity title="Conversations" items={user?.conversations} />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    // Remove overflow-hidden to avoid constraining fixed positioning
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Move CustomButton outside the flex container to avoid layout interference */}
      <CustomButton
        text="Back to Home"
        to="/"
        position="top-left"
      />
      <motion.div
        layout
        className="profile-card max-w-2xl w-full bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        {isLoading && <ShortLoading text={"Đang tải hồ sơ người dùng..."} />}
        {isError && <div className="p-6 text-center text-red-500">{message}</div>}
        {isSuccess && (
          <>
            <div className="bg-blue-600 p-6 text-white text-center">
              <h1 className="text-3xl font-bold">Thông tin người dùng</h1>
              <p className="text-sm mt-2">{message}</p>
            </div>

            <nav className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <motion.button
                  key={tab}
                  whileHover={{ scale: 1.05 }}
                  className={`flex-1 py-4 px-6 text-center font-medium transition ${
                    activeTab === tab ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </motion.button>
              ))}
            </nav>

            <AnimatePresence mode="wait">{renderTabContent()}</AnimatePresence>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default UserProfile;

const Input = ({ label, name, value, onChange, type = 'text', disabled = false }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
  >
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      disabled={disabled}
      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
    />
  </motion.div>
);

const Activity = ({ title, items }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4 }}
  >
    <h3 className="text-lg font-semibold">{title}</h3>
    <p>{items?.length ? items.join(', ') : `Chưa có ${title.toLowerCase()}`}</p>
  </motion.div>
);