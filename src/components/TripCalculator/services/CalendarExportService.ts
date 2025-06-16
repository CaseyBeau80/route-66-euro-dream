import { TripPlan, DailySegment } from './planning/TripPlanBuilder';

export interface CalendarEvent {
  title: string;
  startDate: Date;
  endDate: Date;
  description: string;
  location: string;
}

export class CalendarExportService {
  /**
   * Generate calendar events from trip plan
   */
  static generateCalendarEvents(tripPlan: TripPlan, startDate: Date): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    
    tripPlan.dailySegments.forEach((segment: DailySegment, index: number) => {
      const eventDate = new Date(startDate);
      eventDate.setDate(startDate.getDate() + index);
      
      const startTime = new Date(eventDate);
      startTime.setHours(9, 0, 0, 0); // 9 AM start
      
      const endTime = new Date(eventDate);
      endTime.setHours(18, 0, 0, 0); // 6 PM end
      
      events.push({
        title: `Route 66 Day ${index + 1}: ${segment.startCity} to ${segment.endCity}`,
        startDate: startTime,
        endDate: endTime,
        description: this.generateEventDescription(segment),
        location: `${segment.startCity} to ${segment.endCity}`
      });
    });
    
    return events;
  }

  /**
   * Generate event description from segment data
   */
  private static generateEventDescription(segment: DailySegment): string {
    const lines = [
      `Drive from ${segment.startCity} to ${segment.endCity}`,
      `Distance: ${segment.distance || segment.approximateMiles || 0} miles`,
      `Drive time: ~${segment.driveTimeHours.toFixed(1)} hours`
    ];

    if (segment.recommendedStops && segment.recommendedStops.length > 0) {
      const stops = segment.recommendedStops.slice(0, 3).map(stop => stop.name).join(', ');
      const moreStops = segment.recommendedStops.length > 3 ? ` and ${segment.recommendedStops.length - 3} more` : '';
      lines.push(`Recommended stops: ${stops}${moreStops}`);
    } else {
      lines.push('Direct drive with no planned stops');
    }
    
    lines.push('');
    lines.push('Part of your Route 66 road trip adventure!');
    
    return lines.join('\n');
  }

  /**
   * Create ICS (iCalendar) format string with enhanced compatibility
   */
  static createICSContent(events: CalendarEvent[]): string {
    const formatDate = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    const escapeText = (text: string): string => {
      return text
        .replace(/\\/g, '\\\\')
        .replace(/\n/g, '\\n')
        .replace(/,/g, '\\,')
        .replace(/;/g, '\\;')
        .replace(/"/g, '\\"');
    };

    const wrapText = (text: string, maxLength: number = 75): string => {
      if (text.length <= maxLength) return text;
      
      const lines = [];
      let currentLine = '';
      
      for (let i = 0; i < text.length; i++) {
        currentLine += text[i];
        if (currentLine.length >= maxLength && i < text.length - 1) {
          lines.push(currentLine);
          currentLine = ' '; // Continuation line starts with space
        }
      }
      
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      
      return lines.join('\r\n');
    };

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Route 66 Trip Planner//NONSGML v1.0//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    events.forEach((event, index) => {
      const uid = `route66-${Date.now()}-${index}@route66planner.com`;
      const dtstamp = formatDate(new Date());
      
      icsContent.push(
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${dtstamp}`,
        `DTSTART:${formatDate(event.startDate)}`,
        `DTEND:${formatDate(event.endDate)}`,
        wrapText(`SUMMARY:${escapeText(event.title)}`),
        wrapText(`DESCRIPTION:${escapeText(event.description)}`),
        wrapText(`LOCATION:${escapeText(event.location)}`),
        'STATUS:CONFIRMED',
        'TRANSP:OPAQUE',
        'END:VEVENT'
      );
    });

    icsContent.push('END:VCALENDAR');
    return icsContent.join('\r\n');
  }

  /**
   * Download ICS file with enhanced compatibility
   */
  static downloadICSFile(events: CalendarEvent[], filename: string = 'route66-trip.ics'): void {
    const icsContent = this.createICSContent(events);
    const blob = new Blob([icsContent], { 
      type: 'text/calendar;charset=utf-8' 
    });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the object URL after a short delay
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  /**
   * Create Google Calendar URL
   */
  static createGoogleCalendarUrl(event: CalendarEvent): string {
    const formatGoogleDate = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${formatGoogleDate(event.startDate)}/${formatGoogleDate(event.endDate)}`,
      details: event.description,
      location: event.location
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  /**
   * Open Google Calendar for all events (opens multiple tabs)
   */
  static openGoogleCalendar(events: CalendarEvent[]): void {
    events.forEach((event, index) => {
      setTimeout(() => {
        window.open(this.createGoogleCalendarUrl(event), '_blank');
      }, index * 500); // Stagger the opens to avoid popup blockers
    });
  }
}
