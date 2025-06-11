
import React, { useEffect, useState } from 'react';
import { MapPin, Clock, AlertCircle } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { GeographicAttractionService, NearbyAttraction } from '../services/attractions/GeographicAttractionService';
import { getDestinationCityWithState } from '../utils/DestinationUtils';
import ErrorBoundary from './ErrorBoundary';

interface SegmentNearbyAttractionsProps {
  segment: DailySegment;
  maxAttractions?: number;
}

const AttractionCard: React.FC<{ attraction: NearbyAttraction }> = ({ attraction }) => {
  const icon = GeographicAttractionService.getAttractionIcon(attraction);
  const typeLabel = GeographicAttractionService.getAttractionTypeLabel(attraction);
  
  return (
    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
      <div className="text-xl">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-800 truncate">
          {attraction.name}
        </div>
        <div className="text-sm text-gray-600 line-clamp-2">
          {attraction.description}
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
            {typeLabel}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {attraction.distanceFromCity.toFixed(1)} mi away
          </span>
        </div>
      </div>
    </div>
  );
};

const SegmentNearbyAttractions: React.FC<SegmentNearbyAttractionsProps> = ({ 
  segment, 
  maxAttractions = 4 
}) => {
  const [attractions, setAttractions] = useState<NearbyAttraction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  useEffect(() => {
    const loadAttractions = async () => {
      if (!segment?.endCity) {
        setError('No destination city provided');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      setDebugInfo('Starting attraction search...');
      
      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
        setError('Search timed out after 15 seconds');
        console.error('❌ Attraction search timeout for:', segment.endCity);
      }, 15000);
      
      try {
        // Extract city and state from endCity
        const { city, state } = getDestinationCityWithState(segment.endCity);
        
        console.log(`🎯 Loading attractions near ${city}, ${state} for segment ${segment.day}`);
        setDebugInfo(`Searching for attractions near ${city}, ${state}...`);
        
        if (!city) {
          throw new Error(`Could not extract city name from: ${segment.endCity}`);
        }
        
        const nearbyAttractions = await GeographicAttractionService.findAttractionsNearCity(
          city, 
          state, 
          40 // 40 mile radius
        );
        
        clearTimeout(timeoutId);
        
        console.log(`✅ Found ${nearbyAttractions.length} attractions near ${city}, ${state}`);
        setAttractions(nearbyAttractions.slice(0, maxAttractions));
        setDebugInfo(`Found ${nearbyAttractions.length} attractions`);
        
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('❌ Error loading attractions:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Failed to load attractions: ${errorMessage}`);
        setDebugInfo(`Error: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAttractions();
  }, [segment?.endCity, segment?.day, maxAttractions]);
  
  if (isLoading) {
    return (
      <div className="space-y-3">
        <h4 className="font-travel font-bold text-route66-vintage-brown mb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Nearby Attractions
        </h4>
        <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mr-3"></div>
          <div className="text-sm text-gray-600">
            <div>Finding attractions...</div>
            {debugInfo && <div className="text-xs text-gray-500 mt-1">{debugInfo}</div>}
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="space-y-3">
        <h4 className="font-travel font-bold text-route66-vintage-brown mb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Nearby Attractions
        </h4>
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-red-700">Search Failed</span>
          </div>
          <p className="text-sm text-red-600">{error}</p>
          {debugInfo && (
            <div className="text-xs text-red-500 mt-2 font-mono">
              Debug: {debugInfo}
            </div>
          )}
        </div>
      </div>
    );
  }
  
  if (attractions.length === 0) {
    return (
      <div className="space-y-3">
        <h4 className="font-travel font-bold text-route66-vintage-brown mb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Nearby Attractions
        </h4>
        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-700">No Results</span>
          </div>
          <p className="text-sm text-yellow-600">
            No specific attractions found near {segment.endCity}
          </p>
          {debugInfo && (
            <div className="text-xs text-yellow-500 mt-2">
              {debugInfo}
            </div>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      <h4 className="font-travel font-bold text-route66-vintage-brown mb-2 flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Nearby Attractions ({attractions.length})
      </h4>
      
      <div className="space-y-2">
        {attractions.map((attraction, index) => (
          <ErrorBoundary key={`${attraction.id}-${index}`} context={`AttractionCard-${index}`}>
            <AttractionCard attraction={attraction} />
          </ErrorBoundary>
        ))}
      </div>
      
      {attractions.length > 0 && (
        <div className="text-xs text-blue-600 italic text-center p-2 bg-blue-50 rounded border border-blue-200">
          ✨ Attractions within 40 miles of {segment.endCity}
        </div>
      )}
    </div>
  );
};

export default SegmentNearbyAttractions;
