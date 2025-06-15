
import { supabase } from '@/integrations/supabase/client';
import { TripStop, convertToTripStop } from '../../types/TripStop';

export type { TripStop } from '../../types/TripStop';

export class SupabaseDataService {
  /**
   * Extract state from city_name field
   */
  private static extractStateFromCityName(cityName: string): string {
    if (!cityName || !cityName.includes(',')) {
      return 'Unknown';
    }
    
    const parts = cityName.split(',');
    if (parts.length < 2) {
      return 'Unknown';
    }
    
    return parts[1].trim();
  }

  /**
   * Fetch and validate all stops from Supabase with enhanced debugging
   */
  static async fetchAllStops(): Promise<TripStop[]> {
    console.log('🔍 [DEBUG] SupabaseDataService: Starting comprehensive data fetch...');
    
    try {
      // Test database connection first
      const { data: testQuery, error: testError } = await supabase
        .from('attractions')
        .select('count(*)')
        .limit(1);
      
      if (testError) {
        console.error('❌ [DEBUG] Database connection test failed:', testError);
        throw new Error(`Database connection failed: ${testError.message}`);
      }
      
      console.log('✅ [DEBUG] Database connection successful');

      // Fetch attractions with enhanced validation
      console.log('📡 [DEBUG] Fetching attractions...');
      const { data: attractions, error: attractionsError } = await supabase
        .from('attractions')
        .select('*')
        .not('name', 'is', null)
        .neq('name', '')
        .not('city_name', 'is', null)
        .neq('city_name', '')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (attractionsError) {
        console.error('❌ [DEBUG] Attractions fetch error:', attractionsError);
        throw new Error(`Attractions fetch failed: ${attractionsError.message}`);
      }

      // Fetch hidden gems with enhanced validation  
      console.log('📡 [DEBUG] Fetching hidden gems...');
      const { data: hiddenGems, error: hiddenGemsError } = await supabase
        .from('hidden_gems')
        .select('*')
        .not('title', 'is', null)
        .neq('title', '')
        .not('city_name', 'is', null)
        .neq('city_name', '')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (hiddenGemsError) {
        console.error('❌ [DEBUG] Hidden gems fetch error:', hiddenGemsError);
        throw new Error(`Hidden gems fetch failed: ${hiddenGemsError.message}`);
      }

      // Fetch drive-ins with enhanced validation
      console.log('📡 [DEBUG] Fetching drive-ins...');
      const { data: driveIns, error: driveInsError } = await supabase
        .from('drive_ins')
        .select('*')
        .not('name', 'is', null)
        .neq('name', '')
        .not('city_name', 'is', null)
        .neq('city_name', '')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (driveInsError) {
        console.error('❌ [DEBUG] Drive-ins fetch error:', driveInsError);
        throw new Error(`Drive-ins fetch failed: ${driveInsError.message}`);
      }

      console.log('✅ [DEBUG] Raw data fetched successfully:', {
        attractions: attractions?.length || 0,
        hiddenGems: hiddenGems?.length || 0,
        driveIns: driveIns?.length || 0,
        sampleAttractions: attractions?.slice(0, 3).map(a => a.name) || [],
        sampleHiddenGems: hiddenGems?.slice(0, 3).map(g => g.title) || [],
        sampleDriveIns: driveIns?.slice(0, 3).map(d => d.name) || []
      });

      // Convert all data to TripStop format
      const allStops: TripStop[] = [];
      let conversionErrors = 0;

      // Process attractions
      if (attractions && attractions.length > 0) {
        console.log(`🔄 [DEBUG] Converting ${attractions.length} attractions...`);
        attractions.forEach((attraction, index) => {
          try {
            if (!attraction.name || !attraction.city_name || 
                !attraction.latitude || !attraction.longitude) {
              console.warn(`⚠️ [DEBUG] Skipping invalid attraction ${index}:`, attraction.id);
              conversionErrors++;
              return;
            }

            const stop = convertToTripStop({
              ...attraction,
              category: 'attraction',
              city: attraction.city_name
            });
            
            allStops.push(stop);
            
            if (index < 3) {
              console.log(`✅ [DEBUG] Converted attraction: ${stop.name} in ${stop.city_name}, ${stop.state}`);
            }
          } catch (err) {
            console.warn(`⚠️ [DEBUG] Failed to convert attraction ${index}:`, err);
            conversionErrors++;
          }
        });
      }

      // Process hidden gems
      if (hiddenGems && hiddenGems.length > 0) {
        console.log(`🔄 [DEBUG] Converting ${hiddenGems.length} hidden gems...`);
        hiddenGems.forEach((gem, index) => {
          try {
            if (!gem.title || !gem.city_name || 
                !gem.latitude || !gem.longitude) {
              console.warn(`⚠️ [DEBUG] Skipping invalid hidden gem ${index}:`, gem.id);
              conversionErrors++;
              return;
            }

            const extractedState = this.extractStateFromCityName(gem.city_name);
            
            const stop = convertToTripStop({
              ...gem,
              name: gem.title,
              category: 'hidden_gem',
              city: gem.city_name,
              state: extractedState
            });
            
            allStops.push(stop);
            
            if (index < 3) {
              console.log(`✅ [DEBUG] Converted hidden gem: ${stop.name} in ${stop.city_name}, ${stop.state}`);
            }
          } catch (err) {
            console.warn(`⚠️ [DEBUG] Failed to convert hidden gem ${index}:`, err);
            conversionErrors++;
          }
        });
      }

      // Process drive-ins
      if (driveIns && driveIns.length > 0) {
        console.log(`🔄 [DEBUG] Converting ${driveIns.length} drive-ins...`);
        driveIns.forEach((driveIn, index) => {
          try {
            if (!driveIn.name || !driveIn.city_name || 
                !driveIn.latitude || !driveIn.longitude) {
              console.warn(`⚠️ [DEBUG] Skipping invalid drive-in ${index}:`, driveIn.id);
              conversionErrors++;
              return;
            }

            const stop = convertToTripStop({
              ...driveIn,
              category: 'drive_in',
              city: driveIn.city_name
            });
            
            allStops.push(stop);
            
            if (index < 3) {
              console.log(`✅ [DEBUG] Converted drive-in: ${stop.name} in ${stop.city_name}, ${stop.state}`);
            }
          } catch (err) {
            console.warn(`⚠️ [DEBUG] Failed to convert drive-in ${index}:`, err);
            conversionErrors++;
          }
        });
      }

      // Final validation
      const validStops = allStops.filter(stop => {
        const isValid = stop && 
          stop.name && 
          stop.name.trim().length > 0 && 
          stop.category &&
          stop.city_name &&
          stop.latitude &&
          stop.longitude;
        
        if (!isValid) {
          console.warn(`⚠️ [DEBUG] Final filter removing invalid stop:`, stop);
          conversionErrors++;
        }
        
        return isValid;
      });

      console.log('✅ [DEBUG] Data processing complete:', {
        totalConverted: allStops.length,
        finalValidStops: validStops.length,
        conversionErrors,
        byCategory: validStops.reduce((acc, stop) => {
          acc[stop.category] = (acc[stop.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        sampleValidStops: validStops.slice(0, 5).map(s => ({
          name: s.name,
          category: s.category,
          city: s.city_name,
          state: s.state
        }))
      });

      if (validStops.length === 0) {
        throw new Error('No valid stops found after processing all data sources');
      }

      return validStops;
    } catch (error) {
      console.error('❌ [DEBUG] SupabaseDataService: Critical error:', error);
      throw error;
    }
  }
}
