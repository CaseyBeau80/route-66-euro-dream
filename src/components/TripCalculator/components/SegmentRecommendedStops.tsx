
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import StopCard from './StopCard';

interface SegmentRecommendedStopsProps {
  segment: DailySegment;
}

// Define proper types for stops to avoid TypeScript inference issues
interface ValidatedStop {
  id: string;
  name: string;
  category?: string;
  city_name?: string;
  state?: string;
}

// Type guard to check if an object has the required stop properties
const isValidStopObject = (stop: any): stop is { name: string; id?: string; category?: string; city_name?: string; state?: string } => {
  return stop != null && 
         typeof stop === 'object' && 
         'name' in stop && 
         typeof stop.name === 'string' && 
         stop.name.trim() !== '';
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
          category: stop.category || 'attraction',
          city_name: stop.city_name || stop.state,
          state: stop.state
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
              category: 'attraction',
              city_name: segment.endCity,
              state: segment.destination?.state || 'Unknown'
            };
          } else {
            // TypeScript now knows this is an object with name property due to our filter
            const attractionObj = attraction as { name: string; id?: string; category?: string; city_name?: string; state?: string };
            return {
              id: `attraction-${index}-${Math.random()}`,
              name: attractionObj.name,
              category: 'attraction',
              city_name: segment.endCity,
              state: segment.destination?.state || 'Unknown'
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
  const maxDisplayed = 3;
  const additionalStopsCount = Math.max(0, validStops.length - maxDisplayed);

  console.log('🎯 SegmentRecommendedStops final render:', {
    segmentDay: segment.day,
    validatedStopsCount: validStops.length,
    maxDisplayed,
    additionalStopsCount,
    willShowAdditionalText: additionalStopsCount > 0,
    stopNames: validStops.map(s => s.name)
  });

  return (
    <div>
      <h4 className="font-travel font-bold text-route66-vintage-brown mb-2">
        Recommended Stops ({validStops.length})
      </h4>
      {validStops.length > 0 ? (
        <div className="space-y-2">
          {validStops.slice(0, maxDisplayed).map((stop) => (
            <StopCard key={stop.id} stop={stop} />
          ))}
          {additionalStopsCount > 0 && (
            <div className="text-xs text-route66-vintage-brown italic">
              +{additionalStopsCount} more stops (view in detailed breakdown)
            </div>
          )}
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
