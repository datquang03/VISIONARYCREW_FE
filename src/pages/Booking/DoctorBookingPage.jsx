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

  const timeSlots = [
    '09AM - 10AM', '10AM - 11AM', '11AM - 12PM', '12PM - 01PM',
    '01PM - 02PM', '02PM - 03PM', '03PM - 04PM', '04PM - 05PM'
  ];

  const formatDate = (date) => date.toISOString().split('T')[0];

  // So sánh slot đúng theo date, startTime, endTime
  const isSlotAvailable = (doctorId, date, time) => {
    const dateStr = formatDate(date);
    const [start, end] = time.split(' - ');
    // Chuyển về dạng HH:mm
    const parseTime = (t) => {
      let [h, m] = t.replace('AM', '').replace('PM', '').trim().split(':');
      if (!m) m = '00';
      h = h.padStart(2, '0');
      return `${h}:${m}`;
    };
    const startTime = parseTime(start);
    const endTime = parseTime(end);
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

  // Hàm kiểm tra slot quá khứ (dùng cho ScheduleTable, check cả giờ)
  const isPastSlot = (date, time) => {
    const now = new Date();
    const slotDate = new Date(date);
    const [start, end] = time.split(' - ');
    let [endHour, endMin] = end.replace('AM', '').replace('PM', '').trim().split(':');
    if (!endMin) endMin = '00';
    endHour = parseInt(endHour);
    endMin = parseInt(endMin);
    if (end.includes('PM') && endHour < 12) endHour += 12;
    slotDate.setHours(endHour, endMin, 0, 0);
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
          isPastSlot={isPastSlot}
        />
      </div>
    </DefaultLayout>
  );
};

export default DoctorSchedule;
