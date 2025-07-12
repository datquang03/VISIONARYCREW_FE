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
        {selectedDoctor ? `${selectedDoctor.name} - ${selectedDoctor.specialty}` : 'Chọn bác sĩ'}
        <FaChevronDown />
      </button>
      {showDropdown && (
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 w-full mt-1 bg-white text-black rounded shadow-md border border-gray-200 max-h-60 overflow-y-auto scroll-bar-hidden"
        >
          {doctors.map((doc) => (
            <li
              key={doc.id}
              onClick={() => onSelectDoctor(doc)}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer border-b border-gray-100 "
            >
              {`${doc.name} - ${doc.specialty}`}
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default DoctorDropdown;