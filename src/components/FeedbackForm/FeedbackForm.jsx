import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaStar, FaUser, FaCalendar, FaClock, FaTimes } from 'react-icons/fa';
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Đánh giá đã được gửi</h3>
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`text-2xl ${
                    star <= currentFeedback.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            {currentFeedback.comment && (
              <p className="text-gray-600 mb-4">{currentFeedback.comment}</p>
            )}
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isMandatory ? 'w-full' : 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4'}`}>
      <div className={`bg-white rounded-2xl p-6 ${isMandatory ? 'w-full' : 'max-w-md w-full'}`}>
        {!isMandatory && (
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Đánh giá buổi khám</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              <FaTimes />
            </button>
          </div>
        )}

        {/* Schedule Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
            <FaUser className="mr-2" />
            Thông tin lịch hẹn
          </h4>
          <div className="space-y-2 text-sm">
            <p className="flex items-center">
              <FaUser className="mr-2 text-blue-600" />
              <span className="font-medium text-blue-800">Bác sĩ:</span> {schedule?.doctor?.username}
            </p>
            <p className="flex items-center">
              <FaCalendar className="mr-2 text-blue-600" />
              <span className="font-medium text-blue-800">Ngày:</span> {formatDate(schedule?.date)}
            </p>
            <p className="flex items-center">
              <FaClock className="mr-2 text-blue-600" />
              <span className="font-medium text-blue-800">Giờ:</span> {formatTime(schedule?.timeSlot?.startTime)} - {formatTime(schedule?.timeSlot?.endTime)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Đánh giá của bạn *
            </label>
            <div className="flex gap-1 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="text-2xl text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  <FaStar
                    className={`w-8 h-8 ${
                      star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 text-center mt-2">
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
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Nhận xét (tùy chọn)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Chia sẻ trải nghiệm của bạn về buổi khám..."
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {comment.length}/500 ký tự
            </p>
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center">
            <input
              id="anonymous"
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
              Gửi đánh giá ẩn danh
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            {!isMandatory && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
            )}
            <button
              type="submit"
              disabled={rating === 0 || createLoading}
              className={`flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
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