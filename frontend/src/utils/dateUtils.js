/**
 * Format a date into a localized string
 * @param {Date} date - The date to format
 * @param {boolean} includeTime - Whether to include time
 * @returns {string} Formatted date string
 */
export const formatDate = (date, includeTime = false) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (includeTime) {
    // Format with time
    const dateOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    const timeOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    
    const dateStr = dateObj.toLocaleDateString('zh-CN', dateOptions);
    const timeStr = dateObj.toLocaleTimeString('zh-CN', timeOptions);
    
    return `${dateStr} ${timeStr}`;
  } else {
    // Format without time (default behavior)
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    
    return dateObj.toLocaleDateString('zh-CN', options);
  }
};

/**
 * Format date and time for display in event cards and modals
 * @param {Date} startDate - Event start date
 * @param {Date} endDate - Event end date (optional)
 * @returns {string} Formatted date range string
 */
export const formatEventDateTime = (startDate, endDate) => {
  if (!startDate) return '';
  
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  
  // Check if the dates have meaningful time info (not just 00:00:00)
  const startHasTime = start.getHours() !== 0 || start.getMinutes() !== 0;
  const endHasTime = end && (end.getHours() !== 0 || end.getMinutes() !== 0);
  const hasTimeInfo = startHasTime || endHasTime;
  
  if (!end) {
    // Single date event
    return formatDate(start, hasTimeInfo);
  }
  
  const startDateOnly = start.toDateString();
  const endDateOnly = end.toDateString();
  
  if (startDateOnly === endDateOnly) {
    // Same day event
    if (hasTimeInfo) {
      const dateStr = formatDate(start, false);
      const startTime = start.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
      const endTime = end.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
      return `${dateStr} ${startTime} - ${endTime}`;
    } else {
      return formatDate(start, false);
    }
  } else {
    // Multi-day event
    const startStr = formatDate(start, hasTimeInfo && startHasTime);
    const endStr = formatDate(end, hasTimeInfo && endHasTime);
    return `${startStr} - ${endStr}`;
  }
};

/**
 * Calculate the event status based on date
 * @param {Date} startDate - Event start date
 * @param {Date} endDate - Event end date
 * @returns {string} Status ('past', 'ongoing', or 'upcoming')
 */
export const getEventStatus = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  
  if (end && now > end) {
    return 'past';
  } else if (start > now) {
    return 'upcoming';
  } else {
    return 'ongoing';
  }
}; 