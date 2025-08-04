import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPayment } from '../../../redux/APIs/slices/paymentSlice';
import { FaSearch, FaFilter, FaEye, FaDownload, FaCalendar, FaUser, FaCreditCard, FaStar, FaCheckCircle, FaTimesCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { CustomToast } from '../../../components/Toast/CustomToast';

const AdminPayment = () => {
  const dispatch = useDispatch();
  const { allPayments, adminPagination, adminStatistics, loading, error } = useSelector(state => state.paymentSlice);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    packageType: '',
    doctorId: '',
    startDate: '',
    endDate: '',
    search: ''
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadPayments();
  }, [currentPage, sortBy, sortOrder]);

  useEffect(() => {
    if (error) {
      CustomToast.error(error);
    }
  }, [error]);

  const loadPayments = () => {
    const params = {
      page: currentPage,
      limit: 20,
      sortBy,
      sortOrder,
      ...filters
    };
    dispatch(getAllPayment(params));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    loadPayments();
  };

  const handleResetFilters = () => {
    setFilters({
      status: '',
      packageType: '',
      doctorId: '',
      startDate: '',
      endDate: '',
      search: ''
    });
    setCurrentPage(1);
    loadPayments();
  };

  const handleViewDetail = (payment) => {
    setSelectedPayment(payment);
    setShowDetailModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', icon: FaClock },
      'PAID': { color: 'bg-green-100 text-green-800', icon: FaCheckCircle },
      'CANCELLED': { color: 'bg-red-100 text-red-800', icon: FaTimesCircle },
      'EXPIRED': { color: 'bg-gray-100 text-gray-800', icon: FaExclamationTriangle },
      'FAILED': { color: 'bg-red-100 text-red-800', icon: FaTimesCircle }
    };

    const config = statusConfig[status] || statusConfig['PENDING'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const getPackageBadge = (packageType) => {
    const packageConfig = {
      'silver': { color: 'bg-gray-100 text-gray-800', name: 'Bạc' },
      'gold': { color: 'bg-yellow-100 text-yellow-800', name: 'Vàng' },
      'diamond': { color: 'bg-blue-100 text-blue-800', name: 'Kim Cương' }
    };

    const config = packageConfig[packageType] || { color: 'bg-gray-100 text-gray-800', name: packageType };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.name}
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Quản lý thanh toán</h1>
          <p className="text-gray-600 mt-1">Xem và quản lý tất cả thanh toán gói dịch vụ</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FaFilter className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Bộ lọc</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <FaCreditCard className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng thanh toán</p>
              <p className="text-2xl font-bold text-gray-900">{adminStatistics.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Thành công</p>
              <p className="text-2xl font-bold text-gray-900">{adminStatistics.byStatus?.PAID?.count || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <FaStar className="text-yellow-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tỷ lệ thành công</p>
              <p className="text-2xl font-bold text-gray-900">{adminStatistics.successRate || 0}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <FaDownload className="text-purple-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(adminStatistics.successfulAmount || 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Bộ lọc</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả</option>
                <option value="PENDING">Đang chờ</option>
                <option value="PAID">Đã thanh toán</option>
                <option value="CANCELLED">Đã hủy</option>
                <option value="EXPIRED">Hết hạn</option>
                <option value="FAILED">Thất bại</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gói dịch vụ</label>
              <select
                value={filters.packageType}
                onChange={(e) => handleFilterChange('packageType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả</option>
                <option value="silver">Bạc</option>
                <option value="gold">Vàng</option>
                <option value="diamond">Kim Cương</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
              <input
                type="text"
                placeholder="Mã đơn hàng, mô tả..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-end space-x-2">
              <button
                onClick={handleApplyFilters}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Áp dụng
              </button>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Danh sách thanh toán</h2>
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="createdAt">Ngày tạo</option>
                <option value="amount">Số tiền</option>
                <option value="status">Trạng thái</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Đang tải...</p>
          </div>
        ) : allPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn hàng
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bác sĩ
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gói
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{payment.orderCode}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUser className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{payment.doctorName}</div>
                          <div className="text-sm text-gray-500">{payment.doctorEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {getPackageBadge(payment.packageType)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetail(payment)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <FaCreditCard className="text-4xl text-gray-300 mx-auto mb-4" />
            <p>Không có thanh toán nào</p>
          </div>
        )}

        {/* Pagination */}
        {adminPagination.totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Trang {adminPagination.currentPage} của {adminPagination.totalPages} 
                ({adminPagination.totalPayments} thanh toán)
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(adminPagination.totalPages, currentPage + 1))}
                  disabled={currentPage === adminPagination.totalPages}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Chi tiết thanh toán</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimesCircle className="text-xl" />
                </button>
              </div>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mã đơn hàng</label>
                  <p className="text-sm text-gray-900">#{selectedPayment.orderCode}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                  <div className="mt-1">{getStatusBadge(selectedPayment.status)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Số tiền</label>
                  <p className="text-sm text-gray-900">{formatCurrency(selectedPayment.amount)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gói dịch vụ</label>
                  <div className="mt-1">{getPackageBadge(selectedPayment.packageType)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Thời hạn</label>
                  <p className="text-sm text-gray-900">{selectedPayment.packageDuration} tháng</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ngày tạo</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedPayment.createdAt)}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bác sĩ</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{selectedPayment.doctorName}</p>
                  <p className="text-sm text-gray-600">{selectedPayment.doctorEmail}</p>
                  <p className="text-sm text-gray-600">{selectedPayment.doctorPhone}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                <p className="text-sm text-gray-900 mt-1">{selectedPayment.description}</p>
              </div>

              {selectedPayment.comment && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedPayment.comment}</p>
                </div>
              )}

              {selectedPayment.status === 'PAID' && selectedPayment.paidAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ngày thanh toán</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedPayment.paidAt)}</p>
                </div>
              )}

              {selectedPayment.status === 'CANCELLED' && selectedPayment.cancelReason && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Lý do hủy</label>
                  <p className="text-sm text-gray-900">{selectedPayment.cancelReason}</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayment; 