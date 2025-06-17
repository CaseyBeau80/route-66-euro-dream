import { toast } from '@/hooks/use-toast';
import { EnhancedSupabaseDataService } from '../services/data/EnhancedSupabaseDataService';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { CityDisplayService } from '../services/utils/CityDisplayService';
import { CityNameNormalizationService } from '../services/CityNameNormalizationService';
import { TripStop } from '../types/TripStop';

interface ValidationResult {
  startStop: TripStop;
  endStop: TripStop;
}

export class TripPlanValidator {
  /**
   * Enhanced validation with better city matching
   */
  static validateStops(
    startStop: TripStop | undefined,
    endStop: TripStop | undefined,
    startCityName: string,
    endCityName: string,
    allStops: TripStop[]
  ): ValidationResult {
    
    console.log(`🔍 Enhanced validation for: "${startCityName}" → "${endCityName}"`);
    console.log(`📊 Available stops: ${allStops.length}`);
    
    // Enhanced start stop finding with multiple matching strategies
    if (!startStop) {
      console.log(`🔍 Enhanced search for start location: "${startCityName}"`);
      
      startStop = this.findStopWithEnhancedMatching(startCityName, allStops);
      
      if (!startStop) {
        console.error(`❌ Could not find start location: "${startCityName}"`);
        this.logAvailableStopsForDebugging(allStops);
        
        throw new Error(`Start location "${startCityName}" not found in Route 66 stops. Available cities include: ${this.getAvailableCityNames(allStops).slice(0, 5).join(', ')}`);
      }
    }

    // Enhanced end stop finding with multiple matching strategies  
    if (!endStop) {
      console.log(`🔍 Enhanced search for end location: "${endCityName}"`);
      
      endStop = this.findStopWithEnhancedMatching(endCityName, allStops);
      
      if (!endStop) {
        console.error(`❌ Could not find end location: "${endCityName}"`);
        this.logAvailableStopsForDebugging(allStops);
        
        throw new Error(`End location "${endCityName}" not found in Route 66 stops. Available cities include: ${this.getAvailableCityNames(allStops).slice(0, 5).join(', ')}`);
      }
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

    console.log(`✅ Validated stops: ${startStop.name} → ${endStop.name}`);
    return { startStop, endStop };
  }

  /**
   * Enhanced stop finding with multiple matching strategies
   */
  private static findStopWithEnhancedMatching(cityName: string, allStops: TripStop[]): TripStop | undefined {
    if (!cityName || !allStops?.length) return undefined;

    console.log(`🔍 Enhanced matching for: "${cityName}" among ${allStops.length} stops`);

    // Strategy 1: Exact match with name field
    for (const stop of allStops) {
      if (stop.name === cityName) {
        console.log(`✅ Strategy 1 - Exact name match: ${stop.name}`);
        return stop;
      }
    }

    // Strategy 2: Match city name without state (for "Chicago, IL" → "Chicago")
    const searchCityOnly = cityName.split(',')[0].trim();
    for (const stop of allStops) {
      if (stop.name === searchCityOnly) {
        console.log(`✅ Strategy 2 - City-only match: ${stop.name}`);
        return stop;
      }
    }

    // Strategy 3: Case-insensitive matching
    const searchLower = searchCityOnly.toLowerCase();
    for (const stop of allStops) {
      if (stop.name?.toLowerCase() === searchLower) {
        console.log(`✅ Strategy 3 - Case-insensitive match: ${stop.name}`);
        return stop;
      }
    }

    // Strategy 4: Check city_name field if available
    for (const stop of allStops) {
      const cityNameField = stop.city_name || stop.city;
      if (cityNameField === searchCityOnly || cityNameField?.toLowerCase() === searchLower) {
        console.log(`✅ Strategy 4 - city_name field match: ${cityNameField}`);
        return stop;
      }
    }

    // Strategy 5: Normalized matching using CityDisplayService
    for (const stop of allStops) {
      const displayName = CityDisplayService.getCityDisplayName(stop);
      if (displayName === cityName) {
        console.log(`✅ Strategy 5 - Display name match: ${displayName}`);
        return stop;
      }
    }

    // Strategy 6: Partial matching for variations
    for (const stop of allStops) {
      const stopName = stop.name?.toLowerCase() || '';
      if (stopName.includes(searchLower) || searchLower.includes(stopName)) {
        console.log(`✅ Strategy 6 - Partial match: ${stop.name}`);
        return stop;
      }
    }

    console.log(`❌ No match found for: "${cityName}"`);
    return undefined;
  }

  /**
   * Get available city names for error messages
   */
  private static getAvailableCityNames(allStops: TripStop[]): string[] {
    return [...new Set(allStops.map(stop => stop.name || stop.city_name || stop.city || 'Unknown'))].sort();
  }

  /**
   * Log available stops for debugging
   */
  private static logAvailableStopsForDebugging(allStops: TripStop[]): void {
    console.log('🏙️ Available stops for debugging:');
    allStops.forEach((stop, index) => {
      console.log(`  ${index + 1}. ${stop.name} (city: "${stop.city_name || stop.city}", state: "${stop.state}")`);
    });
    
    const majorCities = allStops.filter(stop => 
      stop.name?.toLowerCase().includes('chicago') ||
      stop.name?.toLowerCase().includes('st. louis') ||
      stop.name?.toLowerCase().includes('oklahoma city') ||
      stop.name?.toLowerCase().includes('amarillo') ||
      stop.name?.toLowerCase().includes('albuquerque') ||
      stop.name?.toLowerCase().includes('flagstaff') ||
      stop.name?.toLowerCase().includes('santa monica')
    );
    
    console.log('🏛️ Major cities found:', majorCities.map(city => city.name));
  }

  /**
   * Validate a complete trip plan
   */
  static validateTripPlan(tripPlan: TripPlan) {
    const driveTimeValidation = this.validateDriveTimes(tripPlan);
    const routeValidation = this.validateRoute(tripPlan);
    
    return {
      isValid: driveTimeValidation.isValid && routeValidation.isValid,
      driveTimeValidation,
      routeValidation,
      warnings: [
        ...driveTimeValidation.warnings,
        ...routeValidation.warnings
      ]
    };
  }

  /**
   * Validate drive times across segments
   */
  private static validateDriveTimes(tripPlan: TripPlan) {
    const warnings: string[] = [];
    const driveTimes = tripPlan.segments.map(seg => seg.driveTimeHours);
    
    const maxTime = Math.max(...driveTimes);
    const avgTime = driveTimes.reduce((sum, time) => sum + time, 0) / driveTimes.length;
    
    let isValid = true;
    
    if (maxTime > 10) {
      warnings.push(`Long drive day detected: ${maxTime.toFixed(1)} hours`);
      isValid = false;
    }
    
    if (maxTime > avgTime * 1.8) {
      warnings.push('Significant drive time imbalance detected');
    }
    
    return {
      isValid,
      warnings,
      maxDriveTime: maxTime,
      avgDriveTime: avgTime
    };
  }

  /**
   * Validate route sequence and logic
   */
  private static validateRoute(tripPlan: TripPlan) {
    const warnings: string[] = [];
    let isValid = true;
    
    if (tripPlan.segments.length === 0) {
      warnings.push('No segments found in trip plan');
      isValid = false;
    }
    
    if (tripPlan.totalDistance <= 0) {
      warnings.push('Invalid total distance');
      isValid = false;
    }
    
    return {
      isValid,
      warnings
    };
  }

  private static findSimilarCities(searchTerm: string, allStops: TripStop[]): string[] {
    const searchLower = searchTerm.toLowerCase();
    const destinationCities = allStops.filter(stop => stop.category === 'destination_city');
    
    return destinationCities
      .filter(stop => {
        const cityName = (stop.city_name || stop.name || '').toLowerCase();
        const stateName = stop.state.toLowerCase();
        
        // Look for partial matches
        return cityName.includes(searchLower) || 
               searchLower.includes(cityName) ||
               `${cityName}, ${stateName}`.includes(searchLower);
      })
      .map(stop => `${stop.city_name || stop.name}, ${stop.state}`)
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
