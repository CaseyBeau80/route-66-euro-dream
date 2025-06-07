
import { TripStop } from '../../../types/TripStop';
import { DailySegment } from '../../../services/planning/TripPlanBuilder';
import { DeterministicIdGenerator } from '../../../utils/deterministicId';

// Create fallback stops for segments with no data
export const createFallbackStops = (segment: DailySegment, segmentKey: string): TripStop[] => {
  const route66Attractions: Record<string, Omit<TripStop, 'id'>[]> = {
    'joplin': [
      {
        name: 'Spook Light',
        description: 'A mysterious light phenomenon that has puzzled visitors for decades along Route 66',
        category: 'attraction',
        city_name: 'Joplin',
        city: 'Joplin', // Add city property
        state: 'MO',
        latitude: 37.0262,
        longitude: -94.8591
      },
      {
        name: 'Schifferdecker Park',
        description: 'A beautiful park perfect for a Route 66 road trip break',
        category: 'attraction',
        city_name: 'Joplin',
        city: 'Joplin', // Add city property
        state: 'MO',
        latitude: 37.0842,
        longitude: -94.5133
      }
    ],
    'oklahoma': [
      {
        name: 'Blue Whale of Catoosa',
        description: 'Iconic Route 66 roadside attraction - a giant blue whale sculpture',
        category: 'attraction',
        city_name: 'Catoosa',
        city: 'Catoosa', // Add city property
        state: 'OK',
        latitude: 36.1851,
        longitude: -95.7317
      },
      {
        name: 'Totem Pole Park',
        description: 'Fascinating collection of hand-carved totem poles along Route 66',
        category: 'attraction',
        city_name: 'Foyil',
        city: 'Foyil', // Add city property
        state: 'OK',
        latitude: 36.4395,
        longitude: -95.5122
      },
      {
        name: 'Golden Driller',
        description: 'Towering statue celebrating Oklahoma\'s oil heritage',
        category: 'attraction',
        city_name: 'Tulsa',
        city: 'Tulsa', // Add city property
        state: 'OK',
        latitude: 36.1540,
        longitude: -95.9928
      }
    ]
  };
  
  const startKey = segment.startCity.toLowerCase();
  const endKey = segment.endCity.toLowerCase();
  
  const relevantStops: TripStop[] = [];
  
  // Check for regional matches
  if (startKey.includes('joplin') || endKey.includes('oklahoma')) {
    const joplinStops = route66Attractions.joplin?.map((stop, index) => ({
      ...stop,
      id: DeterministicIdGenerator.generateId('fallback-joplin', stop.name, index, segmentKey)
    })) || [];
    
    const oklahomaStops = route66Attractions.oklahoma?.map((stop, index) => ({
      ...stop,
      id: DeterministicIdGenerator.generateId('fallback-oklahoma', stop.name, index, segmentKey)
    })) || [];
    
    relevantStops.push(...joplinStops, ...oklahomaStops);
  }
  
  return relevantStops.slice(0, 3); // Limit to 3 fallback stops
};
