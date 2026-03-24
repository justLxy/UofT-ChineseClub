/**
 * Format a date into a localized string
 * @param {Date} date - The date to format
 * @param {boolean} includeTime - Whether to include time
 * @param {string} language - Language code ('en' or 'zh')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, includeTime = false, language = 'en') => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  const locale = language === 'zh' ? 'zh-CN' : 'en-US';
  
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
    
    const dateStr = dateObj.toLocaleDateString(locale, dateOptions);
    const timeStr = dateObj.toLocaleTimeString(locale, timeOptions);
    
    return `${dateStr} ${timeStr}`;
  } else {
    // Format without time (default behavior)
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    
    return dateObj.toLocaleDateString(locale, options);
  }
};

/**
 * Format date and time for display in event cards and modals
 * @param {Date} startDate - Event start date
 * @param {Date} endDate - Event end date (optional)
 * @param {string} language - Language code ('en' or 'zh')
 * @returns {string} Formatted date range string
 */
export const formatEventDateTime = (startDate, endDate, language = 'en') => {
  if (!startDate) return '';
  
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  const locale = language === 'zh' ? 'zh-CN' : 'en-US';
  
  // Check if the dates have meaningful time info (not just 00:00:00)
  const startHasTime = start.getHours() !== 0 || start.getMinutes() !== 0;
  const endHasTime = end && (end.getHours() !== 0 || end.getMinutes() !== 0);
  const hasTimeInfo = startHasTime || endHasTime;
  
  if (!end) {
    // Single date event
    return formatDate(start, hasTimeInfo, language);
  }
  
  const startDateOnly = start.toDateString();
  const endDateOnly = end.toDateString();
  
  if (startDateOnly === endDateOnly) {
    // Same day event
    if (hasTimeInfo) {
      const dateStr = formatDate(start, false, language);
      const startTime = start.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false });
      const endTime = end.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false });
      return `${dateStr} ${startTime} - ${endTime}`;
    } else {
      return formatDate(start, false, language);
    }
  } else {
    // Multi-day event
    const startStr = formatDate(start, hasTimeInfo && startHasTime, language);
    const endStr = formatDate(end, hasTimeInfo && endHasTime, language);
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

/**
 * Admin form: combine local calendar date (YYYY-MM-DD) and time (HH:mm) into UTC ISO for the API.
 * Parsing in the browser uses the user's local timezone; the server must not receive a bare
 * "YYYY-MM-DDTHH:mm:ss" string (that is interpreted as *server* local time, often UTC).
 */
export const localDateTimeToUtcIso = (dateStr, timeStr) => {
  if (!dateStr) return null;
  const trimmed = timeStr && String(timeStr).trim();
  const local = trimmed
    ? new Date(`${dateStr}T${trimmed}:00`)
    : new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(local.getTime())) return null;
  return local.toISOString();
};

/** End of local calendar day as UTC ISO (for optional end time). */
export const localEndOfDayToUtcIso = (dateStr) => {
  if (!dateStr) return null;
  const local = new Date(`${dateStr}T23:59:59.999`);
  if (Number.isNaN(local.getTime())) return null;
  return local.toISOString();
};

/** UTC instant from API → YYYY-MM-DD and HH:mm for date/time inputs in the user's local zone. */
export const utcInstantToLocalDateTimeParts = (isoUtc) => {
  if (!isoUtc) return { date: '', time: '' };
  const d = new Date(isoUtc);
  if (Number.isNaN(d.getTime())) return { date: '', time: '' };
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return { date: `${y}-${m}-${day}`, time: `${h}:${min}` };
}; 