import { supabase } from '@/integrations/supabase/client';

export class SupabaseConnectionTest {
  static async testConnection(): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
      console.log('🔗 [DEBUG] Testing Supabase connection...');
      
      // Test basic connection
      const { data: connectionTest, error: connectionError } = await supabase
        .from('destination_cities')
        .select('count')
        .limit(1);
        
      if (connectionError) {
        console.error('❌ [DEBUG] Supabase connection failed:', connectionError);
        return { success: false, error: connectionError.message };
      }
      
      // Test data retrieval
      const { data: cities, error: dataError } = await supabase
        .from('destination_cities')
        .select('*');
        
      if (dataError) {
        console.error('❌ [DEBUG] Supabase data retrieval failed:', dataError);
        return { success: false, error: dataError.message };
      }
      
      console.log('✅ [DEBUG] Supabase connection successful');
      console.log('📊 [DEBUG] Retrieved cities:', cities?.length || 0);
      console.log('🏙️ [DEBUG] City list:', cities?.map(c => `${c.name}, ${c.state}`) || []);
      
      const springfieldMO = cities?.find(c => c.name === 'Springfield' && c.state === 'MO');
      console.log('🔍 [DEBUG] Springfield, MO in database:', !!springfieldMO, springfieldMO);
      
      return { 
        success: true, 
        data: { 
          cityCount: cities?.length || 0, 
          hasSpringfieldMO: !!springfieldMO,
          cities: cities || []
        }
      };
    } catch (error) {
      console.error('❌ [DEBUG] Supabase connection test exception:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  static async testSpecificMigration(): Promise<void> {
    console.log('🔄 [DEBUG] Testing specific migration for Springfield, MO...');
    
    try {
      // Check if Springfield, MO exists
      const { data: existing, error: checkError } = await supabase
        .from('destination_cities')
        .select('*')
        .eq('name', 'Springfield')
        .eq('state', 'MO');
        
      if (checkError) {
        console.error('❌ [DEBUG] Error checking for Springfield, MO:', checkError);
        return;
      }
      
      if (existing && existing.length > 0) {
        console.log('✅ [DEBUG] Springfield, MO already exists:', existing[0]);
        return;
      }
      
      console.log('⚠️ [DEBUG] Springfield, MO not found, attempting to insert...');
      
      // Insert Springfield, MO if it doesn't exist
      const { data: inserted, error: insertError } = await supabase
        .from('destination_cities')
        .insert([
          {
            id: 'springfield-mo-manual',
            name: 'Springfield',
            state: 'MO',
            latitude: 37.2090,
            longitude: -93.2923,
            description: 'Known as the birthplace of Route 66, Springfield is where the famous highway was first conceived. This historic Missouri city offers visitors a rich blend of Route 66 heritage, Civil War history, and outdoor recreation opportunities.',
            featured: true,
            population: 169000,
            founded_year: 1838,
            website: 'https://www.springfieldmo.gov/'
          }
        ])
        .select();
        
      if (insertError) {
        console.error('❌ [DEBUG] Error inserting Springfield, MO:', insertError);
      } else {
        console.log('✅ [DEBUG] Successfully inserted Springfield, MO:', inserted);
      }
    } catch (error) {
      console.error('❌ [DEBUG] Exception during migration test:', error);
    }
  }
}