import React from 'react';
import { motion } from 'framer-motion';

const ScheduleTable = ({
  currentUser,
  selectedDoctor,
  selectedDate,
  timeSlots,
  getDaysOfWeek,
  getSlotStatus,
  handleSlotClick
}) => {
  const todayStr = new Date().toDateString();
  const days = getDaysOfWeek();

  return (
    <>
      {/* Desktop version */}
      <motion.div
        className="hidden md:block overflow-x-auto scroll-bar-hidden bg-white rounded shadow-md border border-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {selectedDoctor && (
          <div className="bg-green-100 text-black font-semibold text-lg px-4 py-3 border-b border-green-300">
            Lịch của {selectedDoctor.name}
          </div>
        )}
        <table className="w-full text-center">
          <thead>
            <tr className="bg-gray-100 text-sm">
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
                  const status = selectedDoctor ? getSlotStatus(selectedDoctor.id, day, time) : 'empty';
                  const isToday = day.toDateString() === todayStr;
                  const statusClass =
                    status === 'booked'
                      ? 'bg-red-200'
                      : status === 'available'
                      ? 'bg-green-300 hover:bg-green-400'
                      : 'hover:bg-gray-100';

                  return (
                    <td
                      key={colIdx}
                      className={`border h-16 cursor-pointer transition duration-200 ${statusClass} ${
                        isToday ? 'bg-green-50 border-l-2 border-green-400' : ''
                      }`}
                      onClick={() =>
                        selectedDoctor && handleSlotClick(selectedDoctor.id, day, time)
                      }
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Mobile version */}
      <motion.div
        className="md:hidden mt-4 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {days.map((day, i) => {
          const isToday = day.toDateString() === todayStr;
          return (
            <div
              key={i}
              className={`rounded-xl shadow border overflow-hidden ${
                isToday ? 'border-green-500 bg-green-50' : 'bg-white'
              }`}
            >
              <div className="bg-gray-100 p-3 border-b font-semibold text-sm text-gray-800">
                {`Thứ ${day.getDay() === 0 ? 7 : day.getDay()}`} - {day.getDate()}/{day.getMonth() + 1}
                {isToday && <span className="text-green-600 ml-2">(Hôm nay)</span>}
              </div>

              <div className="divide-y text-sm">
                {timeSlots.map((time, j) => {
                  const status = selectedDoctor ? getSlotStatus(selectedDoctor.id, day, time) : 'empty';
                  let bgClass = 'bg-white';
                  let text = '';
                  if (status === 'booked') {
                    bgClass = 'bg-red-200 text-red-700';
                    text = 'Đã đặt';
                  } else if (status === 'available') {
                    bgClass = 'bg-green-200 text-green-800 hover:bg-green-300';
                    text = 'Có thể đặt';
                  } else {
                    bgClass = 'hover:bg-gray-100 text-gray-500';
                    text = currentUser.role === 'doctor' ? 'Tạo slot (+)' : 'Trống';
                  }

                  return (
                    <button
                      key={j}
                      className={`w-full text-left px-4 py-3 ${bgClass} transition-all`}
                      onClick={() => selectedDoctor && handleSlotClick(selectedDoctor.id, day, time)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{time}</span>
                        <span className="text-sm">{text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </motion.div>
    </>
  );
};

export default ScheduleTable;
