
import { TripStop, convertToTripStop } from '../../types/TripStop';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { DeterministicIdGenerator } from '../../utils/deterministicId';

// ENHANCED filter function to include more user-relevant categories
export const isUserRelevantStop = (stop: TripStop): boolean => {
  const userRelevantCategories = [
    'attraction',
    'hidden_gem', 
    'diner',
    'motel',
    'museum',
    'destination_city',
    'restaurant',
    'lodging',
    'hotel',
    'historic_site',
    'scenic_viewpoint',
    'photo_opportunity',
    'landmark',
    'cultural_site',
    'venue',
    'music venue',
    'quirky',
    'Museum',
    'Diner',
    'Attraction',
    'Hidden Gem',
    'Restaurant',
    'Motel',
    'Hotel',
    'Venue',
    'Music Venue',
    'Quirky'
  ];
  
  // Make the comparison case-insensitive
  const stopCategory = (stop.category || '').toLowerCase();
  return userRelevantCategories.some(cat => cat.toLowerCase() === stopCategory);
};

// ENHANCED geographic filtering with proper route direction checking
export const isGeographicallyRelevant = (
  stop: TripStop,
  startCity: string,
  endCity: string,
  startLat?: number,
  startLng?: number,
  endLat?: number,
  endLng?: number
): boolean => {
  // Skip geographic validation if coordinates are missing
  if (!stop.latitude || !stop.longitude || !startLat || !startLng || !endLat || !endLng) {
    // For stops without coordinates, do basic city name filtering
    const stopCityName = stop.city_name?.toLowerCase() || stop.name?.toLowerCase() || '';
    const startCityName = startCity.toLowerCase();
    const endCityName = endCity.toLowerCase();
    
    // Don't include the start city as a stop (like Chicago when starting from Joliet)
    if (stopCityName.includes(startCityName.split(',')[0]) || startCityName.includes(stopCityName)) {
      console.log(`🚫 Filtering out start city stop: ${stop.name} (matches start city ${startCity})`);
      return false;
    }
    
    return true;
  }
  
  // Calculate distances
  const distanceFromStart = Math.sqrt(
    Math.pow((stop.latitude - startLat) * 69, 2) + Math.pow((stop.longitude - startLng) * 69, 2)
  );
  
  const distanceFromEnd = Math.sqrt(
    Math.pow((stop.latitude - endLat) * 69, 2) + Math.pow((stop.longitude - endLng) * 69, 2)
  );
  
  const directDistance = Math.sqrt(
    Math.pow((endLat - startLat) * 69, 2) + Math.pow((endLng - startLng) * 69, 2)
  );
  
  // Check if stop is roughly along the route using triangle inequality
  const totalViaStop = distanceFromStart + distanceFromEnd;
  const detourFactor = totalViaStop / directDistance;
  
  // More strict filtering - stop should be roughly along the path
  const isAlongRoute = detourFactor <= 1.3; // Allow max 30% detour
  
  // Also check that we're moving in the right direction
  const movingTowardDestination = distanceFromStart < directDistance && distanceFromEnd < directDistance;
  
  // Don't include stops that are too close to the start (like Chicago when starting from Joliet)
  const notTooCloseToStart = distanceFromStart > 20; // At least 20 miles from start
  
  const isValid = isAlongRoute && movingTowardDestination && notTooCloseToStart;
  
  console.log(`🔍 Geographic validation for ${stop.name}:`, {
    distanceFromStart: Math.round(distanceFromStart),
    distanceFromEnd: Math.round(distanceFromEnd),
    directDistance: Math.round(directDistance),
    detourFactor: detourFactor.toFixed(2),
    isAlongRoute,
    movingTowardDestination,
    notTooCloseToStart,
    isValid
  });
  
  return isValid;
};

// Enhanced type guard for validating stop data with better TypeScript support
const isValidStopData = (stop: any): stop is (string | { name: string; [key: string]: any }) => {
  if (typeof stop === 'string') {
    return stop.trim() !== '';
  }
  return stop != null && 
         typeof stop === 'object' && 
         'name' in stop && 
         typeof stop.name === 'string' && 
         stop.name.trim() !== '';
};

// Safe conversion helper with DETERMINISTIC ID generation
const convertStopToTripStop = (
  stop: string | { name: string; [key: string]: any }, 
  index: number, 
  fallbackCategory: string,
  segmentKey?: string
): TripStop => {
  if (typeof stop === 'string') {
    // Generate deterministic ID based on stop name, index, category, and segment
    const deterministicId = DeterministicIdGenerator.generateId(
      fallbackCategory, 
      stop, 
      index, 
      segmentKey || 'unknown'
    );
    
    return convertToTripStop({
      name: stop,
      id: deterministicId,
      description: `Discover ${stop} along your Route 66 journey`,
      category: 'attraction',
      city_name: 'Unknown',
      city: 'Unknown', // Add city property
      state: 'Unknown',
      latitude: 0,
      longitude: 0
    });
  } else {
    // Generate deterministic ID for object stops
    const deterministicId = stop.id || DeterministicIdGenerator.generateId(
      fallbackCategory,
      stop.name,
      index,
      segmentKey || 'unknown'
    );
    
    // Manually copy properties to avoid TypeScript spread issues
    const baseStop = {
      name: stop.name,
      id: deterministicId,
      description: stop.description || `Discover ${stop.name} along your Route 66 journey`,
      category: stop.category || 'attraction',
      city_name: stop.city_name || 'Unknown',
      city: stop.city || stop.city_name || 'Unknown', // Add city property
      state: stop.state || 'Unknown',
      latitude: stop.latitude || 0,
      longitude: stop.longitude || 0,
      image_url: stop.image_url,
      is_major_stop: stop.is_major_stop,
      is_official_destination: stop.is_official_destination
    };
    return convertToTripStop(baseStop);
  }
};

// Create stable segment key for memoization (moved from EnhancedRecommendedStops)
export const createStableSegmentKey = (segment: DailySegment): string => {
  // Use only stable, primitive values for the key
  const stableProps = {
    day: segment.day || 0,
    startCity: segment.startCity || '',
    endCity: segment.endCity || '',
    recommendedStopsCount: Array.isArray(segment.recommendedStops) ? segment.recommendedStops.length : 0,
    attractionsCount: Array.isArray(segment.attractions) ? segment.attractions.length : 0
  };
  
  return `seg-${stableProps.day}-${stableProps.startCity}-${stableProps.endCity}-r${stableProps.recommendedStopsCount}-a${stableProps.attractionsCount}`;
};

// Helper function to extract coordinates from city names or stops
const getCoordinatesFromSegment = (segment: DailySegment): {
  startLat?: number, startLng?: number, endLat?: number, endLng?: number
} => {
  // Try to extract coordinates from recommended stops that match start/end cities
  if (segment.recommendedStops && Array.isArray(segment.recommendedStops)) {
    const startCityName = segment.startCity?.split(',')[0]?.toLowerCase();
    const endCityName = segment.endCity?.split(',')[0]?.toLowerCase();
    
    let startCoords: { lat?: number, lng?: number } = {};
    let endCoords: { lat?: number, lng?: number } = {};
    
    for (const stop of segment.recommendedStops) {
      if (typeof stop === 'object' && stop.latitude && stop.longitude) {
        const stopCityName = stop.city_name?.toLowerCase() || stop.name?.toLowerCase();
        
        if (stopCityName?.includes(startCityName) && !startCoords.lat) {
          startCoords = { lat: stop.latitude, lng: stop.longitude };
        }
        if (stopCityName?.includes(endCityName) && !endCoords.lat) {
          endCoords = { lat: stop.latitude, lng: stop.longitude };
        }
      }
    }
    
    return {
      startLat: startCoords.lat,
      startLng: startCoords.lng,
      endLat: endCoords.lat,
      endLng: endCoords.lng
    };
  }
  
  return {};
};

// Get validated stops from multiple possible sources with enhanced validation
export const getValidatedStops = (segment: DailySegment): TripStop[] => {
  const stops: TripStop[] = [];
  const segmentKey = createStableSegmentKey(segment);
  
  console.log(`🔍 ENHANCED VALIDATION: Day ${segment.day}:`, {
    recommendedStops: segment.recommendedStops?.length || 0,
    attractions: segment.attractions?.length || 0,
    startCity: segment.startCity,
    endCity: segment.endCity,
    segmentKey
  });
  
  // Get coordinates for geographic filtering
  const { startLat, startLng, endLat, endLng } = getCoordinatesFromSegment(segment);
  
  // Primary source: recommendedStops array
  if (segment.recommendedStops && Array.isArray(segment.recommendedStops)) {
    const validRecommendedStops = segment.recommendedStops
      .filter((stop, index) => {
        const isValid = isValidStopData(stop);
        
        console.log(`🎯 Stop ${index + 1} validation:`, {
          stop: stop,
          isValid,
          name: isValid ? (typeof stop === 'string' ? stop : stop.name) : 'invalid',
          category: typeof stop === 'object' && stop && 'category' in stop ? stop.category : 'unknown'
        });
        
        return isValid;
      })
      .map((stop, index) => convertStopToTripStop(stop, index, 'recommended', segmentKey))
      .filter(stop => {
        // Apply geographic filtering
        const isGeographicallyValid = isGeographicallyRelevant(
          stop,
          segment.startCity || '',
          segment.endCity || '',
          startLat,
          startLng,
          endLat,
          endLng
        );
        
        if (!isGeographicallyValid) {
          console.log(`🚫 Filtering out geographically irrelevant stop: ${stop.name}`);
        }
        
        return isGeographicallyValid;
      });
    
    console.log(`✅ Valid recommended stops after geographic filtering: ${validRecommendedStops.length}`);
    stops.push(...validRecommendedStops);
  }
  
  // Fallback: attractions array (for backward compatibility)
  if (stops.length === 0 && segment.attractions && Array.isArray(segment.attractions)) {
    console.log(`🔄 Falling back to attractions array:`, segment.attractions);
    
    const attractionStops = segment.attractions
      .filter((attraction, index) => {
        const isValid = isValidStopData(attraction);
        
        console.log(`🎯 Attraction ${index + 1} validation:`, {
          attraction,
          isValid,
          type: typeof attraction
        });
        
        return isValid;
      })
      .map((attraction, index) => convertStopToTripStop(attraction, index, 'attraction', segmentKey))
      .filter(stop => {
        // Apply geographic filtering to attractions as well
        const isGeographicallyValid = isGeographicallyRelevant(
          stop,
          segment.startCity || '',
          segment.endCity || '',
          startLat,
          startLng,
          endLat,
          endLng
        );
        
        if (!isGeographicallyValid) {
          console.log(`🚫 Filtering out geographically irrelevant attraction: ${stop.name}`);
        }
        
        return isGeographicallyValid;
      });
    
    console.log(`✅ Valid attraction stops after geographic filtering: ${attractionStops.length}`);
    stops.push(...attractionStops);
  }
  
  // FALLBACK: If still no stops, create synthetic ones based on known Route 66 attractions
  if (stops.length === 0) {
    console.log(`🚨 NO STOPS FOUND - Creating fallback stops for ${segment.startCity} → ${segment.endCity}`);
    
    const fallbackStops = createFallbackStops(segment, segmentKey);
    console.log(`🔄 Created ${fallbackStops.length} fallback stops:`, fallbackStops.map(s => s.name));
    stops.push(...fallbackStops);
  }
  
  // Remove duplicates based on name
  const uniqueStops = stops.filter((stop, index, self) => 
    index === self.findIndex(s => s.name.toLowerCase() === stop.name.toLowerCase())
  );
  
  console.log(`🎯 Final unique stops: ${uniqueStops.length}`, uniqueStops.map(s => `${s.name} (${s.category})`));
  
  return uniqueStops;
};

// Create fallback stops for segments with no data
const createFallbackStops = (segment: DailySegment, segmentKey: string): TripStop[] => {
  const route66Attractions: Record<string, Omit<TripStop, 'id'>[]> = {
    'joplin': [
      {
        name: 'Spook Light',
        description: 'A mysterious light phenomenon that has puzzled visitors for decades along Route 66',
        category: 'attraction',
        city_name: 'Joplin',
        city: 'Joplin', // Add city property
        state: 'MO',
        latitude: 37.0262,
        longitude: -94.8591
      },
      {
        name: 'Schifferdecker Park',
        description: 'A beautiful park perfect for a Route 66 road trip break',
        category: 'attraction',
        city_name: 'Joplin',
        city: 'Joplin', // Add city property
        state: 'MO',
        latitude: 37.0842,
        longitude: -94.5133
      }
    ],
    'oklahoma': [
      {
        name: 'Blue Whale of Catoosa',
        description: 'Iconic Route 66 roadside attraction - a giant blue whale sculpture',
        category: 'attraction',
        city_name: 'Catoosa',
        city: 'Catoosa', // Add city property
        state: 'OK',
        latitude: 36.1851,
        longitude: -95.7317
      },
      {
        name: 'Totem Pole Park',
        description: 'Fascinating collection of hand-carved totem poles along Route 66',
        category: 'attraction',
        city_name: 'Foyil',
        city: 'Foyil', // Add city property
        state: 'OK',
        latitude: 36.4395,
        longitude: -95.5122
      },
      {
        name: 'Golden Driller',
        description: 'Towering statue celebrating Oklahoma\'s oil heritage',
        category: 'attraction',
        city_name: 'Tulsa',
        city: 'Tulsa', // Add city property
        state: 'OK',
        latitude: 36.1540,
        longitude: -95.9928
      }
    ]
  };
  
  const startKey = segment.startCity.toLowerCase();
  const endKey = segment.endCity.toLowerCase();
  
  const relevantStops: TripStop[] = [];
  
  // Check for regional matches
  if (startKey.includes('joplin') || endKey.includes('oklahoma')) {
    const joplinStops = route66Attractions.joplin?.map((stop, index) => ({
      ...stop,
      id: DeterministicIdGenerator.generateId('fallback-joplin', stop.name, index, segmentKey)
    })) || [];
    
    const oklahomaStops = route66Attractions.oklahoma?.map((stop, index) => ({
      ...stop,
      id: DeterministicIdGenerator.generateId('fallback-oklahoma', stop.name, index, segmentKey)
    })) || [];
    
    relevantStops.push(...joplinStops, ...oklahomaStops);
  }
  
  return relevantStops.slice(0, 3); // Limit to 3 fallback stops
};
