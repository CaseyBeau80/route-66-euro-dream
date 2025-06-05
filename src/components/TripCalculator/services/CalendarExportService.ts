
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
        title: `Route 66 - ${segment.title}`,
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
    const stops = segment.recommendedStops.slice(0, 3).map(stop => stop.name).join(', ');
    const moreStops = segment.recommendedStops.length > 3 ? ` and ${segment.recommendedStops.length - 3} more` : '';
    
    return [
      `Drive from ${segment.startCity} to ${segment.endCity}`,
      `Distance: ${segment.approximateMiles} miles`,
      `Drive time: ~${segment.driveTimeHours.toFixed(1)} hours`,
      stops ? `Recommended stops: ${stops}${moreStops}` : 'Direct drive with no planned stops',
      '',
      'Part of your Route 66 road trip adventure!'
    ].join('\n');
  }

  /**
   * Create ICS (iCalendar) format string
   */
  static createICSContent(events: CalendarEvent[]): string {
    const formatDate = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    const escapeText = (text: string): string => {
      return text.replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
    };

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Route 66 Trip Planner//EN',
      'CALSCALE:GREGORIAN'
    ];

    events.forEach((event, index) => {
      icsContent.push(
        'BEGIN:VEVENT',
        `UID:route66-${Date.now()}-${index}@route66planner.com`,
        `DTSTART:${formatDate(event.startDate)}`,
        `DTEND:${formatDate(event.endDate)}`,
        `SUMMARY:${escapeText(event.title)}`,
        `DESCRIPTION:${escapeText(event.description)}`,
        `LOCATION:${escapeText(event.location)}`,
        'END:VEVENT'
      );
    });

    icsContent.push('END:VCALENDAR');
    return icsContent.join('\r\n');
  }

  /**
   * Download ICS file
   */
  static downloadICSFile(events: CalendarEvent[], filename: string = 'route66-trip.ics'): void {
    const icsContent = this.createICSContent(events);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
