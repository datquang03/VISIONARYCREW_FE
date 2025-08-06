import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { createFeedback, selectCreateFeedbackLoading } from '../../redux/APIs/slices/feedbackSlice';
import { getMyRegisteredSchedules } from '../../redux/APIs/slices/scheduleSlice';
import FeedbackPrompt from '../FeedbackPrompt/FeedbackPrompt';
import { CustomToast } from '../Toast/CustomToast';
import { getSchedulesNeedingFeedback, markFeedbackAsSubmitted } from '../../utils/feedbackUtils';

const MandatoryFeedback = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [pendingFeedback, setPendingFeedback] = useState(null);
  const createLoading = useSelector(selectCreateFeedbackLoading);
  const { myRegisteredSchedules } = useSelector(state => state.scheduleSlice);
  const { user } = useSelector(state => state.authSlice);

  // Check for completed schedules that need feedback
  useEffect(() => {
    // Fetch user's registered schedules only once when component mounts and user is logged in
    if (user && user.role === 'user') {
      dispatch(getMyRegisteredSchedules());
    }
  }, [user, dispatch]);

    useEffect(() => {
    const checkPendingFeedback = () => {
      // Don't show mandatory feedback if user is on feedback page
      if (location.pathname === '/feedback') {
        return;
      }

      // Get schedules that need feedback (automatically excludes skipped ones)
      const needsFeedbackList = getSchedulesNeedingFeedback(myRegisteredSchedules);
      
      // Find first schedule that needs feedback
      const needsFeedback = needsFeedbackList[0];
      
      if (needsFeedback) {
        setPendingFeedback(needsFeedback);
      }
    };

    if (myRegisteredSchedules.length > 0) {
      checkPendingFeedback();
    }
  }, [myRegisteredSchedules, location.pathname]);

  useEffect(() => {
    // Listen for completed schedule notifications
    const handleCompletedSchedule = (event) => {
      
      if (event.detail && event.detail.type === 'schedule_completed') {
        const schedule = event.detail.schedule;
        if (schedule) {

          
          // Check if feedback already submitted
          const feedbackSubmitted = JSON.parse(localStorage.getItem('feedbackSubmitted') || '[]');
          if (!feedbackSubmitted.includes(schedule._id)) {
            // Set pending feedback immediately with the schedule from event
            setPendingFeedback(schedule);
          } else {

          }
        }
      }
    };

    window.addEventListener('scheduleCompleted', handleCompletedSchedule);
    
    return () => {
      window.removeEventListener('scheduleCompleted', handleCompletedSchedule);
    };
  }, [dispatch]);

  const handleFeedbackSubmit = async (feedbackData) => {
    try {

      await dispatch(createFeedback(feedbackData)).unwrap();
      
      // Mark feedback as submitted
      markFeedbackAsSubmitted(pendingFeedback._id);
      
      setPendingFeedback(null);
      CustomToast.success('Cảm ơn bạn đã đánh giá!');
      
      // Refresh schedules after successful feedback
      dispatch(getMyRegisteredSchedules());
    } catch (error) {
      console.error('Error submitting feedback:', error);
      
      // Check if error is due to already existing feedback
      if (error.includes('đã đánh giá')) {
        // Mark as submitted in localStorage to prevent future attempts
        markFeedbackAsSubmitted(pendingFeedback._id);
        
        setPendingFeedback(null);
        CustomToast.info('Lịch hẹn này đã được đánh giá trước đó.');
        
        // Refresh to update UI
        dispatch(getMyRegisteredSchedules());
      } else {
        CustomToast.error('Có lỗi xảy ra khi gửi đánh giá');
      }
    }
  };

  const handleClose = () => {
    // Don't allow closing in mandatory mode
    return;
  };

  const handleSkipFeedback = () => {
    if (!pendingFeedback) return;
    
    // Add to skipped list temporarily (will be cleared after 24 hours)
    const skippedFeedbacks = JSON.parse(localStorage.getItem('skippedFeedbacks') || '[]');
    const skippedData = {
      scheduleId: pendingFeedback._id,
      skippedAt: Date.now()
    };
    
    // Remove old skipped items (older than 24 hours) and avoid duplicates
    const validSkipped = skippedFeedbacks.filter(item => 
      Date.now() - item.skippedAt < 24 * 60 * 60 * 1000 &&
      item.scheduleId !== pendingFeedback._id
    );
    
    validSkipped.push(skippedData);
    localStorage.setItem('skippedFeedbacks', JSON.stringify(validSkipped));
    
    setPendingFeedback(null);
    CustomToast.info('Bạn có thể đánh giá sau trong trang Feedback. Sẽ nhắc lại sau 24 giờ.');
  };

  if (!pendingFeedback) {
    return null;
  }

  return (
    <FeedbackPrompt
      schedule={pendingFeedback}
      onClose={handleClose}
      onSuccess={handleFeedbackSubmit}
      onSkip={handleSkipFeedback}
      showSkipOption={true}
    />
  );
};

export default MandatoryFeedback; 