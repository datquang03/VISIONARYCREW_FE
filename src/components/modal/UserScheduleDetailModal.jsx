import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FaRegTimesCircle, FaRegCheckCircle } from 'react-icons/fa';

const UserScheduleDetailModal = ({ slot, onClose, onRegister, onCancelBooking, onRejectBooking }) => {
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  if (!slot) return null;
  const slotType = slot?.slotType;
  const canRegister = slotType === 'doctor-free' || slotType === 'available';
  const isBookedByUser = slotType === 'booked-by-user';
  const isBookedByOther = slotType === 'booked-by-other';
  const dateStr = slot.date ? new Date(slot.date).toLocaleDateString('vi-VN') : '';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-7 rounded-2xl shadow-2xl max-w-md w-full border border-green-200">
          <h2 className="text-2xl font-bold mb-3 text-green-700 text-center">Chi tiết lịch hẹn</h2>
          <div className="mb-3 text-gray-700 text-center">
            <b>{dateStr}</b> | <b>{slot.timeSlot?.startTime} - {slot.timeSlot?.endTime}</b>
          </div>
          <div className="mb-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
            <div>
              <span className="font-semibold">Trạng thái:</span> {' '}
              {isBookedByOther ? (
                <span className="text-red-600 font-bold uppercase">ĐÃ CÓ NGƯỜI ĐẶT</span>
              ) : slot.patient ? (
                <span className="text-yellow-600 font-bold uppercase">ĐÃ ĐẶT</span>
              ) : (
                <span className="text-green-600 font-bold uppercase">TRỐNG</span>
              )}
            </div>
            <div><span className="font-semibold">Loại lịch:</span> {slot.appointmentType === 'online' ? 'Online' : 'Offline'}</div>
            {slot.notes && <div><span className="font-semibold">Ghi chú:</span> {slot.notes}</div>}
            {slot.meetingLink && <div><span className="font-semibold">Link:</span> <a href={slot.meetingLink} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{slot.meetingLink}</a></div>}
            {slot.createdAt && <div><span className="font-semibold">Tạo lúc:</span> {new Date(slot.createdAt).toLocaleString('vi-VN')}</div>}
            {slot.updatedAt && <div><span className="font-semibold">Cập nhật lúc:</span> {new Date(slot.updatedAt).toLocaleString('vi-VN')}</div>}
          </div>
          <div className="flex flex-col gap-3 mt-6">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition flex items-center gap-2"
              >
                <FaRegTimesCircle className="text-lg" /> Đóng
              </button>
              {canRegister && (
                <button
                  type="button"
                  onClick={() => onRegister && onRegister(slot._id)}
                  className="px-6 py-2 bg-yellow-400 text-white rounded-lg font-bold shadow hover:bg-yellow-500 transition flex items-center gap-2"
                >
                  <FaRegCheckCircle className="text-lg" /> Đăng ký lịch
                </button>
              )}
              {isBookedByUser && onRejectBooking && (
                <button
                  type="button"
                  onClick={() => setShowCancel(true)}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg font-bold shadow hover:bg-red-600 transition flex items-center gap-2"
                >
                  <FaRegTimesCircle className="text-lg" /> Từ chối lịch hẹn
                </button>
              )}
              {isBookedByUser && onCancelBooking && !onRejectBooking && (
                <button
                  type="button"
                  onClick={() => setShowCancel(true)}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg font-bold shadow hover:bg-red-600 transition flex items-center gap-2"
                >
                  <FaRegTimesCircle className="text-lg" /> Huỷ lịch đặt
                </button>
              )}
            </div>
            {showCancel && (
              <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in">
                <div className="mb-2 font-semibold text-red-700 flex items-center gap-2">
                  <FaRegTimesCircle className="text-xl" /> {onRejectBooking ? 'Nhập lý do từ chối lịch:' : 'Nhập lý do huỷ lịch:'}
                </div>
                <div className="relative">
                  <textarea
                    className="w-full border-2 border-red-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none mb-2 transition-all"
                    rows={2}
                    value={cancelReason}
                    onChange={e => setCancelReason(e.target.value)}
                    placeholder={onRejectBooking ? 'Lý do từ chối lịch...' : 'Lý do huỷ lịch...'}
                  />
                  <span className="absolute right-3 top-2 text-red-400 pointer-events-none">
                    <FaRegTimesCircle />
                  </span>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowCancel(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-semibold transition"
                  >
                    Hủy
                  </button>
                  {onRejectBooking ? (
                    <button
                      type="button"
                      disabled={!cancelReason.trim()}
                      onClick={() => {
                        if (onRejectBooking && cancelReason.trim()) onRejectBooking(slot._id, cancelReason.trim());
                      }}
                      className="px-6 py-2 bg-red-500 text-white rounded-lg font-bold shadow hover:bg-red-600 transition disabled:opacity-60 flex items-center gap-2"
                    >
                      <FaRegTimesCircle className="text-lg" /> Xác nhận từ chối
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!cancelReason.trim()}
                      onClick={() => {
                        if (onCancelBooking && cancelReason.trim()) onCancelBooking(slot._id, cancelReason.trim());
                      }}
                      className="px-6 py-2 bg-red-500 text-white rounded-lg font-bold shadow hover:bg-red-600 transition disabled:opacity-60 flex items-center gap-2"
                    >
                      <FaRegTimesCircle className="text-lg" /> Xác nhận huỷ
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default UserScheduleDetailModal; 