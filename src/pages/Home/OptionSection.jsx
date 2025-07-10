import React from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import optionData from "../../components/data/OptionData";

// Helper để chuyển bgColor -> textColor đậm hơn
const getTextColor = (bgColor) => {
  const map = {
    "bg-yellow-200": "text-yellow-700",
    "bg-green-200": "text-green-700",
    "bg-pink-200": "text-pink-700",
    "bg-orange-200": "text-orange-700",
    "bg-purple-200": "text-purple-700",
    "bg-blue-200": "text-blue-700",
    "bg-teal-200": "text-teal-700",
    "bg-amber-200": "text-amber-700",
    "bg-cyan-200": "text-cyan-700",
  };
  return map[bgColor] || "text-gray-800";
};

const OptionSection = () => {
  const navigate = useNavigate();

  return (
    <div className="py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto mb-8 bg-gradient-to-bl from-blue-50 to-blue-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-800">
          Lựa chọn dịch vụ
        </h2>
      </div>

      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={1.2}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
      >
        {optionData.map((option) => (
          <SwiperSlide key={option.id}>
            <div
              onClick={() => navigate(option.navigation)}
              className={`relative rounded-xl p-6 h-60 shadow-md transition-transform duration-300 transform hover:scale-105 cursor-pointer overflow-hidden group ${option.bgColor}`}
            >
              <h3
                className={`text-xl font-semibold mb-2 ${getTextColor(
                  option.bgColor
                )}`}
              >
                {option.name}
              </h3>
              <p className="text-gray-700">{option.description}</p>

              {/* Icon animation */}
              <div className="absolute bottom-4 right-4 transition-transform duration-300 origin-bottom-right group-hover:rotate-[8deg]">
                {option.icon}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default OptionSection;
