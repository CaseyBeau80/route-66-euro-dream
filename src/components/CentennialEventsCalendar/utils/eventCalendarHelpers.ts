import { CentennialEvent, centennialEvents } from '@/data/centennialEventsData';

// Calendar event format for export
interface CalendarEvent {
  title: string;
  startDate: Date;
  endDate: Date;
  description: string;
  location: string;
}

/**
 * Convert a CentennialEvent to a CalendarEvent for export
 */
export const toCalendarEvent = (event: CentennialEvent): CalendarEvent => {
  const startDate = new Date(event.dateStart);
  startDate.setHours(9, 0, 0, 0); // 9 AM start
  
  // Handle multi-day events properly
  const endDate = event.dateEnd 
    ? new Date(event.dateEnd) 
    : new Date(event.dateStart);
  endDate.setHours(18, 0, 0, 0); // 6 PM end
  
  return {
    title: `Route 66 Centennial: ${event.title}`,
    startDate,
    endDate,
    description: buildEventDescription(event),
    location: event.venue ? `${event.venue}, ${event.location}` : event.location
  };
};

/**
 * Build a detailed description for calendar export
 */
const buildEventDescription = (event: CentennialEvent): string => {
  const lines = [event.description];
  
  if (event.guinnessAttempt && event.guinnessNote) {
    lines.push('');
    lines.push(`🏆 ${event.guinnessNote}`);
  }
  
  if (event.venue) {
    lines.push('');
    lines.push(`📍 Venue: ${event.venue}`);
  }
  
  if (event.officialUrl) {
    lines.push('');
    lines.push(`🔗 Official site: ${event.officialUrl}`);
  }
  
  lines.push('');
  lines.push('🛣️ Part of the Route 66 Centennial 2026 celebrations!');
  lines.push('Visit route66centennial.org for more events.');
  
  return lines.join('\n');
};

/**
 * Format date for Google Calendar URL
 */
const formatGoogleCalendarDate = (date: Date): string => {
  return date.toISOString().replace(/-|:|\.\d{3}/g, '');
};

/**
 * Create a Google Calendar URL for an event
 */
export const createGoogleCalendarUrl = (event: CentennialEvent): string => {
  const calEvent = toCalendarEvent(event);
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: calEvent.title,
    dates: `${formatGoogleCalendarDate(calEvent.startDate)}/${formatGoogleCalendarDate(calEvent.endDate)}`,
    details: calEvent.description,
    location: calEvent.location,
    sf: 'true'
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/**
 * Create an ICS file content for download
 */
export const createICSContent = (event: CentennialEvent): string => {
  const calEvent = toCalendarEvent(event);
  
  const formatICSDate = (date: Date): string => {
    return date.toISOString().replace(/-|:|\.\d{3}/g, '').slice(0, 15) + 'Z';
  };
  
  const escapeICS = (text: string): string => {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;')
      .replace(/\n/g, '\\n');
  };
  
  const uid = `${event.id}-${Date.now()}@ramble66.com`;
  
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ramble66//Route 66 Centennial//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(calEvent.startDate)}`,
    `DTEND:${formatICSDate(calEvent.endDate)}`,
    `SUMMARY:${escapeICS(calEvent.title)}`,
    `DESCRIPTION:${escapeICS(calEvent.description)}`,
    `LOCATION:${escapeICS(calEvent.location)}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
};

/**
 * Download an ICS file
 */
export const downloadICSFile = (event: CentennialEvent): void => {
  const icsContent = createICSContent(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `route66-${event.id}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Get upcoming events (from current date)
 */
export const getUpcomingEvents = (count: number = 3): CentennialEvent[] => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  return centennialEvents
    .filter(e => new Date(e.dateStart) >= now)
    .sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime())
    .slice(0, count);
};

/**
 * Safely parse a date string, handling various formats
 */
export const safeParseDate = (dateString: string | null | undefined): Date | null => {
  if (!dateString) return null;
  
  // Log the incoming date string for debugging
  console.log('[safeParseDate] Parsing:', dateString, 'type:', typeof dateString);
  
  // Handle ISO date format (YYYY-MM-DD)
  if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-').map(Number);
    const result = new Date(year, month - 1, day);
    console.log('[safeParseDate] ISO format parsed:', result);
    return result;
  }
  
  // Handle ISO datetime format (YYYY-MM-DDTHH:MM:SS or with timezone)
  if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(dateString)) {
    const result = new Date(dateString);
    if (!isNaN(result.getTime())) {
      console.log('[safeParseDate] ISO datetime parsed:', result);
      return result;
    }
  }
  
  // Handle DD-Mon-YY format (e.g., "11-Nov-26")
  const monthMap: Record<string, number> = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  
  const ddMonYYMatch = dateString.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{2})$/);
  if (ddMonYYMatch) {
    const day = parseInt(ddMonYYMatch[1], 10);
    const month = monthMap[ddMonYYMatch[2]];
    const year = 2000 + parseInt(ddMonYYMatch[3], 10); // Assume 20xx century
    if (month !== undefined) {
      const result = new Date(year, month, day);
      console.log('[safeParseDate] DD-Mon-YY parsed:', result);
      return result;
    }
  }
  
  // Try standard Date parsing as fallback
  const date = new Date(dateString);
  // Check if date is valid
  if (isNaN(date.getTime())) {
    console.log('[safeParseDate] Failed to parse:', dateString);
    return null;
  }
  
  console.log('[safeParseDate] Standard Date parsed:', date);
  return date;
};

/**
 * Get countdown text for an event
 */
export const getCountdownText = (dateStart: string): string => {
  const eventDate = safeParseDate(dateStart);
  if (!eventDate) return 'Date TBD';
  
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);
  
  const diffTime = eventDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return 'Past event';
  } else if (diffDays === 0) {
    return 'Today!';
  } else if (diffDays === 1) {
    return 'Tomorrow!';
  } else if (diffDays <= 7) {
    return `In ${diffDays} days`;
  } else if (diffDays <= 30) {
    const weeks = Math.floor(diffDays / 7);
    return `In ${weeks} week${weeks > 1 ? 's' : ''}`;
  } else if (diffDays <= 365) {
    const months = Math.floor(diffDays / 30);
    return `In ${months} month${months > 1 ? 's' : ''}`;
  }
  
  return `In ${diffDays} days`;
};

/**
 * Check if event is happening now or soon (within 7 days)
 */
export const isEventSoon = (dateStart: string): boolean => {
  const eventDate = safeParseDate(dateStart);
  if (!eventDate) return false;
  
  const now = new Date();
  const diffTime = eventDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays >= 0 && diffDays <= 7;
};

/**
 * Format date range for display
 */
export const formatDateRange = (dateStart: string, dateEnd?: string): string => {
  const start = safeParseDate(dateStart);
  if (!start) return 'Date TBD';
  
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric' 
  };
  
  const end = dateEnd ? safeParseDate(dateEnd) : null;
  
  if (!end || dateStart === dateEnd) {
    return start.toLocaleDateString('en-US', { ...options, year: 'numeric' });
  }
  
  // Same month
  if (start.getMonth() === end.getMonth()) {
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}-${end.getDate()}, ${end.getFullYear()}`;
  }
  
  // Different months
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', { ...options, year: 'numeric' })}`;
};
