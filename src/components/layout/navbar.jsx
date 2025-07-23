/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, getDoctorProfile } from "../../redux/APIs/slices/authSlice";
import NavbarDropdown from "./navbarDropdown";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authSlice || {}); // avoid undefined
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (userInfo?.id && userInfo?.role) {
      if (userInfo.role === "doctor") {
        dispatch(getDoctorProfile(userInfo.id));
      } else {
        dispatch(getUserProfile(userInfo.id));
      }
    }
  }, [dispatch]);

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
