
import { supabase } from '@/integrations/supabase/client';
import { TableMigrationService } from './TableMigrationService';

export class DataMigrationRunner {
  /**
   * Run the complete data migration process
   */
  static async runCompleteMigration() {
    console.log('🚀 Starting complete data migration for standardized schema');
    
    try {
      // Step 1: Populate missing state values for hidden_gems
      console.log('📍 Step 1: Populating missing state values...');
      const { error: stateError } = await supabase.rpc('sql', {
        query: `
          UPDATE hidden_gems 
          SET state = CASE 
            WHEN city_name ILIKE '%chicago%' THEN 'IL'
            WHEN city_name ILIKE '%springfield%' AND city_name NOT ILIKE '%missouri%' THEN 'IL'
            WHEN city_name ILIKE '%st. louis%' OR city_name ILIKE '%saint louis%' THEN 'MO'
            WHEN city_name ILIKE '%tulsa%' OR city_name ILIKE '%oklahoma%' THEN 'OK'
            WHEN city_name ILIKE '%amarillo%' OR city_name ILIKE '%texas%' THEN 'TX'
            WHEN city_name ILIKE '%albuquerque%' OR city_name ILIKE '%santa fe%' THEN 'NM'
            WHEN city_name ILIKE '%flagstaff%' OR city_name ILIKE '%arizona%' THEN 'AZ'
            WHEN city_name ILIKE '%los angeles%' OR city_name ILIKE '%santa monica%' THEN 'CA'
            ELSE state
          END
          WHERE state IS NULL OR state = '';
        `
      });

      if (stateError) {
        console.warn('⚠️ State population had issues:', stateError);
      }

      // Step 2: Populate name field for hidden_gems where missing
      console.log('📝 Step 2: Populating name fields...');
      const { error: nameError } = await supabase.rpc('sql', {
        query: `
          UPDATE hidden_gems 
          SET name = title 
          WHERE name IS NULL OR name = '';
          
          UPDATE attractions 
          SET title = name 
          WHERE title IS NULL OR title = '';
        `
      });

      if (nameError) {
        console.warn('⚠️ Name field population had issues:', nameError);
      }

      // Step 3: Generate slugs for all records
      console.log('🔗 Step 3: Generating slugs...');
      const { error: slugError } = await supabase.rpc('sql', {
        query: `
          UPDATE attractions 
          SET slug = generate_slug(name) 
          WHERE slug IS NULL OR slug = '';
          
          UPDATE hidden_gems 
          SET slug = generate_slug(title) 
          WHERE slug IS NULL OR slug = '';
        `
      });

      if (slugError) {
        console.warn('⚠️ Slug generation had issues:', slugError);
      }

      // Step 4: Set default categories
      console.log('🏷️ Step 4: Setting default categories...');
      const { error: categoryError } = await supabase.rpc('sql', {
        query: `
          UPDATE attractions 
          SET category = 'attraction' 
          WHERE category IS NULL OR category = '';
          
          UPDATE hidden_gems 
          SET category = 'hidden_gems' 
          WHERE category IS NULL OR category = '';
        `
      });

      if (categoryError) {
        console.warn('⚠️ Category setting had issues:', categoryError);
      }

      console.log('✅ Complete data migration finished successfully');
      return { success: true };

    } catch (error) {
      console.error('❌ Complete data migration failed:', error);
      return { success: false, error };
    }
  }

  /**
   * Validate the migration was successful
   */
  static async validateMigration() {
    try {
      console.log('🔍 Validating migration results...');

      // Check attractions table
      const { data: attractions, error: attractionsError } = await supabase
        .from('attractions')
        .select('id, name, title, state, category, slug')
        .limit(5);

      if (attractionsError) {
        throw new Error(`Attractions validation failed: ${attractionsError.message}`);
      }

      // Check hidden_gems table
      const { data: hiddenGems, error: hiddenGemsError } = await supabase
        .from('hidden_gems')
        .select('id, name, title, state, category, slug')
        .limit(5);

      if (hiddenGemsError) {
        throw new Error(`Hidden gems validation failed: ${hiddenGemsError.message}`);
      }

      console.log('✅ Migration validation successful');
      console.log('Sample attractions:', attractions);
      console.log('Sample hidden gems:', hiddenGems);

      return { 
        success: true, 
        attractions: attractions?.length || 0,
        hiddenGems: hiddenGems?.length || 0
      };

    } catch (error) {
      console.error('❌ Migration validation failed:', error);
      return { success: false, error };
    }
  }
}
