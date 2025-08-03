/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../redux/APIs/slices/authSlice";
import { getDoctorProfile } from "../../redux/APIs/slices/doctorProfileSlice";
import NavbarDropdown from "./navbarDropdown";
import { FaBell, FaTimes, FaEye } from "react-icons/fa";
import { fetchNotifications, markNotificationRead, deleteNotification, deleteAllNotification } from '../../redux/APIs/slices/notificationSlice';
import { socket } from '../../utils/socket';
import ShortLoading from '../Loading/ShortLoading';

const Navbar = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.authSlice?.user || state.authSlice?.doctor);
  const user = useSelector((state) => state.authSlice?.user || state.authSlice?.doctor);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifications = useSelector(state => state.notification?.notifications || []);
  const { deleteLoading, deleteAllLoading, markReadLoading } = useSelector(state => state.notification);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  
  const dropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);
  const listenerRef = useRef(null);

  const toggleNotif = () => setIsNotifOpen(!isNotifOpen);
  const closeNotif = () => setIsNotifOpen(false);
  const toggleShowAll = () => setShowAllNotifications(!showAllNotifications);

  // Fetch notifications on mount
  useEffect(() => {
    if (userInfo) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, userInfo]);

  // Socket connection for real-time notifications
  useEffect(() => {
    if (userInfo && userInfo.id) {
      console.log('🔍 Debug: Joining socket room for user:', userInfo.id);
      socket.emit("join", userInfo.id);
      
      listenerRef.current = (newNotification) => {
        console.log('🔍 Debug: Received notification via socket:', newNotification);
        // Không gọi API createNotification vì notification đã được tạo ở backend
        // Chỉ cần fetch lại notifications để có data đầy đủ
        dispatch(fetchNotifications());
      };
      
      socket.on("notification", listenerRef.current);
      
      // Listen for completed schedule events
      socket.on("scheduleCompleted", (data) => {
        console.log('🔍 Debug: Received scheduleCompleted event:', data);
        // Dispatch custom event for mandatory feedback
        window.dispatchEvent(new CustomEvent('scheduleCompleted', { detail: data }));
      });
      
      return () => {
        socket.off("notification", listenerRef.current);
      };
    }
  }, [userInfo, dispatch]);

  // Auto mark as read when notifications are visible in dropdown
  useEffect(() => {
    if (isNotifOpen && notifications.length > 0) {
      const unreadNotifications = notifications.filter(notif => !notif.read && notif._id);
      unreadNotifications.forEach(notif => {
        dispatch(markNotificationRead(notif._id));
      });
    }
  }, [isNotifOpen, notifications, dispatch]);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDeleteAllNotification = () => {
    dispatch(deleteAllNotification());
  };



  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  // Tính số thông báo chưa đọc
  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 70 }}
      className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg px-6 py-4 flex justify-between items-center z-100"
    >
      <Link to="/" className="text-white text-2xl font-bold tracking-wide">
        Visionary Crew
      </Link>

      <div className="flex items-center gap-6">
        {/* Bell notification icon */}
        {userInfo && (
          <div className="relative">
            <button onClick={toggleNotif} className="relative focus:outline-none">
              <FaBell className="text-white text-2xl" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 min-w-[18px] flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {isNotifOpen && (
              <div ref={notifDropdownRef} className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto border border-gray-200 animate-fade-in">
                <div className="p-3 border-b font-bold text-blue-700 flex justify-between items-center">
                  <span>Thông báo ({unreadCount} chưa đọc)</span>
                  {/* Nút xoá tất cả */}
                  {notifications.length > 0 && (
                    <button
                      onClick={handleDeleteAllNotification}
                      disabled={deleteAllLoading}
                      className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleteAllLoading ? (
                        <>
                          <ShortLoading size="xs" color="white" className="inline-block mr-1" />
                          Đang xoá...
                        </>
                      ) : (
                        'Xoá tất cả'
                      )}
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div className="p-4 text-gray-500 text-center">Không có thông báo nào</div>
                ) : (
                  <>
                    <ul>
                      {notifications.slice(0, 3).map((notif, idx) => (
                        <li 
                          key={notif._id || idx} 
                          className={`px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 text-sm text-gray-800 flex justify-between items-start gap-2 transition-all ${
                            notif.read ? 'opacity-60 bg-gray-50' : 'bg-white'
                          }`}
                        >
                          <div className="flex-1">
                            <div className={`${notif.read ? 'font-normal' : 'font-semibold'}`}>
                              {notif.message}
                            </div>
                            {notif.createdAt && (
                              <div className="text-xs text-gray-400 mt-1">
                                {new Date(notif.createdAt).toLocaleString('vi-VN')}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-1 items-end">
                            {notif._id && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch(deleteNotification(notif._id));
                                }} 
                                disabled={deleteLoading}
                                className="text-xs text-red-500 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {deleteLoading ? (
                                  <ShortLoading size="xs" color="red" />
                                ) : (
                                  'Xoá'
                                )}
                              </button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                    
                    {/* Button "Xem tất cả" nếu có nhiều hơn 3 thông báo */}
                    {notifications.length > 3 && (
                      <div className="p-3 border-t">
                        <button 
                          onClick={toggleShowAll}
                          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center gap-2"
                        >
                          <FaEye className="text-sm" />
                          Xem tất cả ({notifications.length} thông báo)
                        </button>
                      </div>
                    )}
                  </>
                )}
                <button onClick={closeNotif} className="block w-full py-2 text-center text-blue-600 hover:underline bg-gray-50 rounded-b-lg">Đóng</button>
              </div>
            )}
          </div>
        )}

        {/* Modal "Xem tất cả thông báo" */}
        {showAllNotifications && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">
                  Tất cả thông báo ({notifications.length})
                </h3>
                <button 
                  onClick={toggleShowAll}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {notifications.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">Không có thông báo nào</div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notif, idx) => (
                      <div 
                        key={notif._id || idx}
                        className={`p-4 rounded-lg border transition-all ${
                          notif.read 
                            ? 'bg-gray-50 border-gray-200 opacity-75' 
                            : 'bg-white border-blue-200 shadow-sm'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className={`${notif.read ? 'font-normal' : 'font-semibold'} text-gray-800`}>
                              {notif.message}
                            </div>
                            {notif.createdAt && (
                              <div className="text-sm text-gray-500 mt-2">
                                {new Date(notif.createdAt).toLocaleString('vi-VN')}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {notif._id && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch(deleteNotification(notif._id));
                                }}
                                disabled={deleteLoading}
                                className="text-red-500 hover:text-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {deleteLoading ? (
                                  <ShortLoading size="xs" color="red" />
                                ) : (
                                  <FaTimes />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {unreadCount} thông báo chưa đọc
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={handleDeleteAllNotification}
                    disabled={deleteAllLoading}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteAllLoading ? (
                      <>
                        <ShortLoading size="sm" color="white" className="inline-block mr-2" />
                        Đang xoá...
                      </>
                    ) : (
                      'Xoá tất cả'
                    )}
                  </button>
                  <button 
                    onClick={toggleShowAll}
                    disabled={deleteAllLoading}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {userInfo ? (
          <div ref={dropdownRef} className="flex items-center gap-3 relative">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center cursor-pointer overflow-hidden ring-2 ring-white"
              onClick={toggleDropdown}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-blue-600 text-lg font-bold">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </span>
              )}
            </motion.div>
            <p className="text-white font-semibold hidden sm:block">
              {user?.fullName || user?.username}
            </p>
            {isDropdownOpen && <NavbarDropdown onClose={closeDropdown} />}
          </div>
        ) : (
          <Link to="/login" className="text-white font-medium hover:underline">
            Đăng nhập
          </Link>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
