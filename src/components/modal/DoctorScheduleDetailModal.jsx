import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FaRegTimesCircle, FaRegCheckCircle, FaEye } from 'react-icons/fa';
import ShortLoading from '../Loading/ShortLoading';
import { useNavigate } from 'react-router-dom';

const DoctorScheduleDetailModal = ({ slot, onClose }) => {
  const navigate = useNavigate();
  
  if (!slot) return null;
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
              {slot.status === 'completed' ? (
                <span className="text-green-600 font-bold uppercase bg-green-100 px-3 py-1 rounded-full border-2 border-green-300 shadow-sm">
                  ✅ ĐÃ HOÀN THÀNH
                </span>
              ) : slot.status === 'accepted' ? (
                <span className="text-green-600 font-bold uppercase bg-green-100 px-3 py-1 rounded-full border-2 border-green-300 shadow-sm">
                  ✅ ĐÃ CHẤP NHẬN
                </span>
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
                <button
                  type="button"
                  onClick={() => navigate('/doctor/pending')}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg font-bold shadow hover:bg-blue-600 transition flex items-center gap-2"
                >
                  <FaEye className="text-lg" /> Xem yêu cầu đăng ký
                </button>
            </div>

          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default DoctorScheduleDetailModal; 