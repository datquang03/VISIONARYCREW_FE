import React, { useEffect, useRef, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaHome,
  FaUserMd,
  FaCalendar,
  FaCog,
  FaUsers,
  FaFileMedical,
  FaTable,
  FaBars,
  FaWpforms
} from 'react-icons/fa';
import { gsap } from 'gsap';
import { SidebarContext } from './SidebarContext';

const Sidebar = ({ role }) => {
  const sidebarRef = useRef(null);
  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);

  const doctorNavItems = [
    { name: 'Dashboard', path: '/doctor/dashboard', icon: <FaHome /> },
    { name: 'Đơn đăng kí', path: '/doctor/dashboard/register/form', icon: <FaWpforms /> },
    { name: 'Appointments', path: '/appointments', icon: <FaCalendar /> },
    { name: 'Records', path: '/records', icon: <FaFileMedical /> },
    { name: 'Settings', path: '/settings', icon: <FaCog /> }
  ];

  const adminNavItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FaHome /> },
    { name: 'Tài khoản', path: '/admin/dashboard/users', icon: <FaUsers /> },
    { name: 'Bác sĩ', path: '/admin/dashboard/doctors', icon: <FaUserMd /> },
    { name: 'Đơn đăng kí bác sĩ', path: '/admin/dashboard/doctors/pending', icon: <FaTable /> },
    { name: 'Settings', path: '/settings', icon: <FaCog /> }
  ];

  const navItems = role === 'doctor' ? doctorNavItems : adminNavItems;

  // Animate slide in/out
  useEffect(() => {
    gsap.to(sidebarRef.current, {
      width: isCollapsed ? '4rem' : '16rem',
      duration: 0.3,
      ease: 'power2.out'
    });
  }, [isCollapsed]);

  return (
    <div
      ref={sidebarRef}
      className="h-screen bg-gray-800 text-white flex flex-col fixed top-0 left-0 shadow-lg transition-all overflow-hidden z-50"
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between border-b border-gray-700 transition-all px-4 py-4 ${
          isCollapsed ? 'justify-center' : 'justify-between'
        }`}
      >
        {!isCollapsed && <h1 className="text-2xl font-bold">Admin</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white hover:text-gray-300 text-xl"
        >
          <FaBars />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 pt-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end // Apply end prop to all NavLinks for exact matching
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              } ${isCollapsed ? 'justify-center px-2' : ''}`
            }
          >
            <div className="text-lg">{item.icon}</div>
            {!isCollapsed && <span className="text-sm">{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;