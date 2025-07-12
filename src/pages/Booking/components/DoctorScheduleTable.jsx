// components/DoctorScheduleTable.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ConfirmModal } from '../../../components/modal/ConfirmModal';

const DoctorScheduleTable = ({
  currentUser,
  selectedDate,
  timeSlots,
  getDaysOfWeek,
  isSlotAvailable,
  handleCreateAvailableSlot,
}) => {
  const days = getDaysOfWeek();
  const todayStr = new Date().toDateString();
  const [confirmData, setConfirmData] = useState(null);

  const handleSlotClick = (day, time) => {
    if (!isSlotAvailable(currentUser.id, day, time)) {
      setConfirmData({ day, time });
    }
  };

  const handleConfirm = () => {
    handleCreateAvailableSlot(currentUser.id, confirmData.day, confirmData.time);
    setConfirmData(null);
  };

  const handleCancel = () => {
    setConfirmData(null);
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
        <div className="md:hidden divide-y divide-gray-200">
          {timeSlots.map((time, rowIdx) => (
            <div key={rowIdx} className="p-4">
              <div className="font-semibold text-gray-800 mb-2">{time}</div>
              <div className="grid grid-cols-4 gap-2 text-sm">
                {days.map((day, i) => {
                  const isAvailable = isSlotAvailable(currentUser.id, day, time);
                  const isToday = day.toDateString() === todayStr;
                  return (
                    <div
                      key={i}
                      onClick={() => handleSlotClick(day, time)}
                      className={`rounded-lg p-2 text-center cursor-pointer border transition duration-200
                        ${isAvailable ? 'bg-green-300 text-black' : 'bg-gray-100 hover:bg-gray-200'}
                        ${isToday ? 'ring-2 ring-green-400' : ''}`}
                    >
                      <div className="font-bold">T{(day.getDay() || 7)}</div>
                      <div className="text-xs">{`${day.getDate()}/${day.getMonth() + 1}`}</div>
                      <div className="mt-1">{isAvailable ? '✓' : '+'}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full text-center">
            <thead>
              <tr className="bg-gray-100 text-gray-800">
                <th className="p-2 border">Giờ</th>
                {days.map((day, i) => (
                  <th
                    key={i}
                    className={`p-2 border ${day.toDateString() === todayStr ? 'bg-green-100 text-green-700' : ''}`}
                  >
                    {`T${(day.getDay() || 7)}`}<br />
                    {`${day.getDate()}/${day.getMonth() + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time, rowIdx) => (
                <tr key={rowIdx}>
                  <td className="border p-2 font-medium text-gray-700 bg-gray-50">{time}</td>
                  {days.map((day, colIdx) => {
                    const isAvailable = isSlotAvailable(currentUser.id, day, time);
                    const isToday = day.toDateString() === todayStr;
                    return (
                      <td
                        key={colIdx}
                        className={`border h-16 cursor-pointer transition duration-200
                          ${isAvailable ? 'bg-green-300 text-black' : 'hover:bg-gray-100'}
                          ${isToday ? 'bg-green-50 border-l-2 border-green-400' : ''}`}
                        onClick={() => handleSlotClick(day, time)}
                      >
                        {isAvailable ? '✓' : '+'}
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
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          time={confirmData.time}
          date={confirmData.day}
        />
      )}
    </>
  );
};

export default DoctorScheduleTable;
