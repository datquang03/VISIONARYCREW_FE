import React, { useContext, useEffect, useRef } from 'react';
import { SidebarContext } from './SidebarContext';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTachometerAlt, FaUserMd, FaBox, FaUsers, FaClipboardList, FaWpforms, FaHistory, FaHome } from 'react-icons/fa';
import { gsap } from 'gsap';

const Sidebar = ({ role }) => {
  const { isCollapsed, toggleSidebar } = useContext(SidebarContext);
  const sidebarRef = useRef(null);
  const titleRef = useRef(null);
  const linksRef = useRef([]);

  // Navigation links with icons
  const doctorLinks = [
    { path: '/doctor/dashboard', label: 'Bảng điều khiển', icon: <FaTachometerAlt /> },
    { path: '/doctor/register', label: 'Đăng ký bác sĩ', icon: <FaUserMd /> },
    { path: '/doctor/packages', label: 'Gói dịch vụ', icon: <FaBox /> },
    { path: '/doctor/form', label: 'Đơn đăng kí của bạn', icon: <FaWpforms /> },
    { path: '/doctor/payment/history', label: 'Lịch sử thanh toán', icon: <FaHistory /> },
    { path: '/', label: 'Về trang chủ', icon: <FaHome /> },
  ];
  
  const adminLinks = [
    { path: '/admin/dashboard', label: 'Bảng điều khiển', icon: <FaTachometerAlt /> },
    { path: '/admin/doctors', label: 'Bác sĩ', icon: <FaUserMd />, exact: true },
    { path: '/admin/users', label: 'Người dùng', icon: <FaUsers /> },
    { path: '/admin/doctors/pending', label: 'Đơn đăng ký', icon: <FaClipboardList /> },
    { path: '/', label: 'Về trang chủ', icon: <FaHome /> },
  ];

  const links = role === 'doctor' ? doctorLinks : adminLinks;

  // Animation on mount
  useEffect(() => {
    if (sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );
    }

    linksRef.current.forEach((link, index) => {
      if (link) {
        gsap.fromTo(
          link,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, delay: index * 0.1, ease: 'power2.out' }
        );
      }
    });

    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, []);

  // Animation on collapse/expand
  useEffect(() => {
    if (sidebarRef.current) {
      gsap.to(sidebarRef.current, {
        width: isCollapsed ? 64 : 256,
        duration: 0.3,
        ease: 'power3.inOut',
      });
    }

    if (titleRef.current) {
      gsap.to(titleRef.current, {
        opacity: isCollapsed ? 0 : 1,
        x: isCollapsed ? -20 : 0,
        duration: 0.2,
        ease: 'power2.out',
      });
    }

    linksRef.current.forEach((link) => {
      if (link) {
        const label = link.querySelector('.nav-label');
        if (label) {
          gsap.to(label, {
            opacity: isCollapsed ? 0 : 1,
            x: isCollapsed ? -10 : 0,
            duration: 0.2,
            ease: 'power2.out',
          });
        }
      }
    });
  }, [isCollapsed]);

  // Handle hover animation for icons
  const handleLinkHover = (index, enter) => {
    if (linksRef.current[index]) {
      gsap.to(linksRef.current[index].querySelector('.nav-icon'), {
        scale: enter ? 1.2 : 1,
        duration: 0.2,
        ease: 'power2.out',
      });
    }
  };

  return (
    <div
      ref={sidebarRef}
      className={`bg-gray-800 text-white h-screen ${
        isCollapsed ? 'w-16' : 'w-64'
      } transition-all duration-300 fixed top-0 left-0 z-50 shadow-lg`}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        <h2
          ref={titleRef}
          className={`text-xl font-bold ${isCollapsed ? 'hidden' : 'block'} truncate`}
        >
          {role === 'doctor' ? 'Doctor Dashboard' : 'Admin Dashboard'}
        </h2>
        <button
          onClick={toggleSidebar}
          className="text-white hover:text-gray-300 focus:outline-none"
          title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
        >
          <FaBars className="text-xl" />
        </button>
      </div>
      <nav className="mt-4 flex flex-col items-center">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            end={link.exact || false}
            className={({ isActive }) =>
              `flex items-center w-full py-3 px-4 ${
                isActive ? 'bg-blue-500 text-white' : 'text-gray-200 hover:bg-gray-700'
              } ${isCollapsed ? 'justify-center' : 'justify-start'} transition-colors duration-200`
            }
            onMouseEnter={() => handleLinkHover(index, true)}
            onMouseLeave={() => handleLinkHover(index, false)}
            ref={(el) => (linksRef.current[index] = el)}
            title={isCollapsed ? link.label : ''}
          >
            <span className="nav-icon text-lg">{link.icon}</span>
            <span className={`nav-label ${isCollapsed ? 'hidden' : 'ml-3'}`}>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;