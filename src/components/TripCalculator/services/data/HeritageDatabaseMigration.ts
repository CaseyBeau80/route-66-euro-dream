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
   * Check if heritage columns exist in the database
   */
  static async checkHeritageColumnsExist(): Promise<{
    columnsExist: boolean;
    missingColumns: string[];
    error?: string;
  }> {
    try {
      // Try to select heritage columns to check if they exist
      const { data, error } = await supabase
        .from('destination_cities')
        .select('id, heritage_score, tourism_score, route66_importance')
        .limit(1);

      if (error) {
        // Parse error to check for missing columns
        const errorMessage = error.message.toLowerCase();
        const missingColumns: string[] = [];
        
        if (errorMessage.includes('heritage_score')) {
          missingColumns.push('heritage_score');
        }
        if (errorMessage.includes('tourism_score')) {
          missingColumns.push('tourism_score');
        }
        if (errorMessage.includes('route66_importance')) {
          missingColumns.push('route66_importance');
        }

        console.log('🔍 Heritage columns check - missing columns detected:', missingColumns);
        
        return {
          columnsExist: missingColumns.length === 0,
          missingColumns,
          error: missingColumns.length > 0 ? `Missing columns: ${missingColumns.join(', ')}` : error.message
        };
      }

      console.log('✅ Heritage columns exist in database');
      return {
        columnsExist: true,
        missingColumns: []
      };

    } catch (error) {
      console.error('💥 Error checking heritage columns:', error);
      return {
        columnsExist: false,
        missingColumns: ['heritage_score', 'tourism_score', 'route66_importance'],
        error: `Database error: ${error}`
      };
    }
  }

  /**
   * Apply heritage scores to destination cities (only if columns exist)
   */
  static async applyHeritageScores(): Promise<{ success: boolean; message: string; errors: string[] }> {
    console.log('🏛️ Starting heritage score migration...');
    
    const errors: string[] = [];
    let successCount = 0;

    try {
      // First, check if heritage columns exist
      const columnCheck = await this.checkHeritageColumnsExist();
      
      if (!columnCheck.columnsExist) {
        console.warn('⚠️ Heritage columns do not exist in database:', columnCheck.missingColumns);
        return {
          success: false,
          message: `Heritage migration failed: Missing database columns (${columnCheck.missingColumns.join(', ')})`,
          errors: [`Database schema missing columns: ${columnCheck.missingColumns.join(', ')}. Please add these columns to the destination_cities table first.`]
        };
      }

      // Proceed with migration if columns exist
      for (const cityData of this.HERITAGE_CITY_DATA) {
        try {
          const { data, error } = await supabase
            .from('destination_cities')
            .update({
              heritage_score: cityData.heritage_score,
              tourism_score: cityData.tourism_score,
              route66_importance: cityData.route66_importance
            } as any) // Use 'as any' to bypass TypeScript checking for now
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
   * Validate heritage scores in database (only if columns exist)
   */
  static async validateHeritageScores(): Promise<{
    totalCities: number;
    citiesWithScores: number;
    missingScores: string[];
    columnsExist: boolean;
    error?: string;
  }> {
    try {
      // First check if heritage columns exist
      const columnCheck = await this.checkHeritageColumnsExist();
      
      if (!columnCheck.columnsExist) {
        console.warn('⚠️ Cannot validate heritage scores - columns do not exist:', columnCheck.missingColumns);
        
        // Get basic city count without heritage columns
        const { data: basicCities, error: basicError } = await supabase
          .from('destination_cities')
          .select('name, state');

        const totalCities = basicCities?.length || 0;

        return {
          totalCities,
          citiesWithScores: 0,
          missingScores: basicCities?.map(city => `${city.name}, ${city.state}`) || [],
          columnsExist: false,
          error: columnCheck.error
        };
      }

      // If columns exist, do full validation
      const { data: allCities, error } = await supabase
        .from('destination_cities')
        .select('name, state, heritage_score, tourism_score') as any; // Use 'as any' to bypass TypeScript

      if (error) {
        console.error('Error validating heritage scores:', error);
        return { 
          totalCities: 0, 
          citiesWithScores: 0, 
          missingScores: [],
          columnsExist: true,
          error: error.message
        };
      }

      const totalCities = allCities?.length || 0;
      const citiesWithScores = allCities?.filter((city: any) => city.heritage_score && city.tourism_score).length || 0;
      const missingScores = allCities?.filter((city: any) => !city.heritage_score || !city.tourism_score)
        .map((city: any) => `${city.name}, ${city.state}`) || [];

      console.log(`📊 Heritage score validation: ${citiesWithScores}/${totalCities} cities have scores`);

      return {
        totalCities,
        citiesWithScores,
        missingScores,
        columnsExist: true
      };
    } catch (error) {
      console.error('Error during heritage validation:', error);
      return { 
        totalCities: 0, 
        citiesWithScores: 0, 
        missingScores: [],
        columnsExist: false,
        error: `Validation error: ${error}`
      };
    }
  }
}
