import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  FaCalendarAlt, FaUsers, FaClock, FaCheckCircle, 
  FaTimesCircle, FaBell, FaChartBar, FaEye, FaEyeSlash 
} from 'react-icons/fa';
import { getMySchedules } from '../../../redux/APIs/slices/scheduleSlice';
import { fetchNotifications } from '../../../redux/APIs/slices/notificationSlice';

const DoctorHome = () => {
  const dispatch = useDispatch();
  const { mySchedules = [], loading: schedulesLoading } = useSelector(state => state.scheduleSlice);
  const { notifications = [], loading: notificationsLoading } = useSelector(state => state.notification);
  const currentDoctor = useSelector(state => state.authSlice.doctor);

  const [showNotifications, setShowNotifications] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    dispatch(getMySchedules());
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Tính toán thống kê
  const getStats = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const filterSchedules = (schedules, startDate) => {
      return schedules.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate >= startDate;
      });
    };

    const weekSchedules = filterSchedules(mySchedules, weekAgo);
    const monthSchedules = filterSchedules(mySchedules, monthAgo);

    const getSchedulesByStatus = (schedules) => {
      return schedules.reduce((acc, schedule) => {
        const status = schedule.status || 'pending';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});
    };

    const weekStats = getSchedulesByStatus(weekSchedules);
    const monthStats = getSchedulesByStatus(monthSchedules);

    return {
      totalSchedules: mySchedules.length,
      weekSchedules: weekSchedules.length,
      monthSchedules: monthSchedules.length,
      bookedSchedules: mySchedules.filter(s => s.patient).length,
      pendingSchedules: mySchedules.filter(s => s.status === 'pending').length,
      completedSchedules: mySchedules.filter(s => s.status === 'completed').length,
      cancelledSchedules: mySchedules.filter(s => s.status === 'cancelled').length,
      weekStats,
      monthStats
    };
  };

  const stats = getStats();

  // Dữ liệu cho charts
  const getChartData = () => {
    const now = new Date();
    const days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const daySchedules = mySchedules.filter(s => 
        s.date?.slice(0, 10) === dateStr
      );
      
      days.push({
        date: date.toLocaleDateString('vi-VN', { weekday: 'short' }),
        total: daySchedules.length,
        booked: daySchedules.filter(s => s.patient).length,
        pending: daySchedules.filter(s => s.status === 'pending').length,
        completed: daySchedules.filter(s => s.status === 'completed').length
      });
    }
    
    return days;
  };

  const chartData = getChartData();

  // Dữ liệu cho pie chart - chỉ hiển thị các giá trị > 0
  const pieData = [
    ...(stats.bookedSchedules > 0 ? [{ name: 'Đã đặt', value: stats.bookedSchedules, color: '#10B981' }] : []),
    ...(stats.pendingSchedules > 0 ? [{ name: 'Chờ xử lý', value: stats.pendingSchedules, color: '#F59E0B' }] : []),
    ...(stats.completedSchedules > 0 ? [{ name: 'Hoàn thành', value: stats.completedSchedules, color: '#3B82F6' }] : []),
    ...(stats.cancelledSchedules > 0 ? [{ name: 'Đã hủy', value: stats.cancelledSchedules, color: '#EF4444' }] : [])
  ];

  // Nếu không có dữ liệu, hiển thị thông báo
  const hasPieData = pieData.length > 0;

  // Lọc notifications gần đây
  const recentNotifications = notifications
    .filter(notif => notif.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const StatCard = ({ title, value, icon, color, change }) => (
    <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">{title}</p>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-xs sm:text-sm mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% so với tuần trước
            </p>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-lg ${color} ml-3 flex-shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  );

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (schedulesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Xin chào, {currentDoctor?.fullName || currentDoctor?.name || 'Bác sĩ'}
            </h2>
            <p className="text-gray-600 mt-1">Đang tải dữ liệu...</p>
          </div>
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Chào mừng, {currentDoctor?.username || 'Bác sĩ'}!
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Đây là tổng quan hoạt động của bạn
          </p>
        </div>
        
        {/* Notifications Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            {showNotifications ? <FaEyeSlash /> : <FaEye />}
            {showNotifications ? 'Ẩn thông báo' : 'Hiện thông báo'}
          </button>
        </div>
      </div>

      {/* Loading */}
      {(schedulesLoading || notificationsLoading) && <LoadingSpinner />}

      {/* Notifications */}
      {showNotifications && notifications.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <FaBell className="text-blue-600" />
            Thông báo gần đây
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {notifications.slice(0, 5).map((notification, index) => (
              <div key={notification._id || index} className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border-l-4 border-l-blue-500">
                <p className="text-sm sm:text-base text-gray-800">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notification.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Tổng lịch hẹn"
          value={stats.totalSchedules}
          icon={<FaCalendarAlt className="text-white text-lg sm:text-xl" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Lịch hẹn đã đặt"
          value={stats.bookedSchedules}
          icon={<FaUsers className="text-white text-lg sm:text-xl" />}
          color="bg-green-500"
        />
        <StatCard
          title="Đang chờ xử lý"
          value={stats.pendingSchedules}
          icon={<FaClock className="text-white text-lg sm:text-xl" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="Đã hoàn thành"
          value={stats.completedSchedules}
          icon={<FaCheckCircle className="text-white text-lg sm:text-xl" />}
          color="bg-purple-500"
        />
      </div>

      {/* Charts */}
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Line Chart - Lịch hẹn theo ngày */}
        <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg border border-gray-100 w-full overflow-hidden">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <FaChartBar className="text-blue-500" />
            Lịch hẹn theo ngày
          </h3>
          <div className="w-full h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={2} name="Tổng" />
                <Line type="monotone" dataKey="booked" stroke="#10B981" strokeWidth={2} name="Đã đặt" />
                <Line type="monotone" dataKey="completed" stroke="#8B5CF6" strokeWidth={2} name="Hoàn thành" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Phân bố trạng thái */}
        <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg border border-gray-100 w-full overflow-hidden">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <FaChartBar className="text-green-500" />
            Phân bố trạng thái
          </h3>
          {hasPieData ? (
            <div className="w-full h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 sm:h-64 text-gray-500">
              <div className="text-center">
                <FaChartBar className="text-3xl sm:text-4xl mx-auto mb-2 text-gray-300" />
                <p className="text-sm sm:text-base">Chưa có dữ liệu lịch hẹn</p>
              </div>
            </div>
          )}
        </div>

        {/* Bar Chart - So sánh tuần/tháng */}
        <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg border border-gray-100 w-full overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FaChartBar className="text-purple-500" />
              So sánh hoạt động
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPeriod('week')}
                className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  selectedPeriod === 'week' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Tuần này
              </button>
              <button
                onClick={() => setSelectedPeriod('month')}
                className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  selectedPeriod === 'month' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Tháng này
              </button>
            </div>
          </div>
          <div className="w-full h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                {
                  name: 'Đã đặt',
                  'Tuần này': stats.weekStats.booked || 0,
                  'Tháng này': stats.monthStats.booked || 0
                },
                {
                  name: 'Chờ xử lý',
                  'Tuần này': stats.weekStats.pending || 0,
                  'Tháng này': stats.monthStats.pending || 0
                },
                {
                  name: 'Hoàn thành',
                  'Tuần này': stats.weekStats.completed || 0,
                  'Tháng này': stats.monthStats.completed || 0
                }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Tuần này" fill="#3B82F6" />
                <Bar dataKey="Tháng này" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorHome;
