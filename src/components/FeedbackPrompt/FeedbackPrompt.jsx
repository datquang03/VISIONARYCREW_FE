import React, { useState } from 'react';
import { FaStar, FaTimes, FaCheck, FaList, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import FeedbackForm from '../FeedbackForm/FeedbackForm';

const FeedbackPrompt = ({ schedule, onClose, onSuccess, onSkip, showSkipOption = false }) => {
  const [showDetailedForm, setShowDetailedForm] = useState(false);
  const [quickRating, setQuickRating] = useState(0);

  const handleQuickSubmit = async () => {
    if (quickRating === 0) return;
    
    try {
      // Submit quick rating with scheduleId
      await onSuccess({ 
        scheduleId: schedule._id,
        rating: quickRating, 
        comment: '' 
      });
      onClose();
    } catch (error) {
      console.error('Error submitting quick feedback:', error);
    }
  };

  const handleDetailedSubmit = async (feedbackData) => {
    try {
      await onSuccess(feedbackData);
      onClose();
    } catch (error) {
      console.error('Error submitting detailed feedback:', error);
    }
  };

  // Prevent closing by clicking outside or escape key
  const handleBackdropClick = (e) => {
    e.stopPropagation();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[9999]"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 transform transition-all duration-300 scale-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Đánh giá buổi khám
          </h2>
          <p className="text-gray-600 text-sm">
            Vui lòng đánh giá buổi khám với bác sĩ {schedule?.doctor?.username || 'Bác sĩ'}
          </p>
        </div>

        {!showDetailedForm ? (
          <div className="space-y-6">
            <div className="flex justify-center space-x-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setQuickRating(star)}
                  className={`text-4xl transition-all duration-200 transform hover:scale-110 ${
                    star <= quickRating ? 'text-yellow-400' : 'text-gray-200'
                  } hover:text-yellow-400`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
            
            <div className="text-center">
              <p className={`text-sm font-medium transition-all duration-200 ${
                quickRating > 0 ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {quickRating === 0 && 'Chọn số sao để đánh giá'}
                {quickRating === 1 && 'Rất không hài lòng'}
                {quickRating === 2 && 'Không hài lòng'}
                {quickRating === 3 && 'Bình thường'}
                {quickRating === 4 && 'Hài lòng'}
                {quickRating === 5 && 'Rất hài lòng'}
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowDetailedForm(true)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
              >
                Viết đánh giá chi tiết
              </button>
              <button
                onClick={handleQuickSubmit}
                disabled={quickRating === 0}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md font-medium text-sm"
              >
                Gửi đánh giá
              </button>
            </div>

            {showSkipOption && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex flex-col space-y-3">
                  <Link 
                    to="/feedback" 
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
                    onClick={onClose}
                  >
                    <FaList className="text-sm" />
                    Xem tất cả feedback
                  </Link>
                  <button
                    onClick={onSkip}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-4 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
                  >
                    <FaClock className="text-sm" />
                    Đánh giá sau
                  </button>
                </div>
                <p className="text-xs text-gray-400 text-center mt-3 font-medium">
                  * Sẽ nhắc lại sau 24 giờ
                </p>
              </div>
            )}
          </div>
        ) : (
          <FeedbackForm 
            schedule={schedule} 
            onClose={() => setShowDetailedForm(false)}
            onSuccess={handleDetailedSubmit}
            isMandatory={true}
          />
        )}
      </div>
    </div>
  );
};

export default FeedbackPrompt; 