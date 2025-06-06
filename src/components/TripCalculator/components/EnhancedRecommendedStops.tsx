
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Camera, Utensils, Bed } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';

interface EnhancedRecommendedStopsProps {
  segment: DailySegment;
  maxStops?: number;
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
  
  return userRelevantCategories.includes(stop.category || '');
};

const EnhancedRecommendedStops: React.FC<EnhancedRecommendedStopsProps> = ({ 
  segment, 
  maxStops = 5  // Increased from 3 to 5 to show more stops
}) => {
  // Get stops from multiple possible sources with enhanced validation
  const getValidatedStops = (): ValidatedStop[] => {
    const stops: ValidatedStop[] = [];
    
    console.log(`🔍 EnhancedRecommendedStops: Validating stops for Day ${segment.day}:`, {
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
  
  // Filter out route66_waypoint categories for user display
  const userRelevantStops = validStops.filter(isUserRelevantStop);

  // Get appropriate icon for stop category
  const getStopIcon = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'attraction':
      case 'historic_site':
        return <Star className="h-4 w-4" />;
      case 'restaurant':
      case 'diner':
        return <Utensils className="h-4 w-4" />;
      case 'lodging':
      case 'hotel':
      case 'motel':
        return <Bed className="h-4 w-4" />;
      case 'scenic_viewpoint':
      case 'photo_opportunity':
        return <Camera className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  // Get category color for badges
  const getCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'attraction':
      case 'historic_site':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'restaurant':
      case 'diner':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'lodging':
      case 'hotel':
      case 'motel':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'scenic_viewpoint':
      case 'photo_opportunity':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'destination_city':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'hidden_gem':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  console.log('🎯 EnhancedRecommendedStops filtering:', {
    segmentDay: segment.day,
    totalValidatedStops: validStops.length,
    userRelevantStops: userRelevantStops.length,
    filteredOutStops: validStops.length - userRelevantStops.length,
    maxStopsLimit: maxStops,
    willShowCount: Math.min(userRelevantStops.length, maxStops),
    userStopNames: userRelevantStops.map(s => s.name),
    filteredCategories: validStops.filter(s => !isUserRelevantStop(s)).map(s => s.category)
  });

  return (
    <div>
      <h4 className="font-travel font-bold text-route66-vintage-brown mb-3 flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Recommended Stops ({userRelevantStops.length})
      </h4>
      
      {userRelevantStops.length > 0 ? (
        <div className="space-y-3">
          {userRelevantStops.slice(0, maxStops).map((stop, index) => (
            <div 
              key={stop.id || `stop-${index}`}
              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-route66-border hover:shadow-sm transition-shadow"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-route66-primary rounded-full flex items-center justify-center text-white">
                  {getStopIcon(stop.category)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-route66-text-primary text-sm">
                  {stop.name}
                </div>
                
                {(stop.city_name || stop.state) && (
                  <div className="text-xs text-route66-text-secondary mt-1">
                    {[stop.city_name, stop.state].filter(Boolean).join(', ')}
                  </div>
                )}
                
                {stop.category && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs mt-2 ${getCategoryColor(stop.category)}`}
                  >
                    {stop.category.replace(/_/g, ' ')}
                  </Badge>
                )}
              </div>
            </div>
          ))}
          
          {userRelevantStops.length > maxStops && (
            <div className="text-xs text-route66-vintage-brown italic text-center p-3 bg-route66-background-alt rounded border border-route66-border">
              +{userRelevantStops.length - maxStops} more stops available
              <div className="text-xs text-route66-text-secondary mt-1">
                Expand card to see all recommended stops for this segment
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center p-4 bg-route66-background-alt rounded-lg border border-route66-border">
          <MapPin className="h-8 w-8 text-route66-text-secondary mx-auto mb-2" />
          <p className="text-sm text-route66-vintage-brown italic">
            Direct drive - no specific stops planned for this segment
          </p>
          <p className="text-xs text-route66-text-secondary mt-1">
            This is a travel day focused on covering distance efficiently
          </p>
        </div>
      )}
    </div>
  );
};

export default EnhancedRecommendedStops;
