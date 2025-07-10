import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaUser, FaUserCheck, FaShieldAlt, FaPlus, FaTimes, FaCheck, FaChevronDown, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const HealthcareBookingSystem = () => {
  const navigate = useNavigate();
  
  // Mock data - thay thế bằng thông tin user thực từ context/props
  const [currentUser, setCurrentUser] = useState({ 
    id: 1, 
    name: 'Nguyễn Văn A', 
    role: 'user', // Lấy từ authentication context
    email: 'nguyenvana@email.com',
    avatar: null 
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);

  const doctors = [
    { id: 1, name: 'BS. Nguyễn Thị Lan', specialty: 'Nội khoa' },
    { id: 2, name: 'BS. Trần Văn Hùng', specialty: 'Ngoại khoa' },
    { id: 3, name: 'BS. Lê Minh Tuấn', specialty: 'Tim mạch' },
    { id: 4, name: 'BS. Phạm Thị Hoa', specialty: 'Sản khoa' }
  ];

  const timeSlots = [
    '09AM - 10AM', '10AM - 11AM', '11AM - 12PM', '12PM - 01PM', '01PM - 02PM',
    '02PM - 03PM', '03PM - 04PM', '04PM - 05PM', '05PM - 06PM', '06PM - 07PM',
    '07PM - 08PM', '08PM - 09PM', '09PM - 10PM'
  ];

  const [appointments, setAppointments] = useState([
    { id: 1, doctorId: 1, patientId: 1, patientName: 'Nguyễn Văn A', date: '2025-07-10', time: '10AM - 11AM', status: 'confirmed' },
    { id: 2, doctorId: 2, patientId: 2, patientName: 'Trần Thị B', date: '2025-07-10', time: '11AM - 12PM', status: 'confirmed' },
    { id: 3, doctorId: 1, patientId: 3, patientName: 'Lê Văn C', date: '2025-07-11', time: '02PM - 03PM', status: 'pending' }
  ]);

  const [availableSlots, setAvailableSlots] = useState([
    { id: 1, doctorId: 1, date: '2025-07-10', time: '09AM - 10AM' },
    { id: 2, doctorId: 1, date: '2025-07-10', time: '10AM - 11AM' },
    { id: 3, doctorId: 1, date: '2025-07-10', time: '02PM - 03PM' },
    { id: 4, doctorId: 1, date: '2025-07-10', time: '03PM - 04PM' },
    { id: 5, doctorId: 2, date: '2025-07-10', time: '11AM - 12PM' },
    { id: 6, doctorId: 2, date: '2025-07-10', time: '01PM - 02PM' },
    { id: 7, doctorId: 2, date: '2025-07-10', time: '04PM - 05PM' }
  ]);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getDaysOfWeek = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay() + 1);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getWeekDayName = (date) => {
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    return days[date.getDay()];
  };

  const isSlotAvailable = (doctorId, date, time) => {
    const dateStr = formatDate(date);
    return availableSlots.some(slot => 
      slot.doctorId === doctorId && 
      slot.date === dateStr && 
      slot.time === time
    );
  };

  const isSlotBooked = (doctorId, date, time) => {
    const dateStr = formatDate(date);
    return appointments.some(appointment => 
      appointment.doctorId === doctorId && 
      appointment.date === dateStr && 
      appointment.time === time
    );
  };

  const handleCreateAvailableSlot = (doctorId, date, time) => {
    const dateStr = formatDate(date);
    
    // Check if slot conflicts with other doctors
    const isConflict = availableSlots.some(slot => 
      slot.doctorId !== doctorId && 
      slot.date === dateStr && 
      slot.time === time
    );
    
    if (isConflict) {
      alert('Thời gian này đã có bác sĩ khác đăng ký!');
      return;
    }

    const newSlot = {
      id: Date.now(),
      doctorId,
      date: dateStr,
      time
    };
    
    setAvailableSlots([...availableSlots, newSlot]);
  };

  const handleBookAppointment = (doctorId, date, time) => {
    const dateStr = formatDate(date);
    
    const newAppointment = {
      id: Date.now(),
      doctorId,
      patientId: currentUser.id,
      patientName: currentUser.name,
      date: dateStr,
      time,
      status: 'pending'
    };
    
    setAppointments([...appointments, newAppointment]);
    setShowBookingModal(false);
    setSelectedTimeSlot(null);
  };

  const handleSlotClick = (doctorId, date, time) => {
    if (currentUser.role === 'doctor' && currentUser.id === doctorId) {
      if (!isSlotAvailable(doctorId, date, time) && !isSlotBooked(doctorId, date, time)) {
        handleCreateAvailableSlot(doctorId, date, time);
      }
    } else if (currentUser.role === 'user') {
      if (isSlotAvailable(doctorId, date, time) && !isSlotBooked(doctorId, date, time)) {
        setSelectedTimeSlot({ doctorId, date, time });
        setShowBookingModal(true);
      }
    }
  };

  const getSlotStatus = (doctorId, date, time) => {
    if (isSlotBooked(doctorId, date, time)) {
      return 'booked';
    }
    if (isSlotAvailable(doctorId, date, time)) {
      return 'available';
    }
    return 'empty';
  };

  const getSlotColor = (status) => {
    switch (status) {
      case 'booked': return 'bg-red-100 text-red-800 border-red-300';
      case 'available': return 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200';
      case 'empty': return 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction * 7));
    setSelectedDate(newDate);
  };

  const changeUserRole = (role) => {
    // Loại bỏ function này vì role sẽ được lấy từ authentication
    // Role sẽ được set từ login context/props
    console.log('Role changing is disabled - role comes from authentication');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorDropdown(false);
  };

  const displayDoctors = currentUser.role === 'doctor' 
    ? doctors.filter(doc => doc.id === currentUser.id)
    : (selectedDoctor ? [selectedDoctor] : doctors);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDoctorDropdown && !event.target.closest('.doctor-dropdown')) {
        setShowDoctorDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDoctorDropdown]);

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header với thiết kế mới */}
      <div className="bg-gradient-to-r from-green-600 to-green-500" style={{ color: 'white' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGoHome}
                className="bg-white bg-opacity-30 rounded-full p-3 hover:bg-opacity-40 transition-all"
                title="Về trang chủ"
              >
                <FaHome size={24} style={{ color: 'white' }} />
              </button>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: 'white' }}>Visionary Crew</h1>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Hệ thống đặt lịch khám bệnh</p>
              </div>
            </div>
            
            {/* User Info */}
            <div className="flex items-center space-x-4">
              {/* User Profile Card */}
              <div className="bg-white bg-opacity-30 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    {currentUser.avatar ? (
                      <img 
                        src={currentUser.avatar} 
                        alt={currentUser.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-green-600 font-semibold text-sm">
                        {currentUser.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-sm" style={{ color: 'white' }}>{currentUser.name}</div>
                    <div className="text-xs flex items-center space-x-1" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      {currentUser.role === 'user' && <FaUser size={12} />}
                      {currentUser.role === 'doctor' && <FaUserCheck size={12} />}
                      {currentUser.role === 'admin' && <FaShieldAlt size={12} />}
                      <span>
                        {currentUser.role === 'user' ? 'Bệnh nhân' : 
                         currentUser.role === 'doctor' ? 'Bác sĩ' : 'Admin'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  // Thêm logic logout ở đây
                  console.log('Logout clicked');
                  navigate('/login');
                }}
                className="bg-white bg-opacity-30 hover:bg-opacity-40 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ color: 'white' }}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Doctor Selection cho User và Admin - ComboBox */}
        {currentUser.role !== 'doctor' && (
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-green-100">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaUserCheck size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Chọn bác sĩ</h3>
                  <p className="text-sm text-gray-600">Chọn bác sĩ để xem lịch khám</p>
                </div>
              </div>
              
              {/* ComboBox */}
              <div className="relative max-w-md doctor-dropdown">
                <button
                  onClick={() => setShowDoctorDropdown(!showDoctorDropdown)}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-left focus:outline-none focus:border-blue-500 transition-all hover:border-blue-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {selectedDoctor ? (
                        <>
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {selectedDoctor.name.split(' ').pop().charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{selectedDoctor.name}</div>
                            <div className="text-sm text-gray-600">{selectedDoctor.specialty}</div>
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-700">Chọn bác sĩ...</div>
                      )}
                    </div>
                    <FaChevronDown 
                      size={16} 
                      className={`text-gray-400 transition-transform duration-200 ${
                        showDoctorDropdown ? 'rotate-180' : ''
                      }`} 
                    />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showDoctorDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                    {doctors.map((doctor) => (
                      <button
                        key={doctor.id}
                        onClick={() => handleSelectDoctor(doctor)}
                        className={`w-full p-4 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                          selectedDoctor?.id === doctor.id 
                            ? 'bg-blue-50 border-blue-200' 
                            : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {doctor.name.split(' ').pop().charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{doctor.name}</div>
                            <div className="text-sm text-gray-600">{doctor.specialty}</div>
                          </div>
                          {selectedDoctor?.id === doctor.id && (
                            <FaCheck size={16} className="text-blue-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Calendar Section với thiết kế giống hình */}
        {(currentUser.role === 'doctor' || selectedDoctor || currentUser.role === 'admin') && (
          <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
            {/* Calendar Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6" style={{ color: 'white' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span style={{ color: 'white' }} className="font-bold text-lg">Q</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: 'white' }}>
                      {currentUser.role === 'doctor' 
                        ? currentUser.name 
                        : selectedDoctor?.name || 'Tất cả bác sĩ'}
                    </h2>
                    <p style={{ color: 'white', opacity: 0.9 }}>
                      {currentUser.role === 'doctor' 
                        ? 'Lịch làm việc của bạn' 
                        : selectedDoctor 
                          ? selectedDoctor.specialty 
                          : 'Quản lý lịch hẹn'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-white bg-opacity-30 rounded-lg px-4 py-2">
                    <FaCalendarAlt size={16} style={{ color: 'white' }} />
                    <span className="font-medium" style={{ color: 'white' }}>Hôm nay</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => navigateWeek(-1)}
                      className="w-10 h-10 bg-white bg-opacity-30 rounded-lg flex items-center justify-center hover:bg-opacity-40 transition-all font-bold"
                      style={{ color: 'white' }}
                    >
                      ←
                    </button>
                    <div className="px-4 py-2 bg-white bg-opacity-30 rounded-lg">
                      <span className="font-medium" style={{ color: 'white' }}>07/07 - 14/07/2025</span>
                    </div>
                    <button
                      onClick={() => navigateWeek(1)}
                      className="w-10 h-10 bg-white bg-opacity-30 rounded-lg flex items-center justify-center hover:bg-opacity-40 transition-all font-bold"
                      style={{ color: 'white' }}
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="px-6 py-4 bg-gray-50 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                    <span className="text-gray-700 font-medium">Lịch trống</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                    <span className="text-gray-700 font-medium">Đã đặt lịch</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-400 border border-green-500 rounded"></div>
                    <span className="text-gray-700 font-medium">Có thể đặt</span>
                  </div>
                </div>
                
                {currentUser.role === 'doctor' && (
                  <div className="text-green-600 font-medium text-sm">
                    <FaPlus size={16} className="inline mr-1" />
                    Nhấp vào ô trống để tạo lịch làm việc
                  </div>
                )}
                
                {currentUser.role === 'user' && (
                  <div className="text-blue-600 font-medium text-sm">
                    <FaCalendarAlt size={16} className="inline mr-1" />
                    Nhấp vào ô xanh để đặt lịch khám
                  </div>
                )}
              </div>
            </div>

            {/* Calendar Grid giống như trong hình */}
            <div className="overflow-x-auto">
              {displayDoctors.map((doctor, doctorIndex) => (
                <div key={doctor.id} className={doctorIndex > 0 ? 'border-t-2 border-gray-100' : ''}>
                  {/* Doctor header cho admin view */}
                  {currentUser.role === 'admin' && (
                    <div className="bg-blue-50 border-b">
                      <div className="p-4 flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {doctor.name.split(' ').pop().charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-blue-900">{doctor.name}</div>
                          <div className="text-sm text-blue-700">{doctor.specialty}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Time slot grid header */}
                  <div className="grid grid-cols-8 bg-gray-50 border-b">
                    <div className="p-4 border-r border-gray-200 flex items-center justify-center">
                      <FaClock size={20} className="text-gray-500" />
                    </div>
                    {getDaysOfWeek().map((day, index) => (
                      <div key={index} className="p-4 border-r border-gray-200 last:border-r-0 text-center">
                        <div className="font-semibold text-gray-900">{getWeekDayName(day)}</div>
                        <div className="text-sm text-gray-500 mt-1">{day.getDate()}/{day.getMonth() + 1}</div>
                      </div>
                    ))}
                  </div>

                  {/* Time slots */}
                  {timeSlots.map((timeSlot, timeIndex) => (
                    <div key={timeSlot} className="grid grid-cols-8 border-b border-gray-100 hover:bg-gray-50">
                      <div className="p-4 bg-green-50 border-r border-gray-200 font-semibold text-sm text-green-700">
                        {timeSlot}
                      </div>
                      {getDaysOfWeek().map((day, dayIndex) => {
                        const status = getSlotStatus(doctor.id, day, timeSlot);
                        const appointment = appointments.find(apt => 
                          apt.doctorId === doctor.id && 
                          apt.date === formatDate(day) && 
                          apt.time === timeSlot
                        );
                        
                        let slotClasses = "p-4 border-r border-gray-200 last:border-r-0 cursor-pointer transition-all min-h-[60px] flex items-center justify-center relative";
                        
                        if (status === 'booked') {
                          slotClasses += " bg-green-100 hover:bg-green-150";
                        } else if (status === 'available') {
                          slotClasses += " bg-green-400 hover:bg-green-500 text-white";
                        } else {
                          slotClasses += " bg-gray-50 hover:bg-gray-100";
                        }
                        
                        return (
                          <div
                            key={dayIndex}
                            className={slotClasses}
                            onClick={() => handleSlotClick(doctor.id, day, timeSlot)}
                          >
                            {appointment && (
                              <div className="text-center w-full">
                                <div className="font-medium text-xs text-gray-800 mb-1">
                                  {appointment.patientName}
                                </div>
                                <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                  appointment.status === 'confirmed' 
                                    ? 'bg-green-200 text-green-800' 
                                    : 'bg-yellow-200 text-yellow-800'
                                }`}>
                                  {appointment.status === 'confirmed' ? '✓ Xác nhận' : '⏳ Chờ'}
                                </div>
                              </div>
                            )}
                            {status === 'available' && !appointment && (
                              <div className="text-center">
                                <div className="text-xs font-semibold text-white">
                                  Có thể đặt
                                </div>
                              </div>
                            )}
                            {status === 'empty' && currentUser.role === 'doctor' && currentUser.id === doctor.id && (
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <FaPlus size={20} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal với thiết kế cải tiến */}
      {showBookingModal && selectedTimeSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Đặt lịch khám</h3>
                  <p className="text-green-100 mt-1">Xác nhận thông tin đặt lịch</p>
                </div>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-white hover:text-green-100 transition-colors"
                >
                  <FaTimes size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-green-50 rounded-lg p-4">
                <label className="block text-sm font-semibold text-green-800 mb-2">Bác sĩ</label>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FaUserCheck size={16} className="text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-green-900">
                      {doctors.find(d => d.id === selectedTimeSlot.doctorId)?.name}
                    </div>
                    <div className="text-sm text-green-700">
                      {doctors.find(d => d.id === selectedTimeSlot.doctorId)?.specialty}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <label className="block text-sm font-semibold text-blue-800 mb-2">Thời gian</label>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaClock size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-blue-900">
                      {selectedTimeSlot.date.toLocaleDateString('vi-VN')}
                    </div>
                    <div className="text-sm text-blue-700">
                      {selectedTimeSlot.time}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <label className="block text-sm font-semibold text-purple-800 mb-2">Bệnh nhân</label>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <FaUser size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-purple-900">{currentUser.name}</div>
                    <div className="text-sm text-purple-700">Bệnh nhân</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 p-6 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-all"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => handleBookAppointment(selectedTimeSlot.doctorId, selectedTimeSlot.date, selectedTimeSlot.time)}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 font-medium transition-all shadow-md"
              >
                <FaCheck size={16} className="inline mr-2" />
                Xác nhận đặt lịch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthcareBookingSystem;