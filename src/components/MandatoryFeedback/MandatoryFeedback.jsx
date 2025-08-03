import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createFeedback, selectCreateFeedbackLoading } from '../../redux/APIs/slices/feedbackSlice';
import { getMyRegisteredSchedules } from '../../redux/APIs/slices/scheduleSlice';
import FeedbackPrompt from '../FeedbackPrompt/FeedbackPrompt';
import { CustomToast } from '../Toast/CustomToast';

const MandatoryFeedback = () => {
  const dispatch = useDispatch();
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
      // Get feedback submitted from localStorage
      const feedbackSubmitted = JSON.parse(localStorage.getItem('feedbackSubmitted') || '[]');
      
      // Find completed schedules that need feedback
      const completedSchedules = myRegisteredSchedules.filter(schedule => 
        schedule.status === 'completed'
      );
      
      const needsFeedback = completedSchedules.find(schedule => 
        !feedbackSubmitted.includes(schedule._id)
      );
      
      if (needsFeedback) {
        console.log('🔍 Debug: Found schedule needing feedback:', needsFeedback._id);
        setPendingFeedback(needsFeedback);
      }
    };

    if (myRegisteredSchedules.length > 0) {
      checkPendingFeedback();
    }
  }, [myRegisteredSchedules]);

  useEffect(() => {
    // Listen for completed schedule notifications
    const handleCompletedSchedule = (event) => {
      console.log('🔍 Debug: MandatoryFeedback received event:', event.detail);
      if (event.detail && event.detail.type === 'schedule_completed') {
        const schedule = event.detail.schedule;
        if (schedule) {
          console.log('🔍 Debug: Setting pending feedback for schedule:', schedule._id);
          
          // Check if feedback already submitted
          const feedbackSubmitted = JSON.parse(localStorage.getItem('feedbackSubmitted') || '[]');
          if (!feedbackSubmitted.includes(schedule._id)) {
            // Set pending feedback immediately with the schedule from event
            setPendingFeedback(schedule);
          } else {
            console.log('🔍 Debug: Feedback already submitted for schedule:', schedule._id);
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
      const feedbackSubmitted = JSON.parse(localStorage.getItem('feedbackSubmitted') || '[]');
      feedbackSubmitted.push(pendingFeedback._id);
      localStorage.setItem('feedbackSubmitted', JSON.stringify(feedbackSubmitted));
      
      setPendingFeedback(null);
      CustomToast.success('Cảm ơn bạn đã đánh giá!');
      
      // Refresh schedules after successful feedback
      dispatch(getMyRegisteredSchedules());
    } catch (error) {
      console.error('Error submitting feedback:', error);
      CustomToast.error('Có lỗi xảy ra khi gửi đánh giá');
    }
  };

  const handleClose = () => {
    // Don't allow closing in mandatory mode
    return;
  };

  if (!pendingFeedback) {
    return null;
  }

  return (
    <FeedbackPrompt
      schedule={pendingFeedback}
      onClose={handleClose}
      onSuccess={handleFeedbackSubmit}
    />
  );
};

export default MandatoryFeedback; 