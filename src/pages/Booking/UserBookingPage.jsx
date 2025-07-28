// HealthcareBookingSystem.jsx
import React, { useState, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import DefaultLayout from '../../components/layout/defaulLayout';
import DoctorDropdown from './components/DoctorDropdown';
import WeekNavigation from './components/WeekNavigation';
import ScheduleTable from './components/ScheduleTable';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctors } from '../../redux/APIs/slices/doctorSlice';
import { getDoctorSchedules, registerSchedule, cancelRegisteredSchedule } from '../../redux/APIs/slices/scheduleSlice';
import { ConfirmModal } from '../../components/modal/ConfirmModal';
import { CustomToast } from '../../components/Toast/CustomToast';
import UserScheduleDetailModal from '../../components/modal/UserScheduleDetailModal';


const HealthcareBookingSystem = () => {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const { doctors: doctorList } = useSelector(state => state.doctorSlice);
  // Chỉ lấy đúng mảng object bác sĩ (doctorList[1])
  const doctors = Array.isArray(doctorList?.doctors) ? doctorList.doctors : [];
  const { doctorSchedules = [] } = useSelector(state => state.scheduleSlice);
  const { registerLoading, cancelLoading } = useSelector(state => state.scheduleSlice);
  const { createLoading: notificationCreateLoading } = useSelector(state => state.notification);
  const currentUser = useSelector(state => state.authSlice.user);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotDetail, setSlotDetail] = useState(null);


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

  const isSlotAvailable = (doctorId, date, timeSlot) => {
    const dateStr = formatDate(date);
    return availableSlots.some(slot =>
      slot.doctorId === doctorId && slot.date === dateStr && 
      slot.time === timeSlot.display
    );
  };

  const isSlotBooked = (doctorId, date, timeSlot) => {
    const dateStr = formatDate(date);
    return appointments.some(app =>
      app.doctorId === doctorId && app.date === dateStr && app.time === timeSlot.display
    );
  };

  const handleCreateAvailableSlot = (doctorId, date, timeSlot) => {
    const dateStr = formatDate(date);
    const isConflict = availableSlots.some(slot =>
      slot.doctorId !== doctorId && slot.date === dateStr && slot.time === timeSlot.display
    );
    if (isConflict) {
      alert('Thời gian này đã có bác sĩ khác đăng ký!');
      return;
    }
    setAvailableSlots(prev => [...prev, {
      id: Date.now(), doctorId, date: dateStr, time: timeSlot.display
    }]);
  };

  const handleBookAppointment = (doctorId, date, timeSlot) => {
    const dateStr = formatDate(date);
    setAppointments(prev => [...prev, {
      id: Date.now(),
      doctorId,
      patientId: currentUser.id,
      patientName: currentUser.name,
      date: dateStr,
      time: timeSlot.display,
      status: 'pending'
    }]);
  };

  const handleSlotClick = (doctorId, date, timeSlot) => {
    if (currentUser.role === 'doctor' && currentUser.id === doctorId) {
      if (!isSlotAvailable(doctorId, date, timeSlot) && !isSlotBooked(doctorId, date, timeSlot)) {
        handleCreateAvailableSlot(doctorId, date, timeSlot);
      }
    } else if (currentUser.role === 'user') {
      // Kiểm tra xem slot có phải do user hiện tại đăng ký không
      const dateStr = formatDate(date);
      const { startTime, endTime } = timeSlot;
      
      const foundSlot = doctorSchedules.find(slot =>
        slot.date?.slice(0, 10) === dateStr &&
        slot.timeSlot?.startTime === startTime &&
        slot.timeSlot?.endTime === endTime
      );

      if (foundSlot && foundSlot.patient && String(foundSlot.patient) === String(currentUser?.id)) {
        // Nếu slot do user hiện tại đăng ký, hiển thị modal chi tiết
        setSlotDetail(foundSlot);
      } else if (foundSlot && !foundSlot.patient) {
        // Nếu slot còn trống, đăng ký
        handleBookAppointment(doctorId, date, timeSlot);
      }
    }
  };

  const handleSlotDetail = (slot) => {
    setSlotDetail(slot);
  };

  const handleRegister = async (scheduleId) => {
    try {
      await dispatch(registerSchedule(scheduleId)).unwrap();
      CustomToast({ message: 'Đăng ký lịch thành công!', type: 'success' });
      // Notification đã được tạo ở backend, không cần tạo thêm ở frontend
      if (selectedDoctor && selectedDoctor._id) {
        dispatch(getDoctorSchedules({ doctorId: selectedDoctor._id }));
      }
      setSlotDetail(null);
    } catch (err) {
      CustomToast({ message: err?.message || 'Đăng ký lịch thất bại!', type: 'error' });
    }
  };

  const handleCancelBooking = async (scheduleId, cancelReason) => {
    try {
      await dispatch(
        cancelRegisteredSchedule({ scheduleId, cancelReason })
      ).unwrap();
      CustomToast({ message: 'Huỷ lịch thành công!', type: 'success' });
      // Notification đã được tạo ở backend, không cần tạo thêm ở frontend
      if (selectedDoctor && selectedDoctor._id) {
        dispatch(getDoctorSchedules({ doctorId: selectedDoctor._id }));
      }
      setSlotDetail(null);
    } catch (err) {
      CustomToast({ message: err?.message || 'Huỷ lịch thất bại!', type: 'error' });
    }
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + direction * 7);
    setSelectedDate(newDate);
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorDropdown(false);
    if (doctor && doctor._id) {
      dispatch(getDoctorSchedules({ doctorId: doctor._id }));
    }
  };



  useEffect(() => {
    dispatch(getDoctors());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showDoctorDropdown && !e.target.closest('.doctor-dropdown')) {
        setShowDoctorDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDoctorDropdown]);

  return (
    <DefaultLayout>
      <div className="week-fade p-6 md:p-10 min-h-screen text-black scroll-bar-hidden overflow-x-auto">
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

        {selectedDoctor && (
          <div className="flex items-center justify-between mb-2 mt-6">
            <div className="font-bold text-lg border border-green-400 bg-green-50 rounded-lg px-4 py-2 inline-block shadow">
              Lịch của bác sĩ {selectedDoctor.fullName || selectedDoctor.name || selectedDoctor.username}
            </div>

          </div>
        )}

        <ScheduleTable
          currentUser={currentUser || {}}
          selectedDoctor={selectedDoctor}
          selectedDate={selectedDate}
          timeSlots={timeSlots}
          getDaysOfWeek={getDaysOfWeek}
          getSlotStatus={(doctorId, date, timeSlot) => {
            if (Array.isArray(doctorSchedules)) {
              const dateStr = formatDate(date);
              const { startTime, endTime } = timeSlot;
              const found = doctorSchedules.find(slot =>
                slot.date?.slice(0, 10) === dateStr &&
                slot.timeSlot?.startTime === startTime &&
                slot.timeSlot?.endTime === endTime
              );
              if (found) {
                if (found.patient) {
                  if (String(found.patient) === String(currentUser?.id)) {
                    return 'booked-by-user'; // Slot màu vàng cho user đã đăng ký
                  } else {
                    return 'booked-by-other';
                  }
                } else {
                  return 'doctor-free';
                }
              }
            }
            return 'empty';
          }}
          handleSlotClick={handleSlotClick}
          onSlotDetail={handleSlotDetail}
          doctorSchedules={doctorSchedules}
        />
        {slotDetail && (
          <UserScheduleDetailModal
            slot={slotDetail}
            onClose={() => setSlotDetail(null)}
            onRegister={handleRegister}
            onCancelBooking={handleCancelBooking}
            currentUser={currentUser || {}}
            registerLoading={registerLoading}
            cancelLoading={cancelLoading}
            notificationCreateLoading={notificationCreateLoading}
          />
        )}
        

      </div>
    </DefaultLayout>
  );
};

export default HealthcareBookingSystem;
