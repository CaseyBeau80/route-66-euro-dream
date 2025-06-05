
import { TripPlan } from './planning/TripPlanBuilder';
import { CostEstimatorData, CostEstimate, CostBreakdown, DailyCosts } from '../types/costEstimator';

export class CostCalculationService {
  // Base rates per day by budget level
  private static readonly ACCOMMODATION_RATES = {
    budget: 65,
    'mid-range': 120,
    luxury: 250
  };

  private static readonly MEAL_RATES = {
    budget: 45,
    'mid-range': 85,
    luxury: 150
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

    tripPlan.segments.forEach((segment, index) => {
      const state = this.extractState(segment.endCity);
      
      // Gas costs
      const segmentGas = (segment.distance / costData.mpg) * costData.gasPrice;
      totalGas += segmentGas;

      // Accommodation costs (except last day)
      const accommodation = index < tripPlan.segments.length - 1 
        ? this.ACCOMMODATION_RATES[costData.motelBudget] 
        : 0;
      totalAccommodation += accommodation;

      // Meal costs
      const meals = this.MEAL_RATES[costData.mealBudget];
      totalMeals += meals;

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
        day: segment.day,
        city: segment.endCity,
        gas: segmentGas,
        accommodation,
        meals,
        attractions,
        tolls,
        dailyTotal: segmentGas + accommodation + meals + attractions + tolls
      });
    });

    const breakdown: CostBreakdown = {
      gasCosts: totalGas,
      accommodationCosts: totalAccommodation,
      mealCosts: totalMeals,
      attractionCosts: totalAttractions,
      tollCosts: totalTolls,
      totalCost: totalGas + totalAccommodation + totalMeals + totalAttractions + totalTolls
    };

    return {
      breakdown,
      dailyCosts,
      perPersonCost: breakdown.totalCost / costData.groupSize,
      averageDailyCost: breakdown.totalCost / tripPlan.segments.length
    };
  }

  private static extractState(cityName: string): string {
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
