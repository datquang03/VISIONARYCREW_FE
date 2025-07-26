// components/DoctorDropdown.jsx
import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { motion } from 'framer-motion';

const DoctorDropdown = ({ doctors, selectedDoctor, showDropdown, setShowDropdown, onSelectDoctor }) => {
  return (
    <div className="relative w-full md:w-[500px] doctor-dropdown z-50 mb-4 mt-10">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-full bg-white text-black font-medium py-2 px-4 rounded shadow-md border border-gray-300 flex items-center justify-between hover:border-blue-400 transition-all duration-300 cursor-pointer"
      >
        {selectedDoctor ? `Bác sĩ: ${selectedDoctor.fullName || selectedDoctor.name || 'Không rõ tên'}` : 'Chọn bác sĩ'}
        <FaChevronDown />
      </button>
      {showDropdown && (
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 w-full mt-1 bg-white text-black rounded shadow-md border border-gray-200 max-h-60 overflow-y-auto scroll-bar-hidden"
        >
          {doctors.length === 0 && (
            <li className="px-4 py-2 text-gray-400">Không có bác sĩ nào</li>
          )}
          {doctors.map((doc, idx) => (
            <li
              key={doc?._id || idx}
              onClick={() => doc && typeof doc === 'object' && doc._id && onSelectDoctor(doc)}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer border-b border-gray-100 text-base font-medium"
            >
              {doc && typeof doc === 'object' ? `Bác sĩ: ${doc.fullName || doc.name || 'Không rõ tên'}` : JSON.stringify(doc)}
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default DoctorDropdown;