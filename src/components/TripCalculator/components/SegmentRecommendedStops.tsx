
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import StopCard from './StopCard';

interface SegmentRecommendedStopsProps {
  segment: DailySegment;
}

// Define proper types for stops to match TripStop interface
interface ValidatedStop {
  id: string;
  name: string;
  description: string;
  city_name: string;
  state: string;
  image_url?: string;
  latitude: number;
  longitude: number;
  category: string;
  is_major_stop?: boolean;
  is_official_destination?: boolean;
}

// Type guard to check if an object has the required stop properties
const isValidStopObject = (stop: any): stop is { name: string; id?: string; category?: string; city_name?: string; state?: string; description?: string; latitude?: number; longitude?: number; image_url?: string } => {
  return stop != null && 
         typeof stop === 'object' && 
         'name' in stop && 
         typeof stop.name === 'string' && 
         stop.name.trim() !== '';
};

// Filter function to exclude route66_waypoint categories from user display
const isUserRelevantStop = (stop: ValidatedStop): boolean => {
  const userRelevantCategories = [
    'attraction',
    'hidden_gem', 
    'diner',
    'motel',
    'museum',
    'destination_city'
  ];
  
  return userRelevantCategories.includes(stop.category);
};

const SegmentRecommendedStops: React.FC<SegmentRecommendedStopsProps> = ({ segment }) => {
  // Get validated stops from multiple possible sources with enhanced validation
  const getValidatedStops = (): ValidatedStop[] => {
    const stops: ValidatedStop[] = [];
    
    console.log(`🔍 SegmentRecommendedStops: Validating stops for Day ${segment.day}:`, {
      recommendedStops: segment.recommendedStops?.length || 0,
      attractions: segment.attractions?.length || 0,
      recommendedStopsData: segment.recommendedStops,
      attractionsData: segment.attractions
    });
    
    // Primary source: recommendedStops array
    if (segment.recommendedStops && Array.isArray(segment.recommendedStops)) {
      const validRecommendedStops = segment.recommendedStops
        .filter((stop, index) => {
          const isValid = isValidStopObject(stop);
          
          console.log(`🎯 Stop ${index + 1} validation:`, {
            stop: stop,
            isValid,
            name: isValid ? stop.name : 'invalid'
          });
          
          return isValid;
        })
        .map((stop, index): ValidatedStop => ({
          id: stop.id || `recommended-${index}-${Math.random()}`,
          name: stop.name,
          description: stop.description || 'Route 66 stop',
          category: stop.category || 'attraction',
          city_name: stop.city_name || stop.state || 'Unknown',
          state: stop.state || 'Unknown',
          image_url: stop.image_url,
          latitude: stop.latitude || 0,
          longitude: stop.longitude || 0
        }));
      
      console.log(`✅ Valid recommended stops: ${validRecommendedStops.length}`, validRecommendedStops.map(s => s.name));
      stops.push(...validRecommendedStops);
    }
    
    // Fallback: attractions array (for backward compatibility)
    if (stops.length === 0 && segment.attractions && Array.isArray(segment.attractions)) {
      console.log(`🔄 Falling back to attractions array:`, segment.attractions);
      
      const attractionStops = segment.attractions
        .filter((attraction, index) => {
          const isValid = attraction != null && 
            (typeof attraction === 'string' ? attraction.trim() !== '' : 
             isValidStopObject(attraction));
          
          console.log(`🎯 Attraction ${index + 1} validation:`, {
            attraction,
            isValid,
            type: typeof attraction
          });
          
          return isValid;
        })
        .map((attraction, index): ValidatedStop => {
          // Handle both string and object attractions explicitly
          if (typeof attraction === 'string') {
            return {
              id: `attraction-${index}-${Math.random()}`,
              name: attraction,
              description: 'Route 66 attraction',
              category: 'attraction',
              city_name: segment.endCity || 'Unknown',
              state: segment.destination?.state || 'Unknown',
              latitude: 0,
              longitude: 0
            };
          } else {
            // TypeScript now knows this is an object with name property due to our filter
            const attractionObj = attraction as { name: string; id?: string; category?: string; city_name?: string; state?: string; description?: string; latitude?: number; longitude?: number; image_url?: string };
            return {
              id: `attraction-${index}-${Math.random()}`,
              name: attractionObj.name,
              description: attractionObj.description || 'Route 66 attraction',
              category: attractionObj.category || 'attraction',
              city_name: attractionObj.city_name || segment.endCity || 'Unknown',
              state: attractionObj.state || segment.destination?.state || 'Unknown',
              image_url: attractionObj.image_url,
              latitude: attractionObj.latitude || 0,
              longitude: attractionObj.longitude || 0
            };
          }
        });
      
      console.log(`✅ Valid attraction stops: ${attractionStops.length}`, attractionStops.map(s => s.name));
      stops.push(...attractionStops);
    }
    
    // Remove duplicates based on name
    const uniqueStops = stops.filter((stop, index, self) => 
      index === self.findIndex(s => s.name.toLowerCase() === stop.name.toLowerCase())
    );
    
    console.log(`🎯 Final unique stops: ${uniqueStops.length}`, uniqueStops.map(s => s.name));
    
    return uniqueStops;
  };

  const validStops = getValidatedStops();
  
  // Filter out route66_waypoint categories for user display
  const userRelevantStops = validStops.filter(isUserRelevantStop);
  
  console.log('🎯 SegmentRecommendedStops filtering:', {
    segmentDay: segment.day,
    totalValidatedStops: validStops.length,
    userRelevantStops: userRelevantStops.length,
    filteredOutStops: validStops.length - userRelevantStops.length,
    userStopNames: userRelevantStops.map(s => s.name),
    filteredCategories: validStops.filter(s => !isUserRelevantStop(s)).map(s => s.category)
  });

  return (
    <div>
      <h4 className="font-travel font-bold text-route66-vintage-brown mb-2">
        Recommended Stops ({userRelevantStops.length})
      </h4>
      {userRelevantStops.length > 0 ? (
        <div className="space-y-2">
          {userRelevantStops.map((stop) => (
            <StopCard key={stop.id} stop={stop} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-route66-vintage-brown italic">
          Direct drive - no specific stops planned for this segment
        </p>
      )}
    </div>
  );
};

export default SegmentRecommendedStops;
