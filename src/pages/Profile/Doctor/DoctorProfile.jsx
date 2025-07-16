import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../../redux/APIs/slices/userProfileSlice";

const DoctorProfile = () => {
  const dispatch = useDispatch();
  const { user: doctor, isLoading, isError, message } = useSelector((state) => state.userProfile);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  if (isLoading) return <p>Đang tải thông tin bác sĩ...</p>;
  if (isError) return <p className="text-red-500">{message}</p>;
  if (!doctor) return <p>Không có dữ liệu bác sĩ.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Thông tin bác sĩ</h2>
      <div className="flex items-center gap-4">
        <img
          src={doctor.avatar || "/default-avatar.png"}
          alt="avatar"
          className="w-24 h-24 rounded-full border shadow"
        />
        <div>
          <p><strong>Họ tên:</strong> {doctor.fullName}</p>
          <p><strong>Email:</strong> {doctor.email}</p>
          <p><strong>Số điện thoại:</strong> {doctor.phone}</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <p><strong>Ngày sinh:</strong> {doctor.dateOfBirth ? new Date(doctor.dateOfBirth).toLocaleDateString() : "Chưa cập nhật"}</p>
        <p><strong>Chuyên khoa:</strong> {doctor.doctorType}</p>
        <p><strong>Trạng thái đăng ký:</strong> <span className={`font-semibold ${doctor.doctorApplicationStatus === "accepted" ? "text-green-600" : "text-yellow-600"}`}>
          {doctor.doctorApplicationStatus === "accepted" ? "Đã chấp nhận" : doctor.doctorApplicationStatus === "pending" ? "Chờ duyệt" : "Từ chối"}
        </span></p>
        <p><strong>Vai trò:</strong> {doctor.role}</p>
      </div>
    </div>
  );
};

export default DoctorProfile;
