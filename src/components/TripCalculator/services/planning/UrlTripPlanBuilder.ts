import { TripPlan, DailySegment } from './TripPlanBuilder';
import { Route66TripPlannerService } from '../Route66TripPlannerService';

export interface UrlTripBuildResult {
  success: boolean;
  tripPlan?: TripPlan;
  tripStartDate?: Date;
  error?: string;
}

export interface UrlTripParameters {
  start: string;
  end: string;
  days: number;
  tripStart?: Date;
  style?: 'balanced' | 'destination-focused';
  useLiveWeather?: boolean;
}

export class UrlTripPlanBuilder {
  /**
   * Build a trip plan from URL search parameters
   */
  static async buildTripFromUrl(searchParams: URLSearchParams): Promise<UrlTripBuildResult> {
    try {
      console.log('🔗 UrlTripPlanBuilder: Parsing URL parameters');

      // Parse required parameters
      const startCity = searchParams.get('start') || searchParams.get('startCity');
      const endCity = searchParams.get('end') || searchParams.get('endCity');
      const daysParam = searchParams.get('days') || searchParams.get('travelDays');

      if (!startCity || !endCity || !daysParam) {
        return {
          success: false,
          error: 'Missing required parameters: start, end, and days are required'
        };
      }

      const days = parseInt(daysParam, 10);
      if (isNaN(days) || days < 1 || days > 21) {
        return {
          success: false,
          error: 'Invalid days parameter: must be a number between 1 and 21'
        };
      }

      // Parse optional parameters - fix the trip style parsing
      const tripStyle = 'destination-focused'; // Always use destination-focused for now
      const tripStartDate = this.parseTripStartDate(searchParams);
      const useLiveWeather = searchParams.get('useLiveWeather') === 'true';

      console.log('🔗 UrlTripPlanBuilder: Parsed parameters:', {
        startCity,
        endCity,
        days,
        tripStyle,
        tripStartDate: tripStartDate?.toISOString(),
        useLiveWeather
      });

      // Build the trip plan using the existing service
      const tripPlan = await Route66TripPlannerService.planTrip(
        startCity,
        endCity,
        days,
        tripStyle
      );

      console.log('✅ UrlTripPlanBuilder: Trip plan created successfully:', {
        title: tripPlan.title,
        segments: tripPlan.segments.length,
        totalDays: tripPlan.totalDays
      });

      return {
        success: true,
        tripPlan,
        tripStartDate
      };

    } catch (error) {
      console.error('❌ UrlTripPlanBuilder: Error building trip from URL:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Generate a shareable URL for a trip plan
   */
  static generateShareUrl(
    tripPlan: TripPlan,
    tripStartDate?: Date,
    useLiveWeather: boolean = true
  ): string {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams();

    // Required parameters
    if (tripPlan.startCity && tripPlan.endCity) {
      params.set('start', tripPlan.startCity);
      params.set('end', tripPlan.endCity);
    } else if (tripPlan.segments.length > 0) {
      params.set('start', tripPlan.segments[0].startCity);
      params.set('end', tripPlan.segments[tripPlan.segments.length - 1].endCity);
    }

    params.set('days', tripPlan.totalDays.toString());

    // Optional parameters
    if (tripPlan.tripStyle && tripPlan.tripStyle !== 'balanced') {
      params.set('style', tripPlan.tripStyle);
    }

    if (tripStartDate) {
      params.set('tripStart', tripStartDate.toISOString().split('T')[0]);
    }

    if (useLiveWeather) {
      params.set('useLiveWeather', 'true');
    }

    const shareUrl = `${baseUrl}/shared-trip?${params.toString()}`;
    
    console.log('🔗 UrlTripPlanBuilder: Generated share URL:', {
      shareUrl,
      parameters: Object.fromEntries(params)
    });

    return shareUrl;
  }

  /**
   * Parse trip style from string parameter - always return destination-focused for now
   */
  private static parseTripStyle(styleParam: string | null): 'destination-focused' {
    return 'destination-focused';
  }

  /**
   * Parse trip start date from various possible URL parameters
   */
  private static parseTripStartDate(searchParams: URLSearchParams): Date | undefined {
    const possibleParams = [
      'tripStart',
      'startDate', 
      'start_date',
      'trip_start',
      'tripStartDate'
    ];

    for (const paramName of possibleParams) {
      const dateParam = searchParams.get(paramName);
      if (dateParam) {
        try {
          const parsedDate = new Date(dateParam);
          if (!isNaN(parsedDate.getTime())) {
            console.log('🔗 UrlTripPlanBuilder: Parsed trip start date:', {
              param: paramName,
              value: dateParam,
              parsedDate: parsedDate.toISOString()
            });
            return parsedDate;
          }
        } catch (error) {
          console.warn('⚠️ UrlTripPlanBuilder: Failed to parse date parameter:', {
            param: paramName,
            value: dateParam,
            error
          });
        }
      }
    }

    console.log('🔗 UrlTripPlanBuilder: No valid trip start date found in URL parameters');
    return undefined;
  }

  /**
   * Validate URL parameters without building the trip
   */
  static validateUrlParameters(searchParams: URLSearchParams): {
    isValid: boolean;
    errors: string[];
    parameters?: UrlTripParameters;
  } {
    const errors: string[] = [];

    // Check required parameters
    const startCity = searchParams.get('start') || searchParams.get('startCity');
    const endCity = searchParams.get('end') || searchParams.get('endCity');
    const daysParam = searchParams.get('days') || searchParams.get('travelDays');

    if (!startCity) errors.push('Missing start city parameter');
    if (!endCity) errors.push('Missing end city parameter');
    if (!daysParam) errors.push('Missing days parameter');

    if (daysParam) {
      const days = parseInt(daysParam, 10);
      if (isNaN(days) || days < 1 || days > 21) {
        errors.push('Days parameter must be a number between 1 and 21');
      }
    }

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    return {
      isValid: true,
      errors: [],
      parameters: {
        start: startCity!,
        end: endCity!,
        days: parseInt(daysParam!, 10),
        tripStart: this.parseTripStartDate(searchParams),
        style: this.parseTripStyle(searchParams.get('style') || searchParams.get('tripStyle')),
        useLiveWeather: searchParams.get('useLiveWeather') === 'true'
      }
    };
  }
}
