import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getDoctorPaymentHistory } from '../../../redux/APIs/slices/paymentSlice';
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaBan } from 'react-icons/fa';

const statusMap = {
  PAID: {
    label: 'Đã thanh toán',
    color: 'text-green-600 bg-green-100',
    icon: <FaCheckCircle className="text-green-500" />,
  },
  PENDING: {
    label: 'Đang xử lý',
    color: 'text-yellow-700 bg-yellow-100',
    icon: <FaHourglassHalf className="text-yellow-500" />,
  },
  FAILED: {
    label: 'Thất bại',
    color: 'text-red-600 bg-red-100',
    icon: <FaTimesCircle className="text-red-500" />,
  },
  CANCELLED: {
    label: 'Đã hủy',
    color: 'text-red-600 bg-red-100',
    icon: <FaBan className="text-red-500" />,
  },
};

const DoctorPaymentHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { payments, isLoading, isError } = useSelector(state => state.paymentSlice);

  useEffect(() => {
    dispatch(getDoctorPaymentHistory());
  }, [dispatch]);

  return (
    <div className="p-4 md:p-6 animate-fade-in">
      <h2 className="text-2xl mb-6 text-blue-700 flex items-center gap-2">
        <svg className="w-8 h-8 text-blue-500 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 7v7m0 0H7m5 0h5" /></svg>
        Lịch sử thanh toán của bác sĩ
      </h2>

      {isLoading && <p className="text-lg text-blue-500 animate-pulse">Đang tải dữ liệu...</p>}
      
      {/* Error notification for unverified account */}
      {isError && (
        <div className="mb-6">
          <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg p-6 shadow-lg animate-fade-in">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-red-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  ⚠️ Tài khoản chưa được xác minh
                </h3>
                                 <div className="text-red-700">
                   <div className="bg-white rounded-lg p-4 mt-3 border border-red-200">
                     <h4 className="font-semibold text-red-800 mb-2">📋 Để được xác minh:</h4>
                     <ul className="text-sm text-red-700 space-y-1">
                       <li className="flex items-center gap-2">
                         <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                         Hoàn thành đăng ký thông tin bác sĩ
                       </li>
                       <li className="flex items-center gap-2">
                         <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                         Upload đầy đủ chứng chỉ hành nghề
                       </li>
                       <li className="flex items-center gap-2">
                         <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                         Chờ admin xét duyệt (thường 1-2 ngày làm việc)
                       </li>
                     </ul>
                   </div>
                   <div className="mt-4">
                     <button 
                       onClick={() => navigate('/doctor/form')}
                       className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 mx-auto"
                     >
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                       </svg>
                       Xem trạng thái
                     </button>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!isLoading && !isError && payments && payments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 rounded-2xl p-8 max-w-md w-full text-center animate-fade-in">
            <div className="mb-6">
              <svg className="w-16 h-16 text-blue-400 mx-auto animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-blue-800 mb-3">
              📋 Chưa có giao dịch nào
            </h3>
            <p className="text-blue-600 mb-6 leading-relaxed">
              Hiện tại bạn chưa có lịch sử thanh toán nào trong hệ thống. 
              Các giao dịch sẽ xuất hiện ở đây sau khi bạn thực hiện thanh toán.
            </p>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3">💡 Khi nào sẽ có giao dịch?</h4>
              <ul className="text-sm text-blue-700 space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Nâng cấp gói subscription
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Thanh toán dịch vụ premium
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Mua các tính năng bổ sung
                </li>
              </ul>
            </div>
            <div className="mt-6">
              <button 
                onClick={() => navigate('/doctor/packages')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Xem gói dịch vụ
              </button>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !isError && payments && payments.length > 0 && (
        <>
          {/* Table layout for medium and larger screens */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-md animate-fade-in">
              <thead>
                <tr className="bg-gradient-to-r from-blue-100 to-blue-200">
                  <th className="px-4 py-2 border-b-2 border-gray-200 text-gray-700 text-center">Mã giao dịch</th>
                  <th className="px-4 py-2 border-b-2 border-gray-200 text-gray-700 text-center">Số tiền</th>
                  <th className="px-4 py-2 border-b-2 border-gray-200 text-gray-700 text-center">Mô tả</th>
                  <th className="px-4 py-2 border-b-2 border-gray-200 text-gray-700 text-center">Trạng thái</th>
                  <th className="px-4 py-2 border-b-2 border-gray-200 text-gray-700 text-center">Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, idx) => {
                  const status = statusMap[p.status] || {
                    label: p.status,
                    color: 'text-gray-600 bg-gray-100',
                    icon: null,
                  };
                  return (
                    <tr
                      key={p.orderCode}
                      className="transition-all duration-200 hover:bg-blue-50 hover:scale-[1.01]"
                      style={{ animationDelay: `${idx * 60}ms` }}
                    >
                      <td className="px-4 py-2 border-b border-gray-200 text-center">{p.orderCode}</td>
                      <td className="px-4 py-2 border-b border-gray-200 text-center">{p.amount?.toLocaleString('vi-VN')}₫</td>
                      <td className="px-4 py-2 border-b border-gray-200 text-center">{p.description}</td>
                      <td className={`px-2 py-1 border-b border-gray-200 text-center rounded-full text-xs ${status.color}`}>
                        {status.label}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-200 text-center text-sm">
                        {p.createdAt ? new Date(p.createdAt).toLocaleString('vi-VN') : ''}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Card layout for mobile screens */}
          <div className="md:hidden flex flex-col gap-4 mt-4">
            {payments.map((p, idx) => {
              const status = statusMap[p.status] || {
                label: p.status,
                color: 'text-gray-600 bg-gray-100',
                icon: null,
              };
              return (
                <div
                  key={p.orderCode}
                  className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 animate-fade-in"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-700">Mã giao dịch:</span>
                    <span className="text-blue-600">{p.orderCode}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-700">Số tiền:</span>
                    <span className="text-green-600 font-medium">{p.amount?.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-700">Mô tả:</span>
                    <span className="text-gray-600 text-sm text-right">{p.description}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-700">Trạng thái:</span>
                    <span className={`flex items-center gap-2 text-sm px-2 py-1 rounded-full ${status.color}`}>
                      {status.icon} <span>{status.label}</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Ngày tạo:</span>
                    <span className="text-gray-500 text-sm">{p.createdAt ? new Date(p.createdAt).toLocaleString('vi-VN') : ''}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.7s cubic-bezier(0.4,0,0.2,1) both;
        }
      `}</style>
    </div>
  );
};

export default DoctorPaymentHistory;
