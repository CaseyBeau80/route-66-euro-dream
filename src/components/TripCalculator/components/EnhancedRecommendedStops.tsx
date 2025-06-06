
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Camera, Utensils, Bed } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';

interface EnhancedRecommendedStopsProps {
  segment: DailySegment;
  maxStops?: number;
}

const EnhancedRecommendedStops: React.FC<EnhancedRecommendedStopsProps> = ({ 
  segment, 
  maxStops = 3 
}) => {
  // Get stops from multiple possible sources with validation
  const getValidatedStops = () => {
    const stops: Array<{
      id: string;
      name: string;
      category?: string;
      city_name?: string;
      state?: string;
    }> = [];
    
    // Primary source: recommendedStops array
    if (segment.recommendedStops && Array.isArray(segment.recommendedStops)) {
      const validRecommendedStops = segment.recommendedStops
        .filter((stop): stop is NonNullable<typeof stop> => stop != null && typeof stop === 'object' && 'name' in stop && stop.name != null)
        .map(stop => ({
          id: stop.id || `stop-${Math.random()}`,
          name: stop.name,
          category: stop.category,
          city_name: stop.city_name,
          state: stop.state
        }));
      stops.push(...validRecommendedStops);
    }
    
    // Fallback: attractions array (for backward compatibility)
    if (stops.length === 0 && segment.attractions && Array.isArray(segment.attractions)) {
      const attractionStops = segment.attractions
        .filter((attraction): attraction is NonNullable<typeof attraction> => attraction != null)
        .map((attraction, index) => ({
          id: `attraction-${index}`,
          name: typeof attraction === 'string' ? attraction : (attraction as any).name || 'Unknown',
          category: 'attraction',
          city_name: segment.endCity,
          state: segment.destination?.state || 'Unknown'
        }));
      stops.push(...attractionStops);
    }
    
    return stops.filter(stop => stop.name && stop.name.trim() !== '');
  };

  const validStops = getValidatedStops();

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
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'scenic_viewpoint':
      case 'photo_opportunity':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  console.log('🎯 EnhancedRecommendedStops validation:', {
    segmentDay: segment.day,
    originalRecommendedStops: segment.recommendedStops?.length || 0,
    originalAttractions: segment.attractions?.length || 0,
    validatedStops: validStops.length,
    stopNames: validStops.map(s => s.name)
  });

  return (
    <div>
      <h4 className="font-travel font-bold text-route66-vintage-brown mb-3 flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Recommended Stops ({validStops.length})
      </h4>
      
      {validStops.length > 0 ? (
        <div className="space-y-3">
          {validStops.slice(0, maxStops).map((stop, index) => (
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
          
          {validStops.length > maxStops && (
            <div className="text-xs text-route66-vintage-brown italic text-center p-3 bg-route66-background-alt rounded border border-route66-border">
              +{validStops.length - maxStops} more stops available in detailed view
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
