
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
  is_major_stop: true
};

const mockEndStop: TripStop = {
  id: '2',
  name: 'Los Angeles',
  state: 'CA',
  latitude: 34.0522,
  longitude: -118.2437,
  category: 'destination_city',
  is_major_stop: true
};

const mockDestinationCities: TripStop[] = [
  {
    id: '3',
    name: 'St. Louis',
    state: 'MO',
    latitude: 38.6270,
    longitude: -90.1994,
    category: 'destination_city',
    is_major_stop: true
  },
  {
    id: '4',
    name: 'Oklahoma City',
    state: 'OK',
    latitude: 35.4676,
    longitude: -97.5164,
    category: 'destination_city',
    is_major_stop: true
  },
  {
    id: '5',
    name: 'Albuquerque',
    state: 'NM',
    latitude: 35.0844,
    longitude: -106.6504,
    category: 'destination_city',
    is_major_stop: true
  }
];

// Simple test to verify the service works
console.log('🧪 Testing UnifiedTripPlanningService...');

try {
  const tripPlan = UnifiedTripPlanningService.createTripPlan(
    mockStartStop,
    mockEndStop,
    mockDestinationCities,
    5,
    'Chicago, IL',
    'Los Angeles, CA'
  );

  console.log('✅ Test passed: Trip plan created successfully');
  console.log(`📊 Trip details: ${tripPlan.totalDays} days, ${tripPlan.totalDistance} miles`);
  console.log(`⚖️ Balance: ${tripPlan.driveTimeBalance?.isBalanced ? 'BALANCED' : 'NEEDS WORK'}`);
} catch (error) {
  console.error('❌ Test failed:', error);
}
