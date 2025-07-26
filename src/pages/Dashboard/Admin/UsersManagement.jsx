import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../../redux/APIs/slices/adminSlice";
import ShortLoading from "../../../components/Loading/ShortLoading";
import { FaUsers, FaUserShield, FaEye, FaUser } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { gsap } from "gsap";
import { formatDate } from "../../../components/dateFormat/dateFormat";

const UserCard = ({ user, onViewDetails }) => (
  <div className="p-5 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border border-blue-100 flex flex-col justify-between h-full">
    <div>
      <div className="flex items-center gap-3 mb-2">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={`${user.username}'s avatar`}
            className="w-12 h-12 rounded-full object-cover border border-blue-200"
            onError={(e) => (e.target.src = "/path/to/fallback-image.jpg")}
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
        )}
        <h3 className="text-lg font-bold text-gray-800">{user.username}</h3>
      </div>
      <p className="text-sm text-gray-600">Email: {user.email}</p>
      <p className="text-sm text-gray-600">Phone: {user.phone || "Chưa cung cấp"}</p>
      <p className="text-sm text-gray-600 capitalize">Role: {user.role}</p>
      <p className="text-sm text-gray-600">Date of birth: {user.dateOfBirth ? formatDate(user.dateOfBirth) : "Chưa cung cấp"}</p>
      <p className="text-sm text-gray-600">
        Ngày tạo: {new Date(user.createdAt).toLocaleDateString("vi-VN")}
      </p>
    </div>
    <button
      onClick={() => onViewDetails(user)}
      className="mt-3 flex items-center justify-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
    >
      <FaEye /> Xem chi tiết
    </button>
  </div>
);

const UserDetailModal = ({ user, isOpen, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" }
      );
    }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-opacity-30 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-white rounded-xl p-6 w-full max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto"
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
        }}
      >
        <style>
          {`
            .scroll-bar-hidden::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Chi tiết người dùng</h2>
        <div className="space-y-4 text-gray-700">
          <div className="flex items-center gap-4 mb-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={`${user.username}'s avatar`}
                className="w-20 h-20 rounded-full object-cover border border-blue-200"
                onError={(e) => (e.target.src = "/path/to/fallback-image.jpg")}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{user.username}</h3>
              <p className="text-sm text-gray-600 capitalize">Role: {user.role}</p>
            </div>
          </div>
          <p className="break-words"><strong>Email:</strong> {user.email}</p>
          <p className="break-words"><strong>Phone:</strong> {user.phone || "Chưa cung cấp"}</p>
          <p className="break-words"><strong>Address:</strong> {user.address || "Chưa cung cấp"}</p>
          <p className="break-words"><strong>Date of birth:</strong> {user.dateOfBirth ? formatDate(user.dateOfBirth) : "Chưa cung cấp"}</p>
          <p className="break-words"><strong>Ngày tạo:</strong> {new Date(user.createdAt).toLocaleDateString("vi-VN")}</p>
          <p className="break-words"><strong>Ngày cập nhật:</strong> {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString("vi-VN") : "Chưa cập nhật"}</p>
          <p className="break-words"><strong>ID:</strong> {user._id}</p>
         
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

const UsersManagement = () => {
  const dispatch = useDispatch();
  const wrapperRef = useRef(null);
  const { users, totalUsers, isLoading } = useSelector((state) => state.adminSlice);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const swiperRef = useRef(null);

  const tabList = [
    { key: "all", label: "Tất cả", icon: <FaUsers /> },
    { key: "admin", label: "Admin", icon: <FaUserShield /> },
    { key: "user", label: "Người dùng", icon: <FaUser /> },
  ];

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
        setSelectedUser(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const filteredUsers =
    activeTab === "all" ? users : users.filter((user) => user.role === activeTab);

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setTimeout(() => {
      if (swiperRef.current) swiperRef.current.slideTo(0, 0);
    }, 0);
  };

  return (
    <div ref={wrapperRef}>
      {/* Header */}
      <div className="flex items-center mb-6">
        <FaUsers className="text-3xl text-blue-500 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Người Dùng</h1>
      </div>

      <div className="flex gap-3 border-b pb-2 overflow-x-auto scroll-bar-hidden">
        {tabList.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all duration-300 text-sm font-medium whitespace-nowrap
              ${activeTab === tab.key
                ? "bg-white shadow text-blue-600 border-b-2 border-blue-500"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <ShortLoading text="Đang tải danh sách người dùng..." />
      ) : filteredUsers.length === 0 ? (
        <p className="mt-6 text-gray-500 text-center text-xl font-medium bg-blue-100 p-4 rounded-lg shadow-md animate-fadeIn">
          Không có người dùng nào trong mục này.
        </p>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <UserCard key={user._id} user={user} onViewDetails={handleViewDetails} />
          ))}
        </div>
      )}

      {!isLoading && filteredUsers.length > 0 && (
        <p className="mt-8 text-sm text-gray-600 text-center">
          Tổng số người dùng: <strong>{totalUsers}</strong>
        </p>
      )}

      <UserDetailModal user={selectedUser} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default UsersManagement;