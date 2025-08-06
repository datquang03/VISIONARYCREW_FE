import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaStar, FaUser, FaCalendar, FaClock, FaTimes, FaComment, FaUserSecret } from 'react-icons/fa';
import { createFeedback, getFeedbackBySchedule, selectCurrentFeedback, selectCreateFeedbackLoading, selectGetFeedbackLoading, clearFeedbackState } from '../../redux/APIs/slices/feedbackSlice';
import { CustomToast } from '../Toast/CustomToast';

const FeedbackForm = ({ schedule, onClose, onSuccess, isMandatory = false }) => {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const createLoading = useSelector(selectCreateFeedbackLoading);
  const getLoading = useSelector(selectGetFeedbackLoading);
  const currentFeedback = useSelector(selectCurrentFeedback);

  useEffect(() => {
    if (schedule?._id) {
      dispatch(getFeedbackBySchedule(schedule._id));
    }
    return () => {
      dispatch(clearFeedbackState());
    };
  }, [dispatch, schedule?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      CustomToast.error('Vui lòng chọn đánh giá');
      return;
    }

    try {
      const feedbackData = {
        scheduleId: schedule._id,
        rating,
        comment: comment.trim(),
        isAnonymous
      };

      if (onSuccess) {
        await onSuccess(feedbackData);
      } else {
        await dispatch(createFeedback(feedbackData)).unwrap();
        CustomToast.success('Đánh giá đã được gửi thành công!');
        if (onClose) onClose();
      }
    } catch (error) {
      CustomToast.error('Có lỗi xảy ra khi gửi đánh giá');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  // If feedback already exists, show it
  if (currentFeedback && !isMandatory) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 pt-20">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full transform transition-all duration-300 scale-100 shadow-2xl mt-4 overflow-y-auto scroll-bar-hidden max-h-[85vh]">
          <div className="text-center">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">Đánh giá đã được gửi</h3>
            <div className="flex justify-center mb-6 space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`text-3xl ${
                    star <= currentFeedback.rating ? 'text-yellow-400' : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            {currentFeedback.comment && (
              <p className="text-gray-600 mb-6 bg-gray-50 p-4 rounded-xl italic">{currentFeedback.comment}</p>
            )}
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isMandatory ? 'w-full' : 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 pt-20'}`}>
      <div className={`bg-white rounded-2xl shadow-2xl ${isMandatory ? 'w-full' : 'max-w-md w-full'} transform transition-all duration-300 scale-100 mt-4 overflow-y-auto scroll-bar-hidden max-h-[85vh]`}>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
          {!isMandatory && (
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold">Đánh giá buổi khám</h3>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white text-2xl transition-colors"
              >
                <FaTimes />
              </button>
            </div>
          )}

          {/* Schedule Info */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mt-4">
            <h4 className="font-semibold text-white/90 mb-3 flex items-center text-sm">
              <FaUser className="mr-2" />
              Thông tin lịch hẹn
            </h4>
            <div className="space-y-2 text-sm text-white/80">
              <p className="flex items-center">
                <FaUser className="mr-2 text-white/60" />
                <span className="font-medium">Bác sĩ:</span> 
                <span className="ml-2">{schedule?.doctor?.username}</span>
              </p>
              <p className="flex items-center">
                <FaCalendar className="mr-2 text-white/60" />
                <span className="font-medium">Ngày:</span>
                <span className="ml-2">{formatDate(schedule?.date)}</span>
              </p>
              <p className="flex items-center">
                <FaClock className="mr-2 text-white/60" />
                <span className="font-medium">Giờ:</span>
                <span className="ml-2">{formatTime(schedule?.timeSlot?.startTime)} - {formatTime(schedule?.timeSlot?.endTime)}</span>
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center">
              <FaStar className="mr-2 text-yellow-400" />
              Đánh giá của bạn *
            </label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transform transition-all duration-200 hover:scale-110"
                >
                  <FaStar
                    className={`w-10 h-10 ${
                      star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-200'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <p className={`text-sm font-medium text-center mt-3 transition-all duration-200 ${
              rating > 0 ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {rating === 1 && 'Rất không hài lòng'}
              {rating === 2 && 'Không hài lòng'}
              {rating === 3 && 'Bình thường'}
              {rating === 4 && 'Hài lòng'}
              {rating === 5 && 'Rất hài lòng'}
              {rating === 0 && 'Chọn đánh giá của bạn'}
            </p>
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
              <FaComment className="mr-2 text-blue-500" />
              Nhận xét (tùy chọn)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700 bg-gray-50 placeholder-gray-400 transition-all duration-200"
              placeholder="Chia sẻ trải nghiệm của bạn về buổi khám..."
              maxLength={500}
            />
            <p className="text-xs text-gray-400 mt-2 text-right font-medium">
              {comment.length}/500 ký tự
            </p>
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center bg-gray-50 p-4 rounded-xl">
            <input
              id="anonymous"
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
            />
            <label htmlFor="anonymous" className="ml-3 flex items-center text-sm text-gray-700">
              <FaUserSecret className="mr-2 text-blue-500" />
              Gửi đánh giá ẩn danh
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-2">
            {!isMandatory && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium shadow-sm hover:shadow"
              >
                Hủy
              </button>
            )}
            <button
              type="submit"
              disabled={rating === 0 || createLoading}
              className={`flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                isMandatory ? 'w-full' : ''
              }`}
            >
              {createLoading ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm; 