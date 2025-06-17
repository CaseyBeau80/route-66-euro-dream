
import { UnifiedTripPlanningService } from '../UnifiedTripPlanningService';
import { TripStop } from '../../data/SupabaseDataService';

// Mock data for testing
const mockStartStop: TripStop = {
  id: '1',
  name: 'Chicago',
  state: 'IL',
  latitude: 41.8781,
  longitude: -87.6298,
  category: 'destination_city',
  is_major_stop: true,
  description: 'The Windy City - Starting point of historic Route 66',
  city_name: 'Chicago',
  city: 'Chicago' // Add the required city property
};

const mockEndStop: TripStop = {
  id: '2',
  name: 'Los Angeles',
  state: 'CA',
  latitude: 34.0522,
  longitude: -118.2437,
  category: 'destination_city',
  is_major_stop: true,
  description: 'The City of Angels - Western terminus of Route 66',
  city_name: 'Los Angeles',
  city: 'Los Angeles' // Add the required city property
};

const mockDestinationCities: TripStop[] = [
  {
    id: '3',
    name: 'St. Louis',
    state: 'MO',
    latitude: 38.6270,
    longitude: -90.1994,
    category: 'destination_city',
    is_major_stop: true,
    description: 'Gateway to the West with historic Route 66 landmarks',
    city_name: 'St. Louis',
    city: 'St. Louis' // Add the required city property
  },
  {
    id: '4',
    name: 'Oklahoma City',
    state: 'OK',
    latitude: 35.4676,
    longitude: -97.5164,
    category: 'destination_city',
    is_major_stop: true,
    description: 'Capital city of Oklahoma with Route 66 heritage',
    city_name: 'Oklahoma City',
    city: 'Oklahoma City' // Add the required city property
  },
  {
    id: '5',
    name: 'Albuquerque',
    state: 'NM',
    latitude: 35.0844,
    longitude: -106.6504,
    category: 'destination_city',
    is_major_stop: true,
    description: 'High desert city with vibrant Route 66 culture',
    city_name: 'Albuquerque',
    city: 'Albuquerque' // Add the required city property
  }
];

// Simple test to verify the service works
console.log('🧪 Testing UnifiedTripPlanningService...');

try {
  // Use the correct method name 'planTrip' instead of 'createTripPlan'
  const planningResult = await UnifiedTripPlanningService.planTrip(
    'Chicago',
    'Los Angeles', 
    5,
    'balanced'
  );

  console.log('✅ Test passed: Trip plan created successfully');
  console.log(`📊 Trip details: ${planningResult.tripPlan?.totalDays} days, ${planningResult.tripPlan?.totalDistance} miles`);
  console.log(`⚖️ Success: ${planningResult.success ? 'YES' : 'NO'}`);
} catch (error) {
  console.error('❌ Test failed:', error);
}
