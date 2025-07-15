import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ShortLoading from '../../../components/Loading/ShortLoading';
import { getDoctorByRegisterId } from '../../../redux/APIs/slices/doctorRegisterSlice';

// ✅ Tạm set cứng registerId
const doctorRegisterId = "68765ca2c6aa5ab25fe80632";
// ✅ Tạm set cứng token
const tempDoctorToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzY1Y2EyYzZhYTVhYjI1ZmU4MDYzMyIsImlhdCI6MTc1MjU4NzU3MCwiZXhwIjoxNzU1MTc5NTcwfQ.PxPpQUBJ6BpGOQqO0AAVZy8fvffqTvHReVc2uF8pA64";

const DoctorRegisterForm = () => {
  const dispatch = useDispatch();
  const { doctorDetail, doctorDetailStatus, doctorDetailMessage } = useSelector(
    (state) => state.doctorRegisterSlice
  );

  useEffect(() => {
    dispatch(getDoctorByRegisterId(doctorRegisterId, {
      headers: {
        Authorization: `Bearer ${tempDoctorToken}`,
      },
    }));
  }, [dispatch]);

  if (doctorDetailStatus === 'loading') {
    return <ShortLoading text="Đang tải thông tin bác sĩ..." />;
  }

  if (doctorDetailStatus === 'error') {
    return (
      <p className="text-red-500 text-center mt-10 text-lg">
        {doctorDetailMessage || 'Không thể tải dữ liệu bác sĩ'}
      </p>
    );
  }

  if (!doctorDetail) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Chi tiết đơn đăng ký bác sĩ</h2>
      <div className="space-y-3 text-gray-700">
        <p><strong>Họ tên:</strong> {doctorDetail.fullName}</p>
        <p><strong>Loại bác sĩ:</strong> {doctorDetail.doctorType}</p>
        <p><strong>Nơi làm việc:</strong> {doctorDetail.workplace || 'Chưa cung cấp'}</p>
        <p><strong>Trạng thái đơn:</strong> {doctorDetail.status}</p>
        <p><strong>Ngày nộp đơn:</strong> {new Date(doctorDetail.submittedAt).toLocaleString()}</p>
        <p><strong>Ngày cập nhật:</strong> {new Date(doctorDetail.updatedAt).toLocaleString()}</p>
        {doctorDetail.rejectionMessage && (
          <p className="text-red-500"><strong>Lý do từ chối:</strong> {doctorDetail.rejectionMessage}</p>
        )}
      </div>
    </div>
  );
};

export default DoctorRegisterForm;
