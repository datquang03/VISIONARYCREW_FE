// components/DoctorWeekNavigation.jsx
import React from 'react';

const DoctorWeekNavigation = ({ selectedDate, navigateWeek }) => {
  const formatRange = (date) => {
    const start = new Date(date);
    const end = new Date(date);
    start.setDate(start.getDate() - start.getDay() + 1);
    end.setDate(start.getDate() + 6);
    return `${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}`;
  };

  return (
    <div className="flex justify-between items-center mb-6 bg-white px-4 py-3 rounded-xl shadow border border-gray-300">
      <button
        onClick={() => navigateWeek(-1)}
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-800 font-semibold transition duration-200 cursor-pointer"
      >
        ← Tuần trước
      </button>

      <div className="font-semibold text-gray-800 text-lg">
        Tuần: {formatRange(selectedDate)}
      </div>

      <button
        onClick={() => navigateWeek(1)}
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-800 font-semibold transition duration-200 cursor-pointer"
      >
        Tuần sau →
      </button>
    </div>
  );
};

export default DoctorWeekNavigation;
