
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
      
      // Get all hidden_gems with missing states
      const { data: gemsWithoutState, error: fetchError } = await supabase
        .from('hidden_gems')
        .select('id, city_name, state')
        .or('state.is.null,state.eq.');

      if (fetchError) {
        console.warn('⚠️ Error fetching gems without state:', fetchError);
      } else if (gemsWithoutState) {
        // Update states based on city patterns
        for (const gem of gemsWithoutState) {
          let newState = null;
          const cityLower = gem.city_name?.toLowerCase() || '';
          
          if (cityLower.includes('chicago')) newState = 'IL';
          else if (cityLower.includes('springfield') && !cityLower.includes('missouri')) newState = 'IL';
          else if (cityLower.includes('st. louis') || cityLower.includes('saint louis')) newState = 'MO';
          else if (cityLower.includes('tulsa') || cityLower.includes('oklahoma')) newState = 'OK';
          else if (cityLower.includes('amarillo') || cityLower.includes('texas')) newState = 'TX';
          else if (cityLower.includes('albuquerque') || cityLower.includes('santa fe')) newState = 'NM';
          else if (cityLower.includes('flagstaff') || cityLower.includes('arizona')) newState = 'AZ';
          else if (cityLower.includes('los angeles') || cityLower.includes('santa monica')) newState = 'CA';
          
          if (newState) {
            await supabase
              .from('hidden_gems')
              .update({ state: newState })
              .eq('id', gem.id);
          }
        }
      }

      // Step 2: Populate name field for hidden_gems where missing
      console.log('📝 Step 2: Populating name fields...');
      
      // Update hidden_gems name from title
      const { error: gemsNameError } = await supabase
        .from('hidden_gems')
        .update({ name: supabase.raw('title') })
        .or('name.is.null,name.eq.');

      if (gemsNameError) {
        console.warn('⚠️ Hidden gems name population had issues:', gemsNameError);
      }

      // Update attractions title from name
      const { error: attractionsTitleError } = await supabase
        .from('attractions')
        .update({ title: supabase.raw('name') })
        .or('title.is.null,title.eq.');

      if (attractionsTitleError) {
        console.warn('⚠️ Attractions title population had issues:', attractionsTitleError);
      }

      // Step 3: Generate slugs for all records
      console.log('🔗 Step 3: Generating slugs...');
      
      // Get attractions without slugs and generate them
      const { data: attractionsWithoutSlugs, error: attractionsSlugFetchError } = await supabase
        .from('attractions')
        .select('id, name')
        .or('slug.is.null,slug.eq.');

      if (!attractionsSlugFetchError && attractionsWithoutSlugs) {
        for (const attraction of attractionsWithoutSlugs) {
          if (attraction.name) {
            const { error: slugError } = await supabase.rpc('generate_slug', { 
              input_text: attraction.name 
            });
            
            if (!slugError) {
              const slug = attraction.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              await supabase
                .from('attractions')
                .update({ slug })
                .eq('id', attraction.id);
            }
          }
        }
      }

      // Get hidden_gems without slugs and generate them
      const { data: gemsWithoutSlugs, error: gemsSlugFetchError } = await supabase
        .from('hidden_gems')
        .select('id, title')
        .or('slug.is.null,slug.eq.');

      if (!gemsSlugFetchError && gemsWithoutSlugs) {
        for (const gem of gemsWithoutSlugs) {
          if (gem.title) {
            const slug = gem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            await supabase
              .from('hidden_gems')
              .update({ slug })
              .eq('id', gem.id);
          }
        }
      }

      // Step 4: Set default categories
      console.log('🏷️ Step 4: Setting default categories...');
      
      const { error: attractionsCategoryError } = await supabase
        .from('attractions')
        .update({ category: 'attraction' })
        .or('category.is.null,category.eq.');

      if (attractionsCategoryError) {
        console.warn('⚠️ Attractions category setting had issues:', attractionsCategoryError);
      }

      const { error: gemsCategoryError } = await supabase
        .from('hidden_gems')
        .update({ category: 'hidden_gems' })
        .or('category.is.null,category.eq.');

      if (gemsCategoryError) {
        console.warn('⚠️ Hidden gems category setting had issues:', gemsCategoryError);
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
