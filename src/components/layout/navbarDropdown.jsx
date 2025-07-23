import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FaUserCircle,
  FaTachometerAlt,
  FaCogs,
  FaSignOutAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { logout } from "../../redux/APIs/slices/authSlice";

const dropdownVariants = {
  hidden: { opacity: 0, y: -20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

const NavbarDropdown = ({ onClose }) => {
  const ref = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let role = "user";
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo?.role) role = userInfo.role;
  } catch (err) {
    console.error("Invalid userInfo in localStorage", err);
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    onClose();
  };

  const commonItems = [
    { label: "Settings", to: "/settings", icon: <FaCogs /> },
  ];

  const roleItems = {
    admin: [
      { label: "Dashboard", to: "/admin/dashboard", icon: <FaTachometerAlt /> },
    ],
    doctor: [
      {
        label: "Dashboard",
        to: "/doctor/dashboard",
        icon: <FaTachometerAlt />,
      },
      {
        label: "Booking Schedule",
        to: "/doctor/booking",
        icon: <FaCalendarAlt />,
      },
      { label: "Profile", to: "/doctor/profile", icon: <FaUserCircle /> },
    ],
    user: [{ label: "Profile", to: "/profile", icon: <FaUserCircle /> }],
  };

  return (
    <motion.div
      ref={ref}
      variants={dropdownVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="absolute top-full right-0 mt-2 w-72 bg-white/70 backdrop-blur-xl border-[2px] border-slate-200 ring-2 ring-white shadow-2xl rounded-2xl z-[9999] overflow-hidden"
    >
      {[...roleItems[role], ...commonItems].map((item) => (
        <Link
          key={item.label}
          to={item.to}
          onClick={onClose}
          className="flex items-center gap-4 px-6 py-4 text-gray-800 hover:bg-indigo-100 transition-all font-medium"
        >
          <span className="text-lg text-indigo-600">{item.icon}</span>
          {item.label}
        </Link>
      ))}
      <button
        onClick={handleLogout}
        className="flex items-center gap-4 w-full px-6 py-4 text-red-600 hover:bg-red-100 transition-all font-semibold"
      >
        <FaSignOutAlt className="text-lg" />
        Logout
      </button>
    </motion.div>
  );
};

export default NavbarDropdown;
