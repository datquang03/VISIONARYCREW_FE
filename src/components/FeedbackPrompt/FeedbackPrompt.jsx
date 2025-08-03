import React, { useState } from 'react';
import { FaStar, FaTimes, FaCheck } from 'react-icons/fa';
import FeedbackForm from '../FeedbackForm/FeedbackForm';

const FeedbackPrompt = ({ schedule, onClose, onSuccess }) => {
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
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999]"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Đánh giá buổi khám
          </h2>
          <p className="text-gray-600">
            Vui lòng đánh giá buổi khám với bác sĩ {schedule?.doctor?.username || 'Bác sĩ'}
          </p>
        </div>

        {!showDetailedForm ? (
          // Quick rating view
          <div className="space-y-4">
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setQuickRating(star)}
                  className={`text-3xl transition-colors ${
                    star <= quickRating ? 'text-yellow-400' : 'text-gray-300'
                  } hover:text-yellow-400`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                {quickRating === 0 && 'Chọn số sao để đánh giá'}
                {quickRating === 1 && 'Rất không hài lòng'}
                {quickRating === 2 && 'Không hài lòng'}
                {quickRating === 3 && 'Bình thường'}
                {quickRating === 4 && 'Hài lòng'}
                {quickRating === 5 && 'Rất hài lòng'}
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDetailedForm(true)}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Viết đánh giá chi tiết
              </button>
              <button
                onClick={handleQuickSubmit}
                disabled={quickRating === 0}
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        ) : (
          // Detailed form view
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