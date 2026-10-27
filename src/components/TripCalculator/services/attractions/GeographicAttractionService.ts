
import { AttractionSearchResult, AttractionSearchStatus } from './AttractionSearchResult';
import { supabase } from '@/lib/supabase';

export interface NearbyAttraction {
  id: string;
  name: string;
  description: string;
  category: string;
  attractionType?: string;
  distanceFromCity: number;
  latitude: number;
  longitude: number;
  city_name?: string;
  state?: string;
  city?: string;
  source?: 'segment_data' | 'recommended_stops' | 'geographic';
}

export class GeographicAttractionService {
  static async findAttractionsNearCity(city: string, state: string, radiusMiles: number = 25): Promise<AttractionSearchResult> {
    console.log(`🔍 GeographicAttractionService: Searching Supabase for attractions near ${city}, ${state} within ${radiusMiles} miles`);
    
    try {
      const allAttractions: NearbyAttraction[] = [];

      // Fetch from attractions table
      const { data: attractions, error: attractionsError } = await (supabase as any)
        .from('attractions')
        .select('id,name,title,slug,description,city_name,state,latitude,longitude,image_url,thumbnail_url,website,category,category_canonical,tags,featured,founded_year,year_opened,admission_fee,hours_of_operation')
        .ilike('city_name', `%${city}%`)
        .eq('state', state.toUpperCase());

      if (attractionsError) {
        console.error('❌ Error fetching attractions:', attractionsError);
      } else if (attractions) {
        console.log(`📍 Found ${attractions.length} attractions in Supabase`);
        attractions.forEach(attraction => {
          allAttractions.push({
            id: attraction.id,
            name: attraction.name,
            description: attraction.description || `Route 66 attraction in ${attraction.city_name}`,
            category: attraction.category || 'attraction',
            attractionType: attraction.category || 'attraction',
            distanceFromCity: 0, // Within city limits
            latitude: parseFloat(attraction.latitude?.toString() || '0'),
            longitude: parseFloat(attraction.longitude?.toString() || '0'),
            city_name: attraction.city_name,
            state: attraction.state,
            city: attraction.city_name,
            source: 'geographic'
          });
        });
      }

      // Fetch from hidden_gems table
      const { data: hiddenGems, error: hiddenGemsError } = await (supabase as any)
        .from('hidden_gems')
        .select('id,name,title,slug,description,city_name,state,latitude,longitude,image_url,thumbnail_url,website,category,category_canonical,tags,featured,founded_year,year_opened')
        .ilike('city_name', `%${city}%`);

      if (hiddenGemsError) {
        console.error('❌ Error fetching hidden gems:', hiddenGemsError);
      } else if (hiddenGems) {
        console.log(`💎 Found ${hiddenGems.length} hidden gems in Supabase`);
        hiddenGems.forEach(gem => {
          allAttractions.push({
            id: gem.id,
            name: gem.title,
            description: gem.description || `Hidden gem in ${gem.city_name}`,
            category: 'hidden_gem',
            attractionType: 'hidden_gem',
            distanceFromCity: 0,
            latitude: parseFloat(gem.latitude?.toString() || '0'),
            longitude: parseFloat(gem.longitude?.toString() || '0'),
            city_name: gem.city_name,
            state: '',
            city: gem.city_name,
            source: 'geographic'
          });
        });
      }

      // Fetch from drive_ins table
      const { data: driveIns, error: driveInsError } = await (supabase as any)
        .from('drive_ins')
        .select('id,name,description,city_name,state,latitude,longitude,image_url,thumbnail_url,website,featured,status,status_notes,year_opened,screens_count,capacity_cars')
        .ilike('city_name', `%${city}%`)
        .eq('state', state.toUpperCase());

      if (driveInsError) {
        console.error('❌ Error fetching drive-ins:', driveInsError);
      } else if (driveIns) {
        console.log(`🎬 Found ${driveIns.length} drive-ins in Supabase`);
        driveIns.forEach(driveIn => {
          allAttractions.push({
            id: driveIn.id,
            name: driveIn.name,
            description: driveIn.description || `Drive-in theater in ${driveIn.city_name}`,
            category: 'drive_in',
            attractionType: 'drive_in',
            distanceFromCity: 0,
            latitude: parseFloat(driveIn.latitude?.toString() || '0'),
            longitude: parseFloat(driveIn.longitude?.toString() || '0'),
            city_name: driveIn.city_name,
            state: driveIn.state,
            city: driveIn.city_name,
            source: 'geographic'
          });
        });
      }

      console.log(`✅ Total attractions found in Supabase: ${allAttractions.length}`);

      return {
        status: AttractionSearchStatus.SUCCESS,
        attractions: allAttractions,
        message: `Found ${allAttractions.length} attractions near ${city}, ${state} from Supabase database`,
        citySearched: city,
        stateSearched: state
      };
    } catch (error) {
      console.error(`❌ Error searching Supabase for attractions near ${city}, ${state}:`, error);
      return {
        status: AttractionSearchStatus.ERROR,
        attractions: [],
        message: error instanceof Error ? error.message : 'Failed to fetch attractions from database',
        citySearched: city,
        stateSearched: state
      };
    }
  }

  static async debugCitySearch(city: string, state: string): Promise<any> {
    console.log(`🔍 Debug city search for: ${city}, ${state}`);
    
    try {
      // Check what's actually in our Supabase tables
      const [attractionsResult, hiddenGemsResult, driveInsResult] = await Promise.all([
        (supabase as any).from('attractions').select('id,name,title,slug,description,city_name,state,latitude,longitude,image_url,thumbnail_url,website,category,category_canonical,tags,featured,founded_year,year_opened,admission_fee,hours_of_operation').ilike('city_name', `%${city}%`),
        (supabase as any).from('hidden_gems').select('id,name,title,slug,description,city_name,state,latitude,longitude,image_url,thumbnail_url,website,category,category_canonical,tags,featured,founded_year,year_opened').ilike('city_name', `%${city}%`),
        (supabase as any).from('drive_ins').select('id,name,description,city_name,state,latitude,longitude,image_url,thumbnail_url,website,featured,status,status_notes,year_opened,screens_count,capacity_cars').ilike('city_name', `%${city}%`)
      ]);

      return {
        searchTerms: { city, state },
        found: true,
        attractions: attractionsResult.data?.length || 0,
        hiddenGems: hiddenGemsResult.data?.length || 0,
        driveIns: driveInsResult.data?.length || 0,
        debugInfo: `Debug search for ${city}, ${state} - found ${(attractionsResult.data?.length || 0) + (hiddenGemsResult.data?.length || 0) + (driveInsResult.data?.length || 0)} total items`
      };
    } catch (error) {
      console.error('❌ Debug search failed:', error);
      return {
        searchTerms: { city, state },
        found: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        debugInfo: `Debug search failed for ${city}, ${state}`
      };
    }
  }

  static getAttractionIcon(attraction: NearbyAttraction): string {
    switch (attraction.category) {
      case 'historic':
      case 'landmark':
        return '🏛️';
      case 'museum':
        return '🏛️';
      case 'restaurant':
        return '🍽️';
      case 'attraction':
        return '🎯';
      case 'hidden_gem':
        return '💎';
      case 'drive_in':
        return '🎬';
      case 'recommended_stop':
        return '📍';
      default:
        return '⭐';
    }
  }

  static getAttractionTypeLabel(attraction: NearbyAttraction): string {
    switch (attraction.category) {
      case 'hidden_gem':
        return 'Hidden Gem';
      case 'drive_in':
        return 'Drive-In Theater';
      default:
        return attraction.attractionType || attraction.category || 'Attraction';
    }
  }
}
