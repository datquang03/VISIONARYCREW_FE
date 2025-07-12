import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import DefaultLayout from '../../components/layout/defaulLayout';
import DoctorWeekNavigation from './components/DoctorWeekNavigation';
import DoctorScheduleTable from './components/DoctorScheduleTable';


const DoctorSchedule = () => {
  const [currentUser] = useState({
    id: 2, // ID giả định cho bác sĩ hiện tại
    name: 'BS. Trần Văn Hùng',
    role: 'doctor',
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);

  const timeSlots = [
    '09AM - 10AM', '10AM - 11AM', '11AM - 12PM', '12PM - 01PM',
    '01PM - 02PM', '02PM - 03PM', '03PM - 04PM', '04PM - 05PM'
  ];

  const formatDate = (date) => date.toISOString().split('T')[0];

  const getDaysOfWeek = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  const isSlotAvailable = (doctorId, date, time) => {
    const dateStr = formatDate(date);
    return availableSlots.some(slot =>
      slot.doctorId === doctorId && slot.date === dateStr && slot.time === time
    );
  };

  const handleCreateAvailableSlot = (doctorId, date, time) => {
    const dateStr = formatDate(date);
    const isConflict = availableSlots.some(slot =>
      slot.doctorId === doctorId && slot.date === dateStr && slot.time === time
    );
    if (isConflict) return;

    setAvailableSlots(prev => [...prev, {
      id: Date.now(), doctorId, date: dateStr, time
    }]);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + direction * 7);
    setSelectedDate(newDate);
  };

  useEffect(() => {
    gsap.from('.doctor-week', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power2.out'
    });
  }, [selectedDate]);

  return (
    <DefaultLayout>
      <div className="p-6 md:p-10 min-h-screen text-black scroll-bar-hidden overflow-x-auto mt-10">
        <DoctorWeekNavigation
          selectedDate={selectedDate}
          navigateWeek={navigateWeek}
        />
        <DoctorScheduleTable
          currentUser={currentUser}
          selectedDate={selectedDate}
          timeSlots={timeSlots}
          getDaysOfWeek={getDaysOfWeek}
          isSlotAvailable={isSlotAvailable}
          handleCreateAvailableSlot={handleCreateAvailableSlot}
        />
      </div>
    </DefaultLayout>
  );
};

export default DoctorSchedule;
