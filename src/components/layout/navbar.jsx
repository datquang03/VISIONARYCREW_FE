import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, logout } from "../../redux/APIs/slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const { isLoading, isError, isSuccess, message, user } = useSelector(
    (state) => state.authSlice
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const userId = userInfo ? userInfo.id : null;
    dispatch(getUserProfile(userId));
  }, [dispatch]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Dropdown animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.nav className="fixed top-0 left-0 w-full z-[1000] bg-slate-900 bg-opacity-90 backdrop-blur-md shadow-md px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-white tracking-wider">
        <motion.span
          whileHover={{ scale: 1.1, color: "#38bdf8" }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Visionary Crew
        </motion.span>
      </Link>

      {/* Profile Circle or Login Button */}
      {user ? (
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center cursor-pointer"
            onClick={toggleDropdown}
          >
            <span className="text-white text-lg font-semibold">
              {user?.username ? user.username[0].toUpperCase() : "U"}
            </span>
          </motion.div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg py-2"
            >
              {userInfo.role === "admin" && (
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-white hover:bg-slate-700"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <Link
                to="/profile"
                className="block px-4 py-2 text-white hover:bg-slate-700"
                onClick={() => setIsDropdownOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2 text-white hover:bg-slate-700"
                onClick={() => setIsDropdownOpen(false)}
              >
                Settings
              </Link>
              <motion.button
                className="block px-4 py-2 text-white hover:bg-slate-700"
                onClick={() => {
                  setIsDropdownOpen(false);
                  dispatch(logout());
                  navigate("/login");
                }}
              >
                Logout
              </motion.button>
            </motion.div>
          )}
        </div>
      ) : (
        <Link to="/login">
          <motion.button
            whileHover={{
              scale: 1.05,
              backgroundColor: "#38bdf8",
              color: "#0f172a",
              boxShadow: "0px 0px 15px rgba(56,189,248,0.6)",
            }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl bg-slate-700 text-white font-semibold shadow-md transition-all duration-300"
          >
            Đăng nhập
          </motion.button>
        </Link>
      )}
    </motion.nav>
  );
};

export default Navbar;
