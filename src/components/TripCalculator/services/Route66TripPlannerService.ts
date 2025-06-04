
import { supabase } from '@/integrations/supabase/client';

export interface TripStop {
  id: string;
  name: string;
  description: string;
  city_name: string;
  state: string;
  image_url?: string;
  latitude: number;
  longitude: number;
  category: string;
  is_major_stop?: boolean;
}

export interface DailySegment {
  day: number;
  title: string;
  startCity: string;
  endCity: string;
  approximateMiles: number;
  recommendedStops: TripStop[];
  driveTimeHours: number;
}

export interface TripPlan {
  title: string;
  startCityImage?: string;
  endCityImage?: string;
  totalDays: number;
  totalMiles: number;
  dailySegments: DailySegment[];
}

export class Route66TripPlannerService {
  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private static async fetchAllStops(): Promise<TripStop[]> {
    const stops: TripStop[] = [];
    console.log('🔄 Starting to fetch all stops from Supabase...');

    try {
      // Fetch Route 66 waypoints (major stops)
      console.log('📍 Fetching route66_waypoints...');
      const { data: waypoints, error: waypointsError } = await supabase
        .from('route66_waypoints')
        .select('*')
        .order('sequence_order');

      if (waypointsError) {
        console.error('❌ Error fetching waypoints:', waypointsError);
      } else {
        console.log(`✅ Fetched ${waypoints?.length || 0} waypoints`);
        if (waypoints) {
          stops.push(...waypoints.map(wp => ({
            id: wp.id,
            name: wp.name,
            description: wp.description || 'Historic Route 66 waypoint',
            city_name: wp.name,
            state: wp.state,
            image_url: wp.image_url,
            latitude: wp.latitude,
            longitude: wp.longitude,
            category: 'route66_waypoint',
            is_major_stop: wp.is_major_stop
          })));
        }
      }

      // Fetch destination cities
      console.log('🏙️ Fetching destination_cities...');
      const { data: cities, error: citiesError } = await supabase
        .from('destination_cities')
        .select('*')
        .order('name');

      if (citiesError) {
        console.error('❌ Error fetching cities:', citiesError);
      } else {
        console.log(`✅ Fetched ${cities?.length || 0} destination cities`);
        if (cities) {
          stops.push(...cities.map(city => ({
            id: city.id,
            name: city.name,
            description: city.description || 'Historic Route 66 destination',
            city_name: city.name,
            state: city.state,
            image_url: city.image_url,
            latitude: city.latitude,
            longitude: city.longitude,
            category: 'destination_city'
          })));
        }
      }

      // Fetch attractions
      console.log('🎡 Fetching attractions...');
      const { data: attractions, error: attractionsError } = await supabase
        .from('attractions')
        .select('*')
        .order('name');

      if (attractionsError) {
        console.error('❌ Error fetching attractions:', attractionsError);
      } else {
        console.log(`✅ Fetched ${attractions?.length || 0} attractions`);
        if (attractions) {
          stops.push(...attractions.map(attraction => ({
            id: attraction.id,
            name: attraction.name,
            description: attraction.description || 'Route 66 attraction',
            city_name: attraction.city_name,
            state: attraction.state,
            image_url: attraction.image_url,
            latitude: attraction.latitude,
            longitude: attraction.longitude,
            category: attraction.category || 'attraction'
          })));
        }
      }

      // Fetch hidden gems
      console.log('💎 Fetching hidden_gems...');
      const { data: gems, error: gemsError } = await supabase
        .from('hidden_gems')
        .select('*')
        .order('title');

      if (gemsError) {
        console.error('❌ Error fetching hidden gems:', gemsError);
      } else {
        console.log(`✅ Fetched ${gems?.length || 0} hidden gems`);
        if (gems) {
          stops.push(...gems.map(gem => ({
            id: gem.id,
            name: gem.title,
            description: gem.description || 'Hidden Route 66 gem',
            city_name: gem.city_name,
            state: 'Various',
            image_url: gem.image_url,
            latitude: gem.latitude,
            longitude: gem.longitude,
            category: 'hidden_gem'
          })));
        }
      }

      console.log(`🛣️ Total stops fetched: ${stops.length}`);
      return stops;
    } catch (error) {
      console.error('❌ Error in fetchAllStops:', error);
      return [];
    }
  }

  private static findClosestStop(latitude: number, longitude: number, stops: TripStop[]): TripStop | null {
    if (stops.length === 0) return null;

    let closestStop = stops[0];
    let minDistance = this.calculateDistance(latitude, longitude, stops[0].latitude, stops[0].longitude);

    for (const stop of stops) {
      const distance = this.calculateDistance(latitude, longitude, stop.latitude, stop.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        closestStop = stop;
      }
    }

    return closestStop;
  }

  private static getStopsAlongRoute(startStop: TripStop, endStop: TripStop, allStops: TripStop[], maxStops: number = 50): TripStop[] {
    // Calculate bearing from start to end
    const bearing = Math.atan2(
      endStop.longitude - startStop.longitude,
      endStop.latitude - startStop.latitude
    );

    // Filter stops that are roughly between start and end points
    const routeStops = allStops.filter(stop => {
      const distanceFromStart = this.calculateDistance(startStop.latitude, startStop.longitude, stop.latitude, stop.longitude);
      const distanceFromEnd = this.calculateDistance(stop.latitude, stop.longitude, endStop.latitude, endStop.longitude);
      const totalDistance = this.calculateDistance(startStop.latitude, startStop.longitude, endStop.latitude, endStop.longitude);
      
      // Stop should be roughly on the path (within reasonable deviation)
      return distanceFromStart + distanceFromEnd <= totalDistance * 1.3 && 
             distanceFromStart > 0 && 
             distanceFromEnd > 0;
    });

    // Sort by distance from start point
    routeStops.sort((a, b) => {
      const distA = this.calculateDistance(startStop.latitude, startStop.longitude, a.latitude, a.longitude);
      const distB = this.calculateDistance(startStop.latitude, startStop.longitude, b.latitude, b.longitude);
      return distA - distB;
    });

    return routeStops.slice(0, maxStops);
  }

  static async planTrip(startCityName: string, endCityName: string, tripDays: number): Promise<TripPlan> {
    console.log(`🗺️ Planning ${tripDays}-day trip from ${startCityName} to ${endCityName}`);

    const allStops = await this.fetchAllStops();
    console.log(`📊 Total stops available for planning: ${allStops.length}`);
    
    // Find start and end stops
    const startStop = allStops.find(stop => 
      stop.name.toLowerCase().includes(startCityName.toLowerCase()) ||
      stop.city_name.toLowerCase().includes(startCityName.toLowerCase())
    );
    
    const endStop = allStops.find(stop => 
      stop.name.toLowerCase().includes(endCityName.toLowerCase()) ||
      stop.city_name.toLowerCase().includes(endCityName.toLowerCase())
    );

    console.log('🔍 Start stop found:', startStop);
    console.log('🔍 End stop found:', endStop);

    if (!startStop || !endStop) {
      throw new Error(`Could not find stops for ${startCityName} or ${endCityName}`);
    }

    const totalDistance = this.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    console.log(`📏 Total distance: ${totalDistance} miles`);

    // Get stops along the route
    const routeStops = this.getStopsAlongRoute(startStop, endStop, allStops);
    console.log(`🛤️ Found ${routeStops.length} stops along the route`);

    // Plan daily segments
    const dailySegments: DailySegment[] = [];
    let currentStop = startStop;
    const remainingStops = [...routeStops];

    for (let day = 1; day <= tripDays; day++) {
      const isLastDay = day === tripDays;
      const targetStop = isLastDay ? endStop : this.selectNextDayDestination(currentStop, endStop, remainingStops, tripDays - day + 1);
      
      if (!targetStop) continue;

      // Find recommended stops for this segment
      const segmentStops = this.selectStopsForSegment(currentStop, targetStop, remainingStops, day === 1 ? 2 : 3);
      
      const segmentDistance = this.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        targetStop.latitude, targetStop.longitude
      );

      console.log(`📅 Day ${day}: ${currentStop.city_name} to ${targetStop.city_name}, ${Math.round(segmentDistance)} miles, ${segmentStops.length} stops`);

      dailySegments.push({
        day,
        title: `Day ${day}: ${currentStop.city_name} to ${targetStop.city_name}`,
        startCity: currentStop.city_name,
        endCity: targetStop.city_name,
        approximateMiles: Math.round(segmentDistance),
        recommendedStops: segmentStops,
        driveTimeHours: Math.round((segmentDistance / 55) * 10) / 10 // Assuming 55 mph average
      });

      // Remove used stops from remaining
      segmentStops.forEach(stop => {
        const index = remainingStops.findIndex(s => s.id === stop.id);
        if (index > -1) remainingStops.splice(index, 1);
      });

      currentStop = targetStop;
    }

    const tripPlan = {
      title: `Route 66 Trip: ${startCityName} to ${endCityName}`,
      startCityImage: startStop.image_url,
      endCityImage: endStop.image_url,
      totalDays: tripDays,
      totalMiles: Math.round(totalDistance),
      dailySegments
    };

    console.log('🎯 Final trip plan:', tripPlan);
    return tripPlan;
  }

  private static selectNextDayDestination(currentStop: TripStop, finalDestination: TripStop, availableStops: TripStop[], remainingDays: number): TripStop {
    const totalRemainingDistance = this.calculateDistance(
      currentStop.latitude, currentStop.longitude,
      finalDestination.latitude, finalDestination.longitude
    );

    const targetDailyDistance = totalRemainingDistance / remainingDays;

    // Find the stop closest to our target daily distance
    let bestStop = availableStops[0] || finalDestination;
    let bestScore = Number.MAX_VALUE;

    for (const stop of availableStops) {
      const distanceFromCurrent = this.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        stop.latitude, stop.longitude
      );

      const distanceToFinal = this.calculateDistance(
        stop.latitude, stop.longitude,
        finalDestination.latitude, finalDestination.longitude
      );

      // Prefer stops that are roughly our target distance away and move us toward the destination
      const score = Math.abs(distanceFromCurrent - targetDailyDistance) + (distanceToFinal * 0.1);
      
      // Bonus for major stops
      const majorStopBonus = stop.is_major_stop ? -50 : 0;
      const finalScore = score + majorStopBonus;

      if (finalScore < bestScore) {
        bestScore = finalScore;
        bestStop = stop;
      }
    }

    return bestStop;
  }

  private static selectStopsForSegment(startStop: TripStop, endStop: TripStop, availableStops: TripStop[], maxStops: number): TripStop[] {
    const segmentStops: TripStop[] = [];
    
    // Find stops between start and end for this segment
    const candidateStops = availableStops.filter(stop => {
      const distFromStart = this.calculateDistance(startStop.latitude, startStop.longitude, stop.latitude, stop.longitude);
      const distFromEnd = this.calculateDistance(stop.latitude, stop.longitude, endStop.latitude, endStop.longitude);
      const totalSegmentDist = this.calculateDistance(startStop.latitude, startStop.longitude, endStop.latitude, endStop.longitude);
      
      // Stop should be roughly between start and end
      return distFromStart + distFromEnd <= totalSegmentDist * 1.2;
    });

    // Prioritize by category and features
    candidateStops.sort((a, b) => {
      const getStopPriority = (stop: TripStop): number => {
        if (stop.category === 'route66_waypoint' && stop.is_major_stop) return 1;
        if (stop.category === 'destination_city') return 2;
        if (stop.category === 'attraction') return 3;
        if (stop.category === 'hidden_gem') return 4;
        return 5;
      };

      return getStopPriority(a) - getStopPriority(b);
    });

    // Select top stops up to maxStops
    return candidateStops.slice(0, maxStops);
  }
}
