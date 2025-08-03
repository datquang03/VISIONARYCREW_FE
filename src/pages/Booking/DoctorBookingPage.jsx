import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import DefaultLayout from '../../components/layout/defaulLayout';
import DoctorWeekNavigation from './components/DoctorWeekNavigation';
import DoctorScheduleTable from './components/DoctorScheduleTable';
import { useDispatch, useSelector } from 'react-redux';
import { getMySchedules } from '../../redux/APIs/slices/scheduleSlice';


const DoctorSchedule = () => {
  const [currentUser] = useState({
    id: 2, // ID giả định cho bác sĩ hiện tại
    name: 'BS. Trần Văn Hùng',
    role: 'doctor',
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const dispatch = useDispatch();
  const { mySchedules } = useSelector(state => state.scheduleSlice);

  useEffect(() => {
    dispatch(getMySchedules());
  }, [dispatch]);

  // Time slots theo format HH:mm như trong backend
  const timeSlots = [
    { startTime: '09:00', endTime: '10:00', display: '09:00 - 10:00' },
    { startTime: '10:00', endTime: '11:00', display: '10:00 - 11:00' },
    { startTime: '11:00', endTime: '12:00', display: '11:00 - 12:00' },
    { startTime: '12:00', endTime: '13:00', display: '12:00 - 13:00' },
    { startTime: '13:00', endTime: '14:00', display: '13:00 - 14:00' },
    { startTime: '14:00', endTime: '15:00', display: '14:00 - 15:00' },
    { startTime: '15:00', endTime: '16:00', display: '15:00 - 16:00' },
    { startTime: '16:00', endTime: '17:00', display: '16:00 - 17:00' }
  ];

  const formatDate = (date) => date.toISOString().split('T')[0];

  // So sánh slot đúng theo date, startTime, endTime với format HH:mm
  const isSlotAvailable = (doctorId, date, timeSlot) => {
    const dateStr = formatDate(date);
    const { startTime, endTime } = timeSlot;
    
    // Check slot quá khứ theo giờ
    const now = new Date();
    const slotDate = new Date(date);
    const [endHour, endMin] = endTime.split(':');
    slotDate.setHours(Number(endHour), Number(endMin), 0, 0);
    if (slotDate < now) return false;
    
    return mySchedules?.some(slot =>
      slot.date?.slice(0, 10) === dateStr &&
      slot.timeSlot?.startTime === startTime &&
      slot.timeSlot?.endTime === endTime
    );
  };

  // Hàm kiểm tra slot đã completed
  const isSlotCompleted = (doctorId, date, timeSlot) => {
    const dateStr = formatDate(date);
    const { startTime, endTime } = timeSlot;
    
    return mySchedules?.some(slot =>
      slot.date?.slice(0, 10) === dateStr &&
      slot.timeSlot?.startTime === startTime &&
      slot.timeSlot?.endTime === endTime &&
      slot.status === 'completed'
    );
  };

  // Hàm kiểm tra slot quá khứ (dùng cho ScheduleTable, check cả giờ)
  const isPastSlot = (date, timeSlot) => {
    const now = new Date();
    const slotDate = new Date(date);
    const { endTime } = timeSlot;
    const [endHour, endMin] = endTime.split(':');
    slotDate.setHours(Number(endHour), Number(endMin), 0, 0);
    return slotDate < now;
  };

  const getDaysOfWeek = () => {
    // Đảm bảo tuần bắt đầu từ Thứ 2 (Monday)
    const startOfWeek = new Date(selectedDate);
    const dayOfWeek = startOfWeek.getDay();
    // Nếu là Chủ nhật (0), lùi về thứ 2 tuần trước
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
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
          isSlotCompleted={isSlotCompleted}
          isPastSlot={isPastSlot}
        />
      </div>
    </DefaultLayout>
  );
};

export default DoctorSchedule;
