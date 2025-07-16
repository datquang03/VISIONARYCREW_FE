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
      gsap.fromTo(modalRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.4 });
    }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 pt-30">
      <div
        ref={modalRef}
        className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto scroll-bar-hidden"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Chi tiết người dùng</h2>
        <div className="space-y-4 text-gray-700">
          <div className="flex items-center gap-4 mb-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={`${user.username}'s avatar`}
                className="w-24 h-24 rounded-full object-cover border border-blue-200"
                onError={(e) => (e.target.src = "/path/to/fallback-image.jpg")}
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{user.username}</h3>
              <p className="text-sm text-gray-600 capitalize">Role: {user.role}</p>
            </div>
          </div>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone || "Chưa cung cấp"}</p>
          <p><strong>Address:</strong> {user.address || "Chưa cung cấp"}</p>
          <p><strong>Date of birth:</strong> {user.dateOfBirth ? formatDate(user.dateOfBirth) : "Chưa cung cấp"}</p>
          <p><strong>Ngày tạo:</strong> {new Date(user.createdAt).toLocaleDateString("vi-VN")}</p>
          <p><strong>Ngày cập nhật:</strong> {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString("vi-VN") : "Chưa cập nhật"}</p>
          <p><strong>ID:</strong> {user._id}</p>
          <div>
            <strong>Chứng chỉ:</strong>
            {user.certifications?.length ? (
              <div>
                <ul className="list-disc pl-5 mb-4">
                  {user.certifications.map((cert, i) => (
                    <li key={i}>{cert.description || `Chứng chỉ ${i + 1}`}</li>
                  ))}
                </ul>
                <div className="grid gap-4 sm:grid-cols-2">
                  {user.certifications.map((cert, i) => (
                    cert.url && (
                      <div key={i} className="flex flex-col items-center">
                        <img
                          src={cert.url}
                          alt={`Chứng chỉ ${i + 1}`}
                          className="w-32 h-32 object-cover rounded-lg"
                          onError={(e) => (e.target.src = "/path/to/fallback-image.jpg")}
                        />
                        <p className="text-sm text-gray-600 mt-2">{cert.description || `Chứng chỉ ${i + 1}`}</p>
                      </div>
                    )
                  ))}
                </div>
              </div>
            ) : (
              <p className="italic">Không có chứng chỉ</p>
            )}
          </div>
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

  const tabList = [
    { key: "all", label: "Tất cả", icon: <FaUsers /> },
    { key: "admin", label: "Admin", icon: <FaUserShield /> },
    { key: "user", label: "Người dùng", icon: <FaUser /> },
  ];

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (wrapperRef.current) {
      gsap.fromTo(wrapperRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 });
    }
  }, []);

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

  return (
    <div
      ref={wrapperRef}
      className="relative bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-xl max-w-6xl mx-auto"
    >
      <style>{`
        .scroll-bar-hidden {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .scroll-bar-hidden::-webkit-scrollbar {
          display: none;
        }
        .swiper-container {
          width: 100%;
          overflow: hidden;
        }
        .swiper-slide {
          display: flex;
          justify-content: center;
          width: auto !important;
        }
      `}</style>

      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-200 via-white to-blue-300 opacity-40 backdrop-blur-md border border-blue-100 shadow-inner -z-10" />

      <div className="flex items-center mb-6">
        <FaUsers className="text-3xl text-blue-500 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Người Dùng</h1>
      </div>

      <div className="flex gap-3 border-b pb-2 overflow-x-auto scroll-bar-hidden">
        {tabList.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-cente
            r gap-2 px-4 py-2 rounded-t-lg transition-all duration-300 text-sm font-medium whitespace-nowrap
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
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
          }}
          navigation
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
          className="mt-6 swiper-container"
        >
          {filteredUsers.map((user) => (
            <SwiperSlide key={user._id}>
              <div className="flex justify-center">
                <UserCard user={user} onViewDetails={handleViewDetails} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {!isLoading && filteredUsers.length > 0 && (
        <p className="mt-8 text-sm text-gray-500 text-center">
          Tổng số người dùng: <strong>{totalUsers}</strong>
        </p>
      )}

      <UserDetailModal user={selectedUser} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default UsersManagement;