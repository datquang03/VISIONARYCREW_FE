// components/DoctorScheduleTable.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ConfirmModal } from '../../../components/modal/ConfirmModal';
import { useDispatch, useSelector } from 'react-redux';
import { createSchedule, getMySchedules, updateSchedule, deleteSchedule, rejectRegisterSchedule } from '../../../redux/APIs/slices/scheduleSlice';
import { CustomToast } from '../../../components/Toast/CustomToast';
import DoctorScheduleDetailModal from '../../../components/modal/DoctorScheduleDetailModal';

const DoctorScheduleTable = ({
  currentUser,
  selectedDate,
  timeSlots,
  getDaysOfWeek,
  isSlotAvailable,
  isSlotCompleted,
  isPastSlot: isPastSlotProp,
  handleCreateAvailableSlot,
}) => {
  const days = getDaysOfWeek();
  const todayStr = new Date().toDateString();
  const [confirmData, setConfirmData] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const dispatch = useDispatch();
  const { loading, mySchedules = [] } = useSelector(state => state.scheduleSlice);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Realtime update để disable slot quá khứ
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update mỗi phút

    return () => clearInterval(interval);
  }, []);

  // Định dạng ngày về yyyy-mm-dd
  const formatDate = (date) => {
    if (!date) return '';
    if (typeof date === 'string') return date.slice(0, 10);
    return date.toISOString().split('T')[0];
  };

  const handleSlotClick = (day, timeSlot) => {
    // Tìm slot đã đặt nếu có
    const slot = (Array.isArray(mySchedules) ? mySchedules : []).find(slot => {
      const dateStr = formatDate(day);
      const { startTime, endTime } = timeSlot;
      return slot.date?.slice(0, 10) === dateStr &&
        slot.timeSlot?.startTime === startTime &&
        slot.timeSlot?.endTime === endTime;
    });
    let slotStatus = '';
    if (slot) {
      if (slot.status === 'completed') {
        slotStatus = 'completed';
      } else if (slot.patient) {
        slotStatus = 'booked';
      } else {
        slotStatus = 'created';
      }
    }
    
    // Cho phép click nếu có slot (dù ở quá khứ) hoặc slot mới không ở quá khứ
    const canClick = slot || !isPastSlotProp(day, timeSlot);
    
    if (!canClick) return;
    
    if (slotStatus === 'completed') {
      setDetailModal({ ...slot, slotType: 'completed' });
    } else if (slotStatus === 'booked') {
      setDetailModal({ ...slot, slotType: 'booked-by-user' });
    } else if (slotStatus === 'created') {
      setConfirmData({ day, timeSlot, slot }); // cho phép update/delete
    } else {
      setConfirmData({ day, timeSlot }); // slot mới
    }
  };

  // Xử lý tạo mới, cập nhật, xóa lịch
  const handleConfirm = async (scheduleData, mode = 'create', scheduleId = null) => {
    try {

      if (mode === 'update' && scheduleId) {
        await dispatch(updateSchedule({ scheduleId, updates: scheduleData })).unwrap();
        CustomToast({ message: 'Cập nhật lịch thành công!', type: 'success' });
      } else if (mode === 'delete' && scheduleId) {
        await dispatch(deleteSchedule(scheduleId)).unwrap();
        CustomToast({ message: 'Xóa lịch thành công!', type: 'success' });
      } else {
        await dispatch(createSchedule(scheduleData)).unwrap();
        CustomToast({ message: 'Tạo lịch thành công!', type: 'success' });
      }
      dispatch(getMySchedules());
      setConfirmData(null);
    } catch (err) {
      CustomToast({ message: err?.message || 'Thao tác thất bại!', type: 'error' });
    }
  };

  const handleCancel = () => {
    setConfirmData(null);
  };

  const TickCircle = () => (
    <span className="flex items-center justify-center w-9 h-9 rounded-full bg-green-500 text-white text-xl mx-auto shadow-md">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    </span>
  );

  // Hàm kiểm tra slot thuộc quá khứ (realtime)
  const isPastSlot = (date, timeSlot) => {
    const slotDate = new Date(date);
    const { endTime } = timeSlot;
    const [endHour, endMin] = endTime.split(':');
    const slotEnd = new Date(slotDate);
    slotEnd.setHours(Number(endHour), Number(endMin), 0, 0);
    return slotEnd <= currentTime;
  };

  const handleRejectBooking = async (scheduleId, rejectedReason) => {
    try {
      await dispatch(
        rejectRegisterSchedule({ scheduleId, rejectedReason })
      ).unwrap();
      CustomToast({ message: 'Từ chối lịch hẹn thành công!', type: 'success' });
      dispatch(getMySchedules());
      setDetailModal(null);
    } catch (err) {
      CustomToast({ message: err?.message || 'Từ chối lịch thất bại!', type: 'error' });
    }
  };

  return (
    <>
      <motion.div
        className="overflow-x-auto scroll-bar-hidden bg-white rounded-xl shadow-md border border-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-green-100 text-black font-semibold text-lg px-4 py-3 border-b border-green-300">
          Tạo lịch rảnh của bạn
        </div>

        {/* Mobile Table (Stacked) */}
        <div className="md:hidden divide-y divide-gray-200 overflow-x-auto">
          {timeSlots.map((timeSlot, rowIdx) => (
            <div key={rowIdx} className="p-2">
              <div className="font-semibold text-gray-800 mb-2 text-xs">{timeSlot.display}</div>
              <div className="grid grid-cols-4 gap-2 text-sm">
                                  {days.map((day, i) => {
                    const slot = (Array.isArray(mySchedules) ? mySchedules : []).find(slot => {
                      const dateStr = formatDate(day);
                      const { startTime, endTime } = timeSlot;
                      return slot.date?.slice(0, 10) === dateStr &&
                        slot.timeSlot?.startTime === startTime &&
                        slot.timeSlot?.endTime === endTime;
                    });
                  let slotStatus = '';
                  if (slot) {
                    if (slot.status === 'completed') {
                      slotStatus = 'completed'; // Đã hoàn thành
                    } else if (slot.patient) {
                      slotStatus = 'booked'; // Đã được book
                    } else {
                      slotStatus = 'created'; // Đã tạo nhưng chưa ai book
                    }
                  }
                  const isAvailable = !!slot;
                  const isToday = day.toDateString() === todayStr;
                                                          return (
                      <div
                        key={i}
                        onClick={() => handleSlotClick(day, timeSlot)}
                        className={`rounded-lg text-center border transition duration-300 flex flex-col items-center justify-center min-h-[48px] min-w-[48px] max-w-[60px] max-h-[60px] mx-auto p-1
                          ${isPastSlot(day, timeSlot) && !slot ? 'bg-gray-300 cursor-not-allowed opacity-60' : 'cursor-pointer'}
                          ${isToday ? 'ring-2 ring-green-400' : ''}
                          ${slotStatus === 'booked' ? 'bg-yellow-400 text-white font-bold' : ''}
                          ${slotStatus === 'created' ? 'bg-blue-400 text-white font-bold' : ''}`}
                      >
                        <div className="font-bold text-xs">{day.getDay() === 0 ? 'CN' : `T${day.getDay() + 1}`}</div>
                        <div className="text-[10px]">{`${day.getDate()}/${day.getMonth() + 1}`}</div>
                        <div className="mt-1 flex items-center justify-center">
                          {slotStatus === 'completed' && <span>hoàn thành</span>}
                          {slotStatus === 'booked' && <span>đã đặt</span>}
                          {slotStatus === 'created' && <span>chờ đặt</span>}
                          {!slot && !isPastSlot(day, timeSlot) && <span className="text-xl text-green-500 font-bold">+</span>}
                          {isPastSlot(day, timeSlot) && !slot && <span className="text-gray-500 text-xs">Đã qua</span>}
                        </div>
                      </div>
                    );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full text-center min-w-[1050px]">
            <thead>
              <tr className="bg-gray-100 text-gray-800">
                <th className="p-1 border w-[90px] md:w-[120px] text-xs md:text-base">Giờ</th>
                {days.map((day, i) => (
                  <th
                    key={i}
                    className={`p-1 md:p-2 border w-[60px] md:w-[100px] ${day.toDateString() === todayStr ? 'bg-green-100 text-green-700' : ''}`}
                  >
                    {day.getDay() === 0 ? 'CN' : `T${day.getDay() + 1}`}<br />
                    {`${day.getDate()}/${day.getMonth() + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((timeSlot, rowIdx) => (
                <tr key={rowIdx}>
                  <td className="border p-1 md:p-2 font-medium text-gray-700 bg-gray-50 w-[90px] md:w-[120px] text-xs md:text-base">{timeSlot.display}</td>
                  {days.map((day, colIdx) => {
                    const slot = (Array.isArray(mySchedules) ? mySchedules : []).find(slot => {
                      const dateStr = formatDate(day);
                      const { startTime, endTime } = timeSlot;
                      return slot.date?.slice(0, 10) === dateStr &&
                        slot.timeSlot?.startTime === startTime &&
                        slot.timeSlot?.endTime === endTime;
                    });
                    let slotStatus = '';
                    if (slot) {
                      if (slot.status === 'completed') {
                        slotStatus = 'completed';
                      } else if (slot.patient) {
                        slotStatus = 'booked';
                      } else {
                        slotStatus = 'created';
                      }
                    }
                    const isAvailable = !!slot;
                    const isToday = day.toDateString() === todayStr;
                    return (
                      <td
                        key={colIdx}
                        className={`border transition duration-300 align-middle
                          w-[80px] h-[60px] md:w-[120px] md:h-[100px] p-0
                          ${isPastSlot(day, timeSlot) && !slot ? 'bg-gray-300 cursor-not-allowed opacity-60' : 'cursor-pointer'}
                          ${isToday ? 'bg-green-50 border-l-2 border-green-400' : ''}
                          ${slotStatus === 'completed' ? 'bg-green-600 text-white font-bold' : ''}
                          ${slotStatus === 'booked' ? 'bg-yellow-400 text-white font-bold' : ''}
                          ${slotStatus === 'created' ? 'bg-blue-400 text-white font-bold' : ''}`}
                        onClick={() => handleSlotClick(day, timeSlot)}
                      >
                        <div className="flex items-center justify-center h-full w-full min-h-[60px] min-w-[80px] md:min-h-[100px] md:min-w-[120px]">
                          {slotStatus === 'completed' && <span>hoàn thành</span>}
                          {slotStatus === 'booked' && <span>đã đặt</span>}
                          {slotStatus === 'created' && <span>chờ đặt</span>}
                          {!slot && !isPastSlot(day, timeSlot) && <span className="text-2xl text-green-500 font-bold">+</span>}
                          {isPastSlot(day, timeSlot) && !slot && <span className="text-gray-500 text-sm">Đã qua</span>}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Confirm Modal */}
      {confirmData && (
        <ConfirmModal
          onConfirm={(data) => {
            if (confirmData.slot) {
              handleConfirm(data, 'update', confirmData.slot._id);
            } else {
              handleConfirm(data, 'create');
            }
          }}
          onDelete={confirmData.slot ? () => handleConfirm({}, 'delete', confirmData.slot._id) : undefined}
          onCancel={handleCancel}
          time={confirmData.timeSlot?.display || ''}
          date={confirmData.day}
          defaultValues={confirmData.slot ? {
            appointmentType: confirmData.slot.appointmentType,
            notes: confirmData.slot.notes,
            meetingLink: confirmData.slot.meetingLink,
          } : undefined}
        />
      )}

      {/* Modal chi tiết lịch đã đặt */}
      {detailModal && (
        <DoctorScheduleDetailModal
          slot={detailModal}
          onClose={() => setDetailModal(null)}
        />
      )}
    </>
  );
};

export default DoctorScheduleTable;
