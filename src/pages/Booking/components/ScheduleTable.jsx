import React from 'react';
import { motion } from 'framer-motion';

const ScheduleTable = ({
  currentUser,
  selectedDoctor,
  timeSlots,
  getDaysOfWeek,
  getSlotStatus,
  handleSlotClick,
  isPastSlot,
  onSlotDetail,
  doctorSchedules
}) => {
  const now = new Date(); 
  const todayStr = now.toDateString();

  const days = getDaysOfWeek();

  const handleSlotDetail = (slot) => {
    if (typeof onSlotDetail === 'function') onSlotDetail(slot);
  };

  // Helper function to check if a slot is in the past, including time on the current day
  const isSlotPast = (day, time) => {
    // Debug: Log inputs to verify day and time
    console.log(`Checking slot: Day=${day.toISOString()}, Time=${time}, Now=${now.toISOString()}`);

    // Check if day is before today
    const isPastDay = isPastSlot ? isPastSlot(day, time) : day < new Date(todayStr);
    if (isPastDay) {
      console.log(`Slot is past: Past day detected`);
      return true;
    }

    // If it's today, check the time
    if (day.toDateString() === todayStr) {
      try {
        const [start] = time.split(' - ');
        const parseTime = (t) => {
          let [h, m] = t.replace('AM', '').replace('PM', '').trim().split(':');
          if (!m) m = '00';
          h = parseInt(h, 10);
          if (isNaN(h)) throw new Error(`Invalid hour in time: ${t}`);
          if (t.includes('PM') && h !== 12) h += 12;
          if (t.includes('AM') && h === 12) h = 0;
          return new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, parseInt(m, 10));
        };
        const slotTime = parseTime(start);
        const isPast = slotTime < now;
        console.log(`Today slot: Time=${start}, Parsed=${slotTime.toISOString()}, IsPast=${isPast}`);
        return isPast;
      } catch (error) {
        console.error(`Error parsing time '${time}':`, error);
        return false; // Fallback to not past if parsing fails
      }
    }
    return false;
  };

  return (
    <>
      {/* Desktop version */}
      <motion.div
        className="hidden md:block overflow-x-auto scroll-bar-hidden bg-white rounded shadow-md border border-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <table className="w-full text-center min-w-[1050px]">
          <thead>
            <tr className="bg-gray-100 text-gray-800 text-xs md:text-base">
              <th className="p-1 border w-[90px] md:w-[120px] text-xs md:text-base">Giờ</th>
              {days.map((day, i) => (
                <th
                  key={i}
                  className={`p-1 md:p-2 border w-[60px] md:w-[100px] ${day.toDateString() === todayStr ? 'bg-green-100 text-green-700' : ''}`}
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
                <td className="border p-1 md:p-2 font-medium text-gray-700 bg-gray-50 w-[90px] md:w-[120px] text-xs md:text-base">{time}</td>
                {days.map((day, colIdx) => {
                  let slotObj = null;
                  let status = 'empty';
                  if (selectedDoctor && Array.isArray(doctorSchedules)) {
                    const dateStr = day.toISOString().slice(0, 10);
                    const [start, end] = time.split(' - ');
                    const parseTime = (t) => {
                      let [h, m] = t.replace('AM', '').replace('PM', '').trim().split(':');
                      if (!m) m = '00';
                      h = h.padStart(2, '0');
                      return `${h}:${m}`;
                    };
                    const startTime = parseTime(start);
                    const endTime = parseTime(end);
                    slotObj = doctorSchedules.find(slot =>
                      slot.date?.slice(0, 10) === dateStr &&
                      slot.timeSlot?.startTime === startTime &&
                      slot.timeSlot?.endTime === endTime
                    );
                    if (slotObj) {
                      if (slotObj.patient) {
                        if (String(slotObj.patient) === String(currentUser?._id || currentUser?.id)) {
                          status = 'booked-by-user';
                        } else {
                          status = 'booked-by-other';
                        }
                      } else {
                        status = 'doctor-free';
                      }
                    }
                  } else {
                    status = selectedDoctor ? getSlotStatus(selectedDoctor.id, day, time) : 'empty';
                  }
                  const isToday = day.toDateString() === todayStr;
                  let statusClass = 'hover:bg-gray-100';
                  let cellText = '';
                  const past = isSlotPast(day, time);
                  
                  // Debug: Log slot status and past state
                  console.log(`Slot: Day=${day.toISOString().slice(0, 10)}, Time=${time}, Status=${status}, Past=${past}`);
                  
                  // Xác định status trước
                  if (status === 'booked-by-user') {
                    statusClass = 'bg-yellow-400 text-white font-bold';
                    cellText = 'Đã đặt';
                  } else if (status === 'booked-by-other') {
                    statusClass = 'bg-red-500 text-white font-bold';
                    cellText = 'Đã đặt';
                  } else if (status === 'available') {
                    statusClass = 'bg-green-300 hover:bg-green-400';
                  } else if (status === 'doctor-free') {
                    statusClass = 'bg-green-500 text-white font-bold';
                    cellText = 'Trống';
                  }
                  
                  // Grey out past slots (except those booked by user)
                  if (past && status !== 'booked-by-user') {
                    statusClass = 'bg-gray-400 text-white cursor-not-allowed';
                    cellText = '';
                  }

                  return (
                    <td
                      key={colIdx}
                      className={`border transition duration-200 align-middle w-[80px] h-[60px] md:w-[120px] md:h-[100px] p-0 cursor-pointer ${statusClass} ${
                        isToday ? 'bg-green-50 border-l-2 border-green-400' : ''
                      }`}
                      onClick={() => {
                        if (selectedDoctor) {
                          if (status === 'booked-by-user' && slotObj) {
                            handleSlotDetail({ ...slotObj, slotType: status });
                          } else if ((status === 'doctor-free' || status === 'available') && slotObj && !past) {
                            handleSlotDetail({ ...slotObj, slotType: status });
                          } else if (!past) {
                            handleSlotClick(selectedDoctor.id, day, time);
                          }
                        }
                      }}
                    >
                      <div className="flex items-center justify-center h-full w-full min-h-[60px] min-w-[80px] md:min-h-[100px] md:min-w-[120px]">
                        {cellText}
                      </div>
                    </td>
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
                  let slotObj = null;
                  let status = 'empty';
                  if (selectedDoctor && Array.isArray(doctorSchedules)) {
                    const dateStr = day.toISOString().slice(0, 10);
                    const [start, end] = time.split(' - ');
                    const parseTime = (t) => {
                      let [h, m] = t.replace('AM', '').replace('PM', '').trim().split(':');
                      if (!m) m = '00';
                      h = h.padStart(2, '0');
                      return `${h}:${m}`;
                    };
                    const startTime = parseTime(start);
                    const endTime = parseTime(end);
                    slotObj = doctorSchedules.find(slot =>
                      slot.date?.slice(0, 10) === dateStr &&
                      slot.timeSlot?.startTime === startTime &&
                      slot.timeSlot?.endTime === endTime
                    );
                    if (slotObj) {
                      if (slotObj.patient) {
                        if (String(slotObj.patient) === String(currentUser?._id || currentUser?.id)) {
                          status = 'booked-by-user';
                        } else {
                          status = 'booked-by-other';
                        }
                      } else {
                        status = 'doctor-free';
                      }
                    }
                  } else {
                    status = selectedDoctor ? getSlotStatus(selectedDoctor.id, day, time) : 'empty';
                  }
                  let bgClass = 'bg-white';
                  let text = '';
                  const pastMobile = isSlotPast(day, time);
                  
                  // Debug: Log slot status and past state
                  console.log(`Mobile Slot: Day=${day.toISOString().slice(0, 10)}, Time=${time}, Status=${status}, Past=${pastMobile}`);
                  
                  // Xác định status trước
                  if (status === 'booked-by-user') {
                    bgClass = 'bg-yellow-400 text-white font-bold';
                    text = 'Đã đặt';
                  } else if (status === 'booked-by-other') {
                    bgClass = 'bg-red-500 text-white font-bold';
                    text = 'Đã đặt';
                  } else if (status === 'available') {
                    bgClass = 'bg-green-200 text-green-800 hover:bg-green-300';
                    text = 'Có thể đặt';
                  } else if (status === 'doctor-free') {
                    bgClass = 'bg-green-500 text-white font-bold';
                    text = 'Trống';
                  } else {
                    bgClass = 'hover:bg-gray-100 text-gray-500';
                    text = currentUser.role === 'doctor' ? 'Tạo slot (+)' : 'Trống';
                  }
                  
                  // Grey out past slots (except those booked by user)
                  if (pastMobile && status !== 'booked-by-user') {
                    bgClass = 'bg-gray-400 text-white cursor-not-allowed';
                    text = '';
                  }

                  return (
                    <button
                      key={j}
                      className={`w-full text-left px-4 py-3 ${bgClass} transition-all`}
                      onClick={() => {
                        if (selectedDoctor) {
                          if (status === 'booked-by-user' && slotObj) {
                            handleSlotDetail({ ...slotObj, slotType: status });
                          } else if ((status === 'doctor-free' || status === 'available') && slotObj && !pastMobile) {
                            handleSlotDetail({ ...slotObj, slotType: status });
                          } else if (!pastMobile) {
                            handleSlotClick(selectedDoctor.id, day, time);
                          }
                        }
                      }}
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