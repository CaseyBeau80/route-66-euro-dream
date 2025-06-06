
import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { getValidatedStops, isUserRelevantStop } from './utils/stopValidation';
import { EnhancedStopSelectionService } from '../services/planning/EnhancedStopSelectionService';
import { SupabaseDataService, TripStop } from '../services/data/SupabaseDataService';
import StopItem from './StopItem';
import StopsEmpty from './StopsEmpty';

interface EnhancedRecommendedStopsProps {
  segment: DailySegment;
  maxStops?: number;
}

const EnhancedRecommendedStops: React.FC<EnhancedRecommendedStopsProps> = ({ 
  segment, 
  maxStops = 5
}) => {
  const [enhancedStops, setEnhancedStops] = useState<TripStop[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get standard validated stops
  const validStops = getValidatedStops(segment);
  const userRelevantStops = validStops.filter(isUserRelevantStop);
  
  // If we have very few stops, try enhanced selection
  useEffect(() => {
    const tryEnhancedSelection = async () => {
      if (userRelevantStops.length < 2 && segment.startCity && segment.endCity) {
        setIsLoading(true);
        console.log(`🚀 TRIGGERING ENHANCED SELECTION for ${segment.startCity} → ${segment.endCity}`);
        
        try {
          // Create mock start/end stops for the enhanced selection
          const startStop: TripStop = {
            id: 'temp-start',
            name: segment.startCity,
            description: 'Start location',
            city_name: segment.startCity,
            state: segment.origin?.state || 'Unknown',
            latitude: segment.origin?.latitude || 0,
            longitude: segment.origin?.longitude || 0,
            category: 'destination_city'
          };
          
          const endStop: TripStop = {
            id: 'temp-end',
            name: segment.endCity,
            description: 'End location',
            city_name: segment.endCity,
            state: segment.destination?.state || 'Unknown',
            latitude: segment.destination?.latitude || 0,
            longitude: segment.destination?.longitude || 0,
            category: 'destination_city'
          };
          
          const allStops = await SupabaseDataService.fetchAllStops();
          const enhanced = await EnhancedStopSelectionService.selectStopsForSegment(
            startStop, endStop, allStops, maxStops
          );
          
          console.log(`✅ Enhanced selection found ${enhanced.length} stops`);
          setEnhancedStops(enhanced);
        } catch (error) {
          console.error('❌ Enhanced selection failed:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    tryEnhancedSelection();
  }, [segment.startCity, segment.endCity, userRelevantStops.length, maxStops]);
  
  // Combine and deduplicate stops
  const combinedStops = [...userRelevantStops];
  
  // Add enhanced stops that aren't already in the list
  enhancedStops.forEach(enhancedStop => {
    const alreadyExists = combinedStops.some(stop => 
      stop.name.toLowerCase() === enhancedStop.name.toLowerCase()
    );
    if (!alreadyExists) {
      combinedStops.push({
        id: enhancedStop.id,
        name: enhancedStop.name,
        category: enhancedStop.category,
        city_name: enhancedStop.city_name,
        state: enhancedStop.state
      });
    }
  });
  
  const finalStops = combinedStops.slice(0, maxStops);

  console.log('🎯 EnhancedRecommendedStops final result:', {
    segmentDay: segment.day,
    route: `${segment.startCity} → ${segment.endCity}`,
    originalStops: userRelevantStops.length,
    enhancedStops: enhancedStops.length,
    finalStops: finalStops.length,
    isLoading,
    stopNames: finalStops.map(s => s.name)
  });

  return (
    <div>
      <h4 className="font-travel font-bold text-route66-vintage-brown mb-3 flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Recommended Stops ({finalStops.length})
        {isLoading && <span className="text-xs text-gray-500">(searching...)</span>}
      </h4>
      
      {finalStops.length > 0 ? (
        <div className="space-y-3">
          {finalStops.map((stop, index) => (
            <StopItem key={stop.id || `stop-${index}`} stop={stop} index={index} />
          ))}
          
          {enhancedStops.length > 0 && (
            <div className="text-xs text-blue-600 italic text-center p-2 bg-blue-50 rounded border border-blue-200">
              ✨ Enhanced selection found {enhancedStops.length} additional stops
            </div>
          )}
        </div>
      ) : isLoading ? (
        <div className="text-center p-4 bg-route66-background-alt rounded-lg border border-route66-border">
          <div className="animate-spin h-6 w-6 border-2 border-route66-primary border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-sm text-route66-vintage-brown">
            Searching for Route 66 attractions...
          </p>
        </div>
      ) : (
        <StopsEmpty />
      )}
    </div>
  );
};

export default EnhancedRecommendedStops;
