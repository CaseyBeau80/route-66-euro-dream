
import { TripPlan } from './planning/TripPlanBuilder';
import { CostEstimatorData, CostEstimate, CostBreakdown, DailyCosts } from '../types/costEstimator';
import { getDestinationCity } from './planning/utils/DestinationUtils';

export class CostCalculationService {
  // Base rates per day by budget level
  private static readonly ACCOMMODATION_RATES = {
    budget: 65,
    'mid-range': 120,
    luxury: 250
  };

  private static readonly MEAL_RATES = {
    budget: 48,
    midrange: 70,
    fine: 95
  };

  // Car rental rates per day by vehicle type
  private static readonly CAR_RENTAL_RATES = {
    economy: 35,
    compact: 42,
    'mid-size': 52,
    'full-size': 65,
    suv: 78,
    luxury: 125
  };

  // Average attraction costs per day by state
  private static readonly ATTRACTION_COSTS = {
    'Illinois': 25,
    'Missouri': 30,
    'Oklahoma': 20,
    'Texas': 25,
    'New Mexico': 30,
    'Arizona': 35,
    'California': 45
  };

  // Toll costs by state (approximate)
  private static readonly TOLL_COSTS = {
    'Illinois': 15,
    'Missouri': 8,
    'Oklahoma': 5,
    'Texas': 3,
    'New Mexico': 0,
    'Arizona': 0,
    'California': 12
  };

  static calculateCosts(tripPlan: TripPlan, costData: CostEstimatorData): CostEstimate {
    console.log('💰 Calculating trip costs', { tripPlan, costData });

    const dailyCosts: DailyCosts[] = [];
    let totalGas = 0;
    let totalAccommodation = 0;
    let totalMeals = 0;
    let totalAttractions = 0;
    let totalTolls = 0;
    let totalCarRental = 0;

    // Use dailySegments as primary property, with segments as fallback
    const segments = tripPlan.dailySegments || tripPlan.segments || [];
    
    segments.forEach((segment, index) => {
      // Extract state from the destination city name or use city from destination - FIXED
      const cityName = getDestinationCity(segment.destination) || segment.endCity || '';
      const state = this.extractStateFromCity(cityName);
      
      // Gas costs - calculate based on segment distance
      const segmentDistance = segment.distance || 0;
      const segmentGas = (segmentDistance / costData.mpg) * costData.gasPrice;
      totalGas += segmentGas;

      // Accommodation costs (except last day) - multiply by number of rooms
      const accommodation = index < segments.length - 1 
        ? this.ACCOMMODATION_RATES[costData.motelBudget] * costData.numberOfRooms
        : 0;
      totalAccommodation += accommodation;

      // Meal costs
      const meals = this.MEAL_RATES[costData.mealBudget];
      totalMeals += meals;

      // Car rental costs
      const carRental = costData.includeCarRental 
        ? this.CAR_RENTAL_RATES[costData.carRentalType]
        : 0;
      totalCarRental += carRental;

      // Attraction costs
      const attractions = costData.includeAttractions 
        ? (this.ATTRACTION_COSTS[state] || 25) 
        : 0;
      totalAttractions += attractions;

      // Toll costs
      const tolls = costData.includeTolls 
        ? (this.TOLL_COSTS[state] || 0) 
        : 0;
      totalTolls += tolls;

      dailyCosts.push({
        day: segment.day || (index + 1),
        city: getDestinationCity(segment.destination) || segment.endCity || `Day ${index + 1}`, // FIXED
        gas: Math.round(segmentGas),
        accommodation: Math.round(accommodation),
        meals: Math.round(meals),
        carRental: Math.round(carRental),
        attractions: Math.round(attractions),
        tolls: Math.round(tolls),
        dailyTotal: Math.round(segmentGas + accommodation + meals + carRental + attractions + tolls)
      });
    });

    const breakdown: CostBreakdown = {
      gasCost: Math.round(totalGas),
      accommodationCost: Math.round(totalAccommodation),
      mealCost: Math.round(totalMeals),
      carRentalCost: Math.round(totalCarRental),
      attractionCost: Math.round(totalAttractions),
      tollCost: Math.round(totalTolls),
      totalCost: Math.round(totalGas + totalAccommodation + totalMeals + totalCarRental + totalAttractions + totalTolls)
    };

    return {
      breakdown,
      dailyCosts,
      perPersonCost: Math.round(breakdown.totalCost / costData.groupSize),
      averageDailyCost: Math.round(breakdown.totalCost / segments.length)
    };
  }

  private static extractStateFromCity(cityName: string): string {
    // Try to extract state from city name (e.g., "Chicago, IL")
    const stateMatch = cityName.match(/, ([A-Z]{2})$/);
    if (stateMatch) {
      const stateCode = stateMatch[1];
      const stateMap: { [key: string]: string } = {
        'IL': 'Illinois',
        'MO': 'Missouri',
        'OK': 'Oklahoma',
        'TX': 'Texas',
        'NM': 'New Mexico',
        'AZ': 'Arizona',
        'CA': 'California'
      };
      return stateMap[stateCode] || 'Unknown';
    }
    return 'Unknown';
  }
}
