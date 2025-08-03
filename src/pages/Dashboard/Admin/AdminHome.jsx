import React from 'react';
import { FaUsers, FaUserMd, FaClipboardList, FaChartBar } from 'react-icons/fa';

const AdminHome = () => {
  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Chào mừng, Admin!
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Quản lý hệ thống Visionary Crew
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">Tổng người dùng</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-1">1,234</p>
              <p className="text-xs sm:text-sm mt-1 text-green-600">+12% so với tháng trước</p>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-blue-500 ml-3 flex-shrink-0">
              <FaUsers className="text-white text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border-l-4 border-l-green-500 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">Bác sĩ đã xác minh</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-1">89</p>
              <p className="text-xs sm:text-sm mt-1 text-green-600">+5% so với tháng trước</p>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-green-500 ml-3 flex-shrink-0">
              <FaUserMd className="text-white text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border-l-4 border-l-yellow-500 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">Đơn đăng ký mới</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-1">23</p>
              <p className="text-xs sm:text-sm mt-1 text-yellow-600">Cần xét duyệt</p>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-yellow-500 ml-3 flex-shrink-0">
              <FaClipboardList className="text-white text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border-l-4 border-l-purple-500 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">Lịch hẹn hôm nay</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-1">156</p>
              <p className="text-xs sm:text-sm mt-1 text-purple-600">+8% so với hôm qua</p>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-purple-500 ml-3 flex-shrink-0">
              <FaChartBar className="text-white text-lg sm:text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg border border-gray-100">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
          <FaChartBar className="text-blue-500" />
          Hoạt động gần đây
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base text-gray-800 truncate">Bác sĩ Nguyễn Văn A đã được xác minh</p>
              <p className="text-xs text-gray-500">2 phút trước</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base text-gray-800 truncate">Có 5 đơn đăng ký mới cần xét duyệt</p>
              <p className="text-xs text-gray-500">15 phút trước</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base text-gray-800 truncate">Hệ thống đã xử lý 23 lịch hẹn</p>
              <p className="text-xs text-gray-500">1 giờ trước</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
