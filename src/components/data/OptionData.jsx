/*************  ✨ Windsurf Command 🌟  *************/
import { FaVideo, FaUserMd, FaHospitalAlt } from "react-icons/fa";
import { FaMessage, FaRobot, FaUserDoctor } from "react-icons/fa6";
import { MdOutlinePayment } from "react-icons/md";
import { IoNewspaper } from "react-icons/io5";

const optionData = [
  {
    id: 2,
    name: "Tìm nơi khám gần bạn",
    description: "Đặt lịch khám dễ dàng",
    navigation: "/booking",
    icon: (
      <FaHospitalAlt className="text-8xl text-green-600 absolute bottom-4 right-4" />
    ),
    bgColor: "bg-green-200",
  },
  {
    id: 3,
    name: "24/24 Chuẩn đoán với AI",
    description: "Giải đáp vấn đề sức khỏe của bạn ngay lập tức",
    navigation: "/chat/AI",
    icon: (
      <FaRobot className="text-8xl text-pink-500 absolute bottom-4 right-4" />
    ),
    bgColor: "bg-pink-200",
  },
  {
    id: 4,
    name: "Cần hỗ trợ mà không cần phải tốn phí ? ",
    description: "Liên hệ với bác sĩ qua hệ thống tin nhắn",
    navigation: "/message",
    icon: (
      <FaMessage className="text-8xl text-orange-600 absolute bottom-4 right-4" />
    ),
    bgColor: "bg-orange-200",
  },
  {
    id: 7,
    name: "Đăng ký làm bác sĩ",
    description: "Tham gia đội ngũ bác sĩ của chúng tôi",
    navigation: "/register-doctor",
    icon: (
      <FaUserDoctor className="text-8xl text-teal-600 absolute bottom-4 right-4" />
    ),
    bgColor: "bg-teal-200",
  },
  {
    id: 8,
    name: "Về chúng tôi",
    description: "Ấn vào để biết thêm chi tiết",
    navigation: "/about",
    icon: (
      <FaUserMd className="text-8xl text-amber-700 absolute bottom-4 right-4" />
    ),
    bgColor: "bg-amber-200",
  },

];

export default optionData;
/*******  51ec2c20-23b9-4dfd-bc46-5337d8032fd8  *******/