
import { TripStop } from '../../types/TripStop';
import { convertToTripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

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
      end: `${endStop.name} (${endStop.state})`,
      startCoords: `${startStop.latitude}, ${startStop.longitude}`,
      endCoords: `${endStop.latitude}, ${endStop.longitude}`
    });

    // Calculate distance between start and end to verify
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    console.log(`📏 Total distance from ${startStop.name} to ${endStop.name}: ${totalDistance.toFixed(1)} miles`);

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

    // Step 4: Geographic fallbacks with specific coordinates for major cities
    console.log(`⚠️ No match found for "${location}", using geographic fallback`);
    
    if (type === 'start') {
      // For Chicago/start locations, find the easternmost stop or create a default
      const easternStops = allStops
        .filter(stop => stop.longitude < -85) // East of -85 longitude
        .sort((a, b) => a.longitude - b.longitude);
      
      if (easternStops.length > 0) {
        console.log(`🔄 Using eastern fallback: ${easternStops[0].name}`);
        return easternStops[0];
      }
      
      // Create Chicago fallback if no eastern stops found
      return this.createFallbackStop('Chicago, IL', 41.8781, -87.6298, 'start');
    } else {
      // For Los Angeles/end locations, find the westernmost stop or create a default
      const westernStops = allStops
        .filter(stop => stop.longitude > -120) // West of -120 longitude
        .sort((a, b) => b.longitude - a.longitude);
      
      if (westernStops.length > 0) {
        console.log(`🔄 Using western fallback: ${westernStops[0].name}`);
        return westernStops[0];
      }
      
      // Create Los Angeles fallback if no western stops found
      return this.createFallbackStop('Los Angeles, CA', 34.0522, -118.2437, 'end');
    }
  }

  /**
   * Create a fallback stop with valid coordinates
   */
  private static createFallbackStop(
    name: string, 
    latitude: number, 
    longitude: number, 
    type: 'start' | 'end'
  ): TripStop {
    const [cityName, state] = name.split(', ');
    return {
      id: `fallback-${type}-${Date.now()}`,
      name: cityName,
      description: `${name} - Route 66 ${type} point`,
      category: 'destination_city',
      city_name: cityName,
      city: cityName,
      state: state,
      latitude: latitude,
      longitude: longitude,
      is_major_stop: true,
      is_official_destination: true
    };
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
    
    // Calculate the geographic bounds with a reasonable buffer
    const minLat = Math.min(startStop.latitude, endStop.latitude) - 2;
    const maxLat = Math.max(startStop.latitude, endStop.latitude) + 2;
    const minLng = Math.min(startStop.longitude, endStop.longitude) - 2;
    const maxLng = Math.max(startStop.longitude, endStop.longitude) + 2;

    // Filter stops that are geographically between start and end
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
    
    // Log distances to verify they're reasonable
    if (routeStops.length > 0) {
      const firstDistance = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        routeStops[0].latitude, routeStops[0].longitude
      );
      console.log(`📏 Distance to first route stop: ${firstDistance.toFixed(1)} miles`);
    }
    
    return routeStops;
  }
}
