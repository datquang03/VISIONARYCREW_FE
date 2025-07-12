// HealthcareBookingSystem.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import DefaultLayout from '../../components/layout/defaulLayout';
import DoctorDropdown from './components/DoctorDropdown';
import WeekNavigation from './components/WeekNavigation';
import ScheduleTable from './components/ScheduleTable';

const HealthcareBookingSystem = () => {
  const navigate = useNavigate();
  const today = new Date();

  const [currentUser] = useState({
    id: 1,
    name: 'Nguyễn Văn A',
    role: 'user',
    email: 'nguyenvana@email.com',
    avatar: null
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  const doctors = [
    { id: 1, name: 'BS. Nguyễn Thị Lan', specialty: 'Nội khoa' },
    { id: 2, name: 'BS. Trần Văn Hùng', specialty: 'Ngoại khoa' },
    { id: 3, name: 'BS. Lê Minh Tuấn', specialty: 'Tim mạch' },
    { id: 4, name: 'BS. Phạm Thị Hoa', specialty: 'Sản khoa' }
  ];

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

  const isSlotBooked = (doctorId, date, time) => {
    const dateStr = formatDate(date);
    return appointments.some(app =>
      app.doctorId === doctorId && app.date === dateStr && app.time === time
    );
  };

  const handleCreateAvailableSlot = (doctorId, date, time) => {
    const dateStr = formatDate(date);
    const isConflict = availableSlots.some(slot =>
      slot.doctorId !== doctorId && slot.date === dateStr && slot.time === time
    );
    if (isConflict) {
      alert('Thời gian này đã có bác sĩ khác đăng ký!');
      return;
    }
    setAvailableSlots(prev => [...prev, {
      id: Date.now(), doctorId, date: dateStr, time
    }]);
  };

  const handleBookAppointment = (doctorId, date, time) => {
    const dateStr = formatDate(date);
    setAppointments(prev => [...prev, {
      id: Date.now(),
      doctorId,
      patientId: currentUser.id,
      patientName: currentUser.name,
      date: dateStr,
      time,
      status: 'pending'
    }]);
  };

  const handleSlotClick = (doctorId, date, time) => {
    if (currentUser.role === 'doctor' && currentUser.id === doctorId) {
      if (!isSlotAvailable(doctorId, date, time) && !isSlotBooked(doctorId, date, time)) {
        handleCreateAvailableSlot(doctorId, date, time);
      }
    } else if (currentUser.role === 'user') {
      if (isSlotAvailable(doctorId, date, time) && !isSlotBooked(doctorId, date, time)) {
        handleBookAppointment(doctorId, date, time);
      }
    }
  };

  const getSlotStatus = (doctorId, date, time) => {
    if (isSlotBooked(doctorId, date, time)) return 'booked';
    if (isSlotAvailable(doctorId, date, time)) return 'available';
    return 'empty';
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + direction * 7);
    setSelectedDate(newDate);
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorDropdown(false);
  };

  const displayDoctors = currentUser.role === 'doctor'
    ? doctors.filter(doc => doc.id === currentUser.id)
    : selectedDoctor ? [selectedDoctor] : doctors;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showDoctorDropdown && !e.target.closest('.doctor-dropdown')) {
        setShowDoctorDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDoctorDropdown]);

  useEffect(() => {
    gsap.from('.week-fade', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power2.out'
    });
  }, [selectedDate]);

  return (
    <DefaultLayout>
      <div className="p-6 md:p-10 min-h-screen text-black scroll-bar-hidden overflow-x-auto">
        <DoctorDropdown
          doctors={doctors}
          selectedDoctor={selectedDoctor}
          showDropdown={showDoctorDropdown}
          setShowDropdown={setShowDoctorDropdown}
          onSelectDoctor={handleSelectDoctor}
        />

        <WeekNavigation
          selectedDate={selectedDate}
          navigateWeek={navigateWeek}
        />

        <ScheduleTable
          currentUser={currentUser}
          selectedDoctor={selectedDoctor}
          selectedDate={selectedDate}
          timeSlots={timeSlots}
          getDaysOfWeek={getDaysOfWeek}
          getSlotStatus={getSlotStatus}
          handleSlotClick={handleSlotClick}
        />
      </div>
    </DefaultLayout>
  );
};

export default HealthcareBookingSystem;
