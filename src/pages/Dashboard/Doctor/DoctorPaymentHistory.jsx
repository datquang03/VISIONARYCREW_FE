import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctorPaymentHistory } from '../../../redux/APIs/slices/paymentSlice';

const statusColor = {
  PAID: 'text-green-600 bg-green-100',
  PENDING: 'text-yellow-700 bg-yellow-100',
  FAILED: 'text-red-600 bg-red-100',
};

const DoctorPaymentHistory = () => {
  const dispatch = useDispatch();
  const { payments, isLoading, isError, message } = useSelector(state => state.paymentSlice);

  useEffect(() => {
    dispatch(getDoctorPaymentHistory());
  }, [dispatch]);

  return (
    <div className="p-6 animate-fade-in">
      <h2 className="text-2xl mb-8 text-blue-700 flex items-center gap-2">
        <svg className="w-8 h-8 text-blue-500 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 7v7m0 0H7m5 0h5" /></svg>
        Lịch sử thanh toán của bác sĩ
      </h2>
      {isLoading && <p className="text-lg text-blue-500 animate-pulse">Đang tải dữ liệu...</p>}
      {isError && <p className="text-red-500">Lỗi: {message}</p>}
      {!isLoading && !isError && payments && payments.length === 0 && (
        <p className="text-gray-500 italic">Chưa có giao dịch nào.</p>
      )}
      {!isLoading && !isError && payments && payments.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-xl animate-fade-in">
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
              {payments.map((p, idx) => (
                <tr
                  key={p.orderCode}
                  className="transition-all duration-200 hover:bg-blue-50 hover:scale-[1.01] group"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <td className="px-4 py-2 border-b border-gray-200 text-center">{p.orderCode}</td>
                  <td className="px-4 py-2 border-b border-gray-200 text-center">{p.amount?.toLocaleString('vi-VN')}₫</td>
                  <td className="px-4 py-2 border-b border-gray-200 text-center">{p.description}</td>
                  <td className={`px-2 py-1 border-b border-gray-200 text-center rounded-full text-xs ${statusColor[p.status] || 'text-gray-600 bg-gray-100'}`}>{p.status}</td>
                  <td className="px-4 py-2 border-b border-gray-200 text-center text-sm">{p.createdAt ? new Date(p.createdAt).toLocaleString('vi-VN') : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
