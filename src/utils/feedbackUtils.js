// Utility functions for feedback management

/**
 * Sync localStorage feedbackSubmitted with actual database state
 * This prevents duplicate feedback attempts
 */
export const syncFeedbackLocalStorage = async (schedules, dispatch, getFeedbackBySchedule) => {
  const feedbackSubmitted = JSON.parse(localStorage.getItem('feedbackSubmitted') || '[]');
  let hasChanges = false;
  
  // Check completed schedules that are not marked as submitted
  const completedSchedules = schedules.filter(schedule => 
    schedule.status === 'completed' && !feedbackSubmitted.includes(schedule._id)
  );
  
  for (const schedule of completedSchedules) {
    try {
      // Check if feedback exists in database
      const response = await dispatch(getFeedbackBySchedule(schedule._id)).unwrap();
      if (response?.feedback) {
        // Feedback exists in database but not in localStorage
        feedbackSubmitted.push(schedule._id);
        hasChanges = true;
        
      }
    } catch (error) {
      // No feedback exists, which is expected for pending feedbacks
    }
  }
  
  // Update localStorage if there were changes
  if (hasChanges) {
    localStorage.setItem('feedbackSubmitted', JSON.stringify(feedbackSubmitted));
  }
  
  return feedbackSubmitted;
};

/**
 * Mark feedback as submitted in localStorage
 */
export const markFeedbackAsSubmitted = (scheduleId) => {
  const feedbackSubmitted = JSON.parse(localStorage.getItem('feedbackSubmitted') || '[]');
  if (!feedbackSubmitted.includes(scheduleId)) {
    feedbackSubmitted.push(scheduleId);
    localStorage.setItem('feedbackSubmitted', JSON.stringify(feedbackSubmitted));
  }
};

/**
 * Check if feedback already submitted for a schedule
 */
export const isFeedbackSubmitted = (scheduleId) => {
  const feedbackSubmitted = JSON.parse(localStorage.getItem('feedbackSubmitted') || '[]');
  return feedbackSubmitted.includes(scheduleId);
};

/**
 * Get schedules that need feedback (completed but not submitted and not skipped)
 */
export const getSchedulesNeedingFeedback = (schedules) => {
  const feedbackSubmitted = JSON.parse(localStorage.getItem('feedbackSubmitted') || '[]');
  const skippedFeedbacks = JSON.parse(localStorage.getItem('skippedFeedbacks') || '[]');
  
  // Clean up expired skipped items (older than 24 hours)
  const validSkipped = skippedFeedbacks.filter(item => 
    Date.now() - item.skippedAt < 24 * 60 * 60 * 1000
  );
  localStorage.setItem('skippedFeedbacks', JSON.stringify(validSkipped));
  
  const skippedIds = validSkipped.map(item => item.scheduleId);
  
  return schedules.filter(schedule => 
    schedule.status === 'completed' && 
    !feedbackSubmitted.includes(schedule._id) &&
    !skippedIds.includes(schedule._id)
  );
};

/**
 * Get schedules that already have feedback submitted
 */
export const getSchedulesWithFeedback = (schedules) => {
  const feedbackSubmitted = JSON.parse(localStorage.getItem('feedbackSubmitted') || '[]');
  
  return schedules.filter(schedule => 
    schedule.status === 'completed' && feedbackSubmitted.includes(schedule._id)
  );
};

/**
 * Clear expired skipped feedbacks (older than 24 hours)
 */
export const clearExpiredSkippedFeedbacks = () => {
  const skippedFeedbacks = JSON.parse(localStorage.getItem('skippedFeedbacks') || '[]');
  const validSkipped = skippedFeedbacks.filter(item => 
    Date.now() - item.skippedAt < 24 * 60 * 60 * 1000
  );
  localStorage.setItem('skippedFeedbacks', JSON.stringify(validSkipped));
  return validSkipped;
};

/**
 * Get currently skipped schedule IDs
 */
export const getSkippedScheduleIds = () => {
  const validSkipped = clearExpiredSkippedFeedbacks();
  return validSkipped.map(item => item.scheduleId);
}; 