
import { supabase } from '@/integrations/supabase/client';

export interface HeritageCityData {
  name: string;
  state: string;
  heritage_score: number;
  tourism_score: number;
  historical_significance: string[];
  route66_importance: 'iconic' | 'major' | 'significant' | 'notable' | 'standard';
}

export class HeritageDatabaseMigration {
  private static readonly HERITAGE_CITY_DATA: HeritageCityData[] = [
    // Iconic Heritage Cities (90-100)
    {
      name: 'Chicago',
      state: 'Illinois',
      heritage_score: 100,
      tourism_score: 95,
      historical_significance: ['Eastern terminus of Route 66', 'Birthplace of the Mother Road', 'Grant Park starting point'],
      route66_importance: 'iconic'
    },
    {
      name: 'Santa Monica',
      state: 'California',
      heritage_score: 100,
      tourism_score: 90,
      historical_significance: ['Western terminus of Route 66', 'Santa Monica Pier endpoint', 'End of the Trail sign'],
      route66_importance: 'iconic'
    },
    {
      name: 'St. Louis',
      state: 'Missouri',
      heritage_score: 95,
      tourism_score: 88,
      historical_significance: ['Gateway to the West', 'Route 66 State Park', 'Chain of Rocks Bridge'],
      route66_importance: 'iconic'
    },
    {
      name: 'Tulsa',
      state: 'Oklahoma',
      heritage_score: 90,
      tourism_score: 82,
      historical_significance: ['Oil capital heritage', 'Route 66 museums', 'Historic downtown', 'Cyrus Avery connection'],
      route66_importance: 'iconic'
    },

    // Major Heritage Cities (75-89)
    {
      name: 'Oklahoma City',
      state: 'Oklahoma',
      heritage_score: 85,
      tourism_score: 80,
      historical_significance: ['State capital', 'Route 66 Museum', 'Stockyards heritage'],
      route66_importance: 'major'
    },
    {
      name: 'Amarillo',
      state: 'Texas',
      heritage_score: 85,
      tourism_score: 75,
      historical_significance: ['Cadillac Ranch', 'Big Texan Steak Ranch', 'Route 66 Historic District'],
      route66_importance: 'major'
    },
    {
      name: 'Albuquerque',
      state: 'New Mexico',
      heritage_score: 80,
      tourism_score: 78,
      historical_significance: ['Old Town heritage', 'Native American culture', 'Route 66 Central Avenue'],
      route66_importance: 'major'
    },
    {
      name: 'Flagstaff',
      state: 'Arizona',
      heritage_score: 80,
      tourism_score: 72,
      historical_significance: ['Gateway to Grand Canyon', 'Historic downtown', 'Mountain town heritage'],
      route66_importance: 'major'
    },
    {
      name: 'Springfield',
      state: 'Illinois',
      heritage_score: 75,
      tourism_score: 70,
      historical_significance: ['State capital', 'Abraham Lincoln heritage', 'Route 66 history'],
      route66_importance: 'major'
    },

    // Significant Heritage Cities (60-74)
    {
      name: 'Joplin',
      state: 'Missouri',
      heritage_score: 70,
      tourism_score: 65,
      historical_significance: ['Mining town heritage', 'Route 66 crossroads', 'Historic downtown'],
      route66_importance: 'significant'
    },
    {
      name: 'Gallup',
      state: 'New Mexico',
      heritage_score: 70,
      tourism_score: 68,
      historical_significance: ['Trading post heritage', 'Native American culture', 'Route 66 gateway'],
      route66_importance: 'significant'
    },
    {
      name: 'Kingman',
      state: 'Arizona',
      heritage_score: 70,
      tourism_score: 62,
      historical_significance: ['Route 66 Museum', 'Desert heritage', 'Mining history'],
      route66_importance: 'significant'
    },
    {
      name: 'Williams',
      state: 'Arizona',
      heritage_score: 65,
      tourism_score: 65,
      historical_significance: ['Last Route 66 town bypassed', 'Grand Canyon gateway', 'Historic railroad'],
      route66_importance: 'significant'
    },
    {
      name: 'Tucumcari',
      state: 'New Mexico',
      heritage_score: 65,
      tourism_score: 60,
      historical_significance: ['Route 66 Tonight slogan', 'Vintage neon signs', 'Classic motels'],
      route66_importance: 'significant'
    },
    {
      name: 'Santa Fe',
      state: 'New Mexico',
      heritage_score: 60,
      tourism_score: 85,
      historical_significance: ['State capital', 'Historic plaza', 'Native American heritage'],
      route66_importance: 'significant'
    }
  ];

  /**
   * Apply heritage scores to destination cities
   */
  static async applyHeritageScores(): Promise<{ success: boolean; message: string; errors: string[] }> {
    console.log('🏛️ Starting heritage score migration...');
    
    const errors: string[] = [];
    let successCount = 0;

    try {
      for (const cityData of this.HERITAGE_CITY_DATA) {
        try {
          const { data, error } = await supabase
            .from('destination_cities')
            .update({
              heritage_score: cityData.heritage_score,
              tourism_score: cityData.tourism_score,
              route66_importance: cityData.route66_importance
            })
            .or(`name.ilike.%${cityData.name}%,city_name.ilike.%${cityData.name}%`)
            .eq('state', cityData.state);

          if (error) {
            errors.push(`Failed to update ${cityData.name}: ${error.message}`);
            console.error(`❌ Error updating ${cityData.name}:`, error);
          } else {
            successCount++;
            console.log(`✅ Updated ${cityData.name}: heritage=${cityData.heritage_score}, tourism=${cityData.tourism_score}`);
          }
        } catch (cityError) {
          errors.push(`Exception updating ${cityData.name}: ${cityError}`);
          console.error(`💥 Exception updating ${cityData.name}:`, cityError);
        }
      }

      const message = `Heritage migration completed: ${successCount}/${this.HERITAGE_CITY_DATA.length} cities updated`;
      console.log(`🎯 ${message}`);

      return {
        success: errors.length === 0,
        message,
        errors
      };

    } catch (error) {
      console.error('💥 Heritage migration failed:', error);
      return {
        success: false,
        message: 'Heritage migration failed due to database error',
        errors: [`Database error: ${error}`]
      };
    }
  }

  /**
   * Get heritage city data for debugging
   */
  static getHeritageCityData(): HeritageCityData[] {
    return [...this.HERITAGE_CITY_DATA];
  }

  /**
   * Validate heritage scores in database
   */
  static async validateHeritageScores(): Promise<{
    totalCities: number;
    citiesWithScores: number;
    missingScores: string[];
  }> {
    try {
      const { data: allCities, error } = await supabase
        .from('destination_cities')
        .select('name, state, heritage_score, tourism_score');

      if (error) {
        console.error('Error validating heritage scores:', error);
        return { totalCities: 0, citiesWithScores: 0, missingScores: [] };
      }

      const totalCities = allCities?.length || 0;
      const citiesWithScores = allCities?.filter(city => city.heritage_score && city.tourism_score).length || 0;
      const missingScores = allCities?.filter(city => !city.heritage_score || !city.tourism_score)
        .map(city => `${city.name}, ${city.state}`) || [];

      console.log(`📊 Heritage score validation: ${citiesWithScores}/${totalCities} cities have scores`);

      return {
        totalCities,
        citiesWithScores,
        missingScores
      };
    } catch (error) {
      console.error('Error during heritage validation:', error);
      return { totalCities: 0, citiesWithScores: 0, missingScores: [] };
    }
  }
}
