/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../redux/APIs/slices/authSlice";
import { getDoctorProfile } from "../../redux/APIs/slices/doctorProfileSlice";
import NavbarDropdown from "./navbarDropdown";
import { FaBell } from 'react-icons/fa';
import { fetchNotifications, markNotificationRead, deleteNotification, deleteAllNotification } from '../../redux/APIs/slices/notificationSlice';
import { socket } from '../../utils/socket';
import { debounce } from 'lodash';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authSlice || {}); // avoid undefined
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifications = useSelector(state => state.notification?.notifications || []);
  const toggleNotif = () => setIsNotifOpen(!isNotifOpen);
  const closeNotif = () => setIsNotifOpen(false);
  const listenerRef = useRef();
  const debouncedFetch = useRef(debounce(() => {
    dispatch(fetchNotifications());
  }, 2000, { leading: true, trailing: false }));
  const notifDropdownRef = useRef();

  useEffect(() => {
    if (userInfo?.id && userInfo?.role) {
      if (userInfo.role === "doctor") {
        dispatch(getDoctorProfile(userInfo.id));
      } else {
        dispatch(getUserProfile(userInfo.id));
      }
    }
  }, [dispatch]);

  useEffect(() => {
    // Log trạng thái socket
    socket.on('connect', () => console.log('Socket connected'));
    socket.on('disconnect', () => console.log('Socket disconnected'));

    if (userInfo && userInfo.id) {
      dispatch(fetchNotifications());
      socket.emit('join', userInfo.id);
      // Cleanup listener cũ
      if (listenerRef.current) {
        socket.off('notification', listenerRef.current);
      }
      // Đăng ký listener mới
      listenerRef.current = () => {
        debouncedFetch.current();
      };
      socket.on('notification', listenerRef.current);
      return () => {
        if (listenerRef.current) {
          socket.off('notification', listenerRef.current);
        }
        debouncedFetch.current.cancel && debouncedFetch.current.cancel();
        socket.off('connect');
        socket.off('disconnect');
      };
    }
  }, [userInfo?.id, dispatch]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    if (isNotifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotifOpen]);

  // Hàm xoá tất cả thông báo
  const handleDeleteAllNotification = () => {
    dispatch(deleteAllNotification());
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

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
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                  {notifications.length}
                </span>
              )}
            </button>
            {isNotifOpen && (
              <div ref={notifDropdownRef} className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto border border-gray-200 animate-fade-in">
                <div className="p-3 border-b font-bold text-blue-700 flex justify-between items-center">
                  <span>Thông báo</span>
                  {/* Nút xoá tất cả */}
                  {notifications.length > 0 && (
                    <button
                      onClick={handleDeleteAllNotification}
                      className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition font-semibold shadow"
                    >
                      Xoá tất cả
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div className="p-4 text-gray-500 text-center">Không có thông báo nào</div>
                ) : (
                  <ul>
                    {notifications.slice(0, 3).map((notif, idx) => (
                      <li key={notif._id || idx} className={`px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 text-sm text-gray-800 flex justify-between items-start gap-2 ${notif.read ? 'opacity-60' : ''}`}>
                        <div>
                          {notif.message}
                          {notif.createdAt && (
                            <div className="text-xs text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleString('vi-VN')}</div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                          {/* Chỉ hiển thị nút xoá, ẩn nút đã đọc */}
                          <button onClick={() => dispatch(deleteNotification(notif._id))} className="text-xs text-red-500 hover:underline">Xoá</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <button onClick={closeNotif} className="block w-full py-2 text-center text-blue-600 hover:underline bg-gray-50 rounded-b-lg">Đóng</button>
              </div>
            )}
          </div>
        )}
        {userInfo ? (
          <div className="flex items-center gap-3 relative">
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
