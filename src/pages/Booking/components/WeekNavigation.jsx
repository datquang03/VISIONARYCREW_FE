// components/WeekNavigation.jsx
import React from 'react';
import { motion } from 'framer-motion';

const WeekNavigation = ({ selectedDate, navigateWeek }) => {
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  const format = (date) => `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  return (
    <motion.div
      className="flex items-center justify-end bg-green-100 p-3 mb-4 rounded shadow-sm border border-green-200"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button
        onClick={() => navigateWeek(-1)}
        className="bg-white border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 mr-4"
      >
        ← Trước
      </button>
      <span className="text-md font-medium mr-4">
        Tuần: {format(startOfWeek)} - {format(endOfWeek)}
      </span>
      <button
        onClick={() => navigateWeek(1)}
        className="bg-white border border-gray-300 px-3 py-1 rounded hover:bg-gray-100"
      >
        Sau →
      </button>
    </motion.div>
  );
};

export default WeekNavigation;
