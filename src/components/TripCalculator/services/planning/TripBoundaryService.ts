
import { TripStop } from '../../types/TripStop';
import { convertToTripStop } from '../../types/TripStop';

export class TripBoundaryService {
  /**
   * Find start and end stops with intelligent matching and fallbacks
   */
  static findBoundaryStops(
    startLocation: string,
    endLocation: string,
    allStops: any[]
  ): { 
    startStop: TripStop; 
    endStop: TripStop; 
    routeStops: TripStop[] 
  } {
    console.log(`🎯 TripBoundaryService: Finding boundary stops for "${startLocation}" to "${endLocation}"`);
    console.log(`📍 Available stops: ${allStops.length}`);

    // Convert all stops to TripStop format
    const tripStops = allStops.map(stop => convertToTripStop(stop));

    // Find start stop with flexible matching
    const startStop = this.findLocationWithFallback(startLocation, tripStops, 'start');
    
    // Find end stop with flexible matching
    const endStop = this.findLocationWithFallback(endLocation, tripStops, 'end');

    console.log(`✅ Boundary stops found:`, {
      start: `${startStop.name} (${startStop.state})`,
      end: `${endStop.name} (${endStop.state})`
    });

    // Filter stops to get the route between start and end
    const routeStops = this.getRouteStops(startStop, endStop, tripStops);

    return {
      startStop,
      endStop,
      routeStops
    };
  }

  /**
   * Find location with flexible matching and intelligent fallbacks
   */
  private static findLocationWithFallback(
    location: string,
    allStops: TripStop[],
    type: 'start' | 'end'
  ): TripStop {
    console.log(`🔍 Finding ${type} location: "${location}"`);

    // Step 1: Try exact name match
    let match = allStops.find(stop => 
      stop.name.toLowerCase() === location.toLowerCase() ||
      stop.city_name?.toLowerCase() === location.toLowerCase() ||
      stop.city?.toLowerCase() === location.toLowerCase()
    );

    if (match) {
      console.log(`✅ Exact match found: ${match.name}`);
      return match;
    }

    // Step 2: Try city, state format matching
    const [cityPart, statePart] = location.split(',').map(s => s.trim());
    if (cityPart && statePart) {
      match = allStops.find(stop => {
        const cityMatch = stop.city_name?.toLowerCase().includes(cityPart.toLowerCase()) ||
                         stop.name.toLowerCase().includes(cityPart.toLowerCase()) ||
                         stop.city?.toLowerCase().includes(cityPart.toLowerCase());
        const stateMatch = stop.state?.toLowerCase() === statePart.toLowerCase() ||
                          stop.state?.toLowerCase() === this.expandStateAbbreviation(statePart.toLowerCase());
        return cityMatch && stateMatch;
      });

      if (match) {
        console.log(`✅ City/State match found: ${match.name} (${match.state})`);
        return match;
      }
    }

    // Step 3: Try partial city name match
    if (cityPart) {
      match = allStops.find(stop => 
        stop.city_name?.toLowerCase().includes(cityPart.toLowerCase()) ||
        stop.name.toLowerCase().includes(cityPart.toLowerCase()) ||
        stop.city?.toLowerCase().includes(cityPart.toLowerCase())
      );

      if (match) {
        console.log(`✅ Partial city match found: ${match.name}`);
        return match;
      }
    }

    // Step 4: Geographic fallbacks based on known Route 66 endpoints
    console.log(`⚠️ No match found for "${location}", using geographic fallback`);
    
    if (type === 'start') {
      // For start locations, prefer Chicago area or eastern stops
      const easternStops = allStops
        .filter(stop => stop.longitude < -90) // East of -90 longitude
        .sort((a, b) => a.longitude - b.longitude); // Sort by longitude (easternmost first)
      
      if (easternStops.length > 0) {
        console.log(`🔄 Using eastern fallback: ${easternStops[0].name}`);
        return easternStops[0];
      }
    } else {
      // For end locations, prefer California or western stops
      const westernStops = allStops
        .filter(stop => stop.longitude > -115) // West of -115 longitude (California area)
        .sort((a, b) => b.longitude - a.longitude); // Sort by longitude (westernmost first)
      
      if (westernStops.length > 0) {
        console.log(`🔄 Using western fallback: ${westernStops[0].name}`);
        return westernStops[0];
      }
    }

    // Step 5: Last resort - use first or last stop
    const fallbackStop = type === 'start' ? allStops[0] : allStops[allStops.length - 1];
    console.log(`🚨 Last resort fallback: ${fallbackStop.name}`);
    return fallbackStop;
  }

  /**
   * Expand state abbreviations to full names
   */
  private static expandStateAbbreviation(abbrev: string): string {
    const stateMap: { [key: string]: string } = {
      'il': 'illinois',
      'mo': 'missouri', 
      'ks': 'kansas',
      'ok': 'oklahoma',
      'tx': 'texas',
      'nm': 'new mexico',
      'az': 'arizona',
      'ca': 'california'
    };
    return stateMap[abbrev.toLowerCase()] || abbrev;
  }

  /**
   * Get stops that form the route between start and end
   */
  private static getRouteStops(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[]
  ): TripStop[] {
    // Determine trip direction
    const isEastToWest = startStop.longitude < endStop.longitude;
    
    // Filter stops that are geographically between start and end
    const minLat = Math.min(startStop.latitude, endStop.latitude) - 2; // Add buffer
    const maxLat = Math.max(startStop.latitude, endStop.latitude) + 2;
    const minLng = Math.min(startStop.longitude, endStop.longitude) - 2;
    const maxLng = Math.max(startStop.longitude, endStop.longitude) + 2;

    const routeStops = allStops.filter(stop => 
      stop.id !== startStop.id &&
      stop.id !== endStop.id &&
      stop.latitude >= minLat &&
      stop.latitude <= maxLat &&
      stop.longitude >= minLng &&
      stop.longitude <= maxLng
    );

    // Sort by longitude to follow Route 66's east-west progression
    routeStops.sort((a, b) => {
      if (isEastToWest) {
        return a.longitude - b.longitude; // Sort west (ascending longitude)
      } else {
        return b.longitude - a.longitude; // Sort east (descending longitude)
      }
    });

    console.log(`🛣️ Route stops found: ${routeStops.length} stops between ${startStop.name} and ${endStop.name}`);
    
    return routeStops;
  }
}
