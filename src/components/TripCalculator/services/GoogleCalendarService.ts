
import { TripPlan } from './planning/TripPlanBuilder';

export interface GoogleCalendarOptions {
  useUTC?: boolean;
  trackAnalytics?: boolean;
}

export class GoogleCalendarService {
  /**
   * Generate Google Calendar URL for a complete trip
   */
  static createTripCalendarUrl(
    tripPlan: TripPlan, 
    tripStartDate: Date, 
    shareUrl?: string,
    options: GoogleCalendarOptions = {}
  ): string {
    const { useUTC = false } = options;
    
    // Calculate trip end date
    const tripEndDate = new Date(tripStartDate);
    tripEndDate.setDate(tripStartDate.getDate() + tripPlan.totalDays - 1);
    
    // Format dates
    const startDateTime = this.formatGoogleCalendarDate(tripStartDate, 8, 0, useUTC); // 8:00 AM
    const endDateTime = this.formatGoogleCalendarDate(tripEndDate, 17, 0, useUTC); // 5:00 PM
    
    // Build event details
    const title = this.createEventTitle(tripPlan);
    const location = this.createEventLocation(tripPlan);
    const description = this.createEventDescription(tripPlan, shareUrl);
    
    // Create Google Calendar URL
    const params = new URLSearchParams({
      text: title,
      dates: `${startDateTime}/${endDateTime}`,
      details: description,
      location: location
    });
    
    return `https://calendar.google.com/calendar/u/0/r/eventedit?${params.toString()}`;
  }

  /**
   * Format date for Google Calendar (YYYYMMDDTHHMMSSZ or YYYYMMDDTHHMMSS)
   */
  private static formatGoogleCalendarDate(date: Date, hours: number, minutes: number, useUTC: boolean): string {
    const eventDate = new Date(date);
    eventDate.setHours(hours, minutes, 0, 0);
    
    if (useUTC) {
      return eventDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    } else {
      // Local time format (no Z suffix)
      const year = eventDate.getFullYear();
      const month = String(eventDate.getMonth() + 1).padStart(2, '0');
      const day = String(eventDate.getDate()).padStart(2, '0');
      const hour = String(eventDate.getHours()).padStart(2, '0');
      const min = String(eventDate.getMinutes()).padStart(2, '0');
      const sec = String(eventDate.getSeconds()).padStart(2, '0');
      
      return `${year}${month}${day}T${hour}${min}${sec}`;
    }
  }

  /**
   * Create event title
   */
  private static createEventTitle(tripPlan: TripPlan): string {
    return `Route 66 Trip: ${tripPlan.startCity} to ${tripPlan.endCity}`;
  }

  /**
   * Create event location
   */
  private static createEventLocation(tripPlan: TripPlan): string {
    return `${tripPlan.startCity} to ${tripPlan.endCity}`;
  }

  /**
   * Create detailed event description
   */
  private static createEventDescription(tripPlan: TripPlan, shareUrl?: string): string {
    const lines = [
      'Route 66 adventure generated from the Route 66 Explorer',
      '',
      `🛣️ Distance: ${tripPlan.totalDistance.toFixed(0)} miles`,
      `⏱️ Drive Time: ${this.formatDriveTime(tripPlan.totalDrivingTime)}`,
      `📅 Duration: ${tripPlan.totalDays} days`,
      ''
    ];

    // Add key stops summary
    if (tripPlan.segments && tripPlan.segments.length > 0) {
      lines.push('🎯 Key Highlights:');
      tripPlan.segments.slice(0, 3).forEach(segment => {
        if (segment.recommendedStops && segment.recommendedStops.length > 0) {
          const topStop = segment.recommendedStops[0];
          lines.push(`• ${topStop.name} (${segment.startCity})`);
        }
      });
      lines.push('');
    }

    // Add share URL if available
    if (shareUrl) {
      lines.push('📋 View full trip details:');
      lines.push(shareUrl);
      lines.push('');
    }

    lines.push('Plan your own Route 66 adventure at Route66Explorer.com');

    return lines.join('\n');
  }

  /**
   * Format drive time for display
   */
  private static formatDriveTime(hours: number): string {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  }

  /**
   * Track analytics (placeholder for future implementation)
   */
  static trackCalendarClick(tripPlan: TripPlan): void {
    console.log('📊 Google Calendar button clicked for trip:', {
      route: `${tripPlan.startCity} to ${tripPlan.endCity}`,
      totalDays: tripPlan.totalDays,
      totalDistance: tripPlan.totalDistance
    });
  }
}
