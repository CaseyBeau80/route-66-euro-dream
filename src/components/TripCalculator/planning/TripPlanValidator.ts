
import { toast } from '@/hooks/use-toast';
import { EnhancedSupabaseDataService } from '../services/data/EnhancedSupabaseDataService';

interface TripStop {
  id: string;
  name: string;
  city_name: string;
  state: string;
  category: string;
}

interface ValidationResult {
  startStop: TripStop;
  endStop: TripStop;
}

export class TripPlanValidator {
  static validateStops(
    startStop: TripStop | undefined,
    endStop: TripStop | undefined,
    startCityName: string,
    endCityName: string,
    allStops: TripStop[]
  ): ValidationResult {
    
    // Enhanced error messages with data source context
    const dataSourceContext = EnhancedSupabaseDataService.isUsingFallback() 
      ? ' (currently using offline data due to connectivity issues)'
      : '';
    
    if (!startStop) {
      const availableStarts = this.findSimilarCities(startCityName, allStops);
      const suggestionText = availableStarts.length > 0 
        ? ` Did you mean: ${availableStarts.slice(0, 3).join(', ')}?`
        : '';
      
      throw new Error(
        `Start location "${startCityName}" not found in Route 66 destinations${dataSourceContext}.${suggestionText} Please select from available Route 66 cities.`
      );
    }

    if (!endStop) {
      const availableEnds = this.findSimilarCities(endCityName, allStops);
      const suggestionText = availableEnds.length > 0 
        ? ` Did you mean: ${availableEnds.slice(0, 3).join(', ')}?`
        : '';
      
      throw new Error(
        `End location "${endCityName}" not found in Route 66 destinations${dataSourceContext}.${suggestionText} Please select from available Route 66 cities.`
      );
    }

    if (startStop.id === endStop.id) {
      throw new Error('Start and end locations cannot be the same. Please select different cities for your Route 66 journey.');
    }

    // Warn about data source if using fallback
    if (EnhancedSupabaseDataService.isUsingFallback()) {
      const dataSourceInfo = EnhancedSupabaseDataService.getDataSourceInfo();
      console.warn(`⚠️ Validation: Using fallback data (${dataSourceInfo?.citiesAvailable} cities). Reason: ${dataSourceInfo?.fallbackReason}`);
      
      // Show toast notification about data limitations
      toast({
        title: "Limited Data Source",
        description: `Currently using offline data (${dataSourceInfo?.citiesAvailable} cities available). Some destinations may not be available.`,
        variant: "default"
      });
    }

    return { startStop, endStop };
  }

  private static findSimilarCities(searchTerm: string, allStops: TripStop[]): string[] {
    const searchLower = searchTerm.toLowerCase();
    const destinationCities = allStops.filter(stop => stop.category === 'destination_city');
    
    return destinationCities
      .filter(stop => {
        const cityName = stop.city_name.toLowerCase();
        const stateName = stop.state.toLowerCase();
        
        // Look for partial matches
        return cityName.includes(searchLower) || 
               searchLower.includes(cityName) ||
               `${cityName}, ${stateName}`.includes(searchLower);
      })
      .map(stop => `${stop.city_name}, ${stop.state}`)
      .slice(0, 5); // Limit suggestions
  }

  /**
   * Validate trip parameters
   */
  static validateTripParameters(
    startCityName: string,
    endCityName: string,
    tripDays: number,
    tripStartDate?: Date
  ): void {
    if (!startCityName || !endCityName) {
      throw new Error('Both start and end cities must be specified.');
    }

    if (tripDays <= 0 || tripDays > 14) { // Updated from 30 to 14 days
      throw new Error('Trip duration must be between 1 and 14 days.');
    }

    if (!tripStartDate) {
      throw new Error('Trip start date is required for weather forecasts and planning.');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (tripStartDate < today) {
      throw new Error('Trip start date cannot be in the past.');
    }

    // Check if trip start date is too far in the future (weather forecasts have limits)
    const maxFutureDate = new Date();
    maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 1);
    
    if (tripStartDate > maxFutureDate) {
      throw new Error('Trip start date cannot be more than 1 year in the future.');
    }
  }
}
