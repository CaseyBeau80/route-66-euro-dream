
import { supabase } from '@/integrations/supabase/client';

export class TableMigrationService {
  /**
   * Migrate data to populate missing fields in both tables
   */
  static async migrateTableData() {
    console.log('🔄 Starting data migration for attractions and hidden_gems tables');
    
    try {
      // Update attractions table - populate missing fields
      console.log('🎯 Migrating attractions data...');
      
      // Get attractions without titles and populate from name
      const { data: attractionsWithoutTitles, error: attractionsTitleFetchError } = await supabase
        .from('attractions')
        .select('id, name, title')
        .or('title.is.null,title.eq.');

      if (!attractionsTitleFetchError && attractionsWithoutTitles) {
        for (const attraction of attractionsWithoutTitles) {
          if (attraction.name && !attraction.title) {
            const { error } = await supabase
              .from('attractions')
              .update({ title: attraction.name })
              .eq('id', attraction.id);
            
            if (error) {
              console.error('❌ Error updating attraction title:', error);
            }
          }
        }
      }

      // Set default category for attractions
      const { error: attractionsCategoryError } = await supabase
        .from('attractions')
        .update({ category: 'attraction' })
        .or('category.is.null,category.eq.');

      if (attractionsCategoryError) {
        console.error('❌ Error updating attractions categories:', attractionsCategoryError);
      }

      console.log('✅ Attractions data migration completed');

      // Update hidden_gems table - populate missing fields
      console.log('💎 Migrating hidden gems data...');
      
      // Get hidden_gems without names and populate from title
      const { data: gemsWithoutNames, error: gemsNameFetchError } = await supabase
        .from('hidden_gems')
        .select('id, title, name')
        .or('name.is.null,name.eq.');

      if (!gemsNameFetchError && gemsWithoutNames) {
        for (const gem of gemsWithoutNames) {
          if (gem.title && !gem.name) {
            const { error } = await supabase
              .from('hidden_gems')
              .update({ name: gem.title })
              .eq('id', gem.id);
            
            if (error) {
              console.error('❌ Error updating hidden gem name:', error);
            }
          }
        }
      }

      // Set default category for hidden gems
      const { error: gemsCategoryError } = await supabase
        .from('hidden_gems')
        .update({ category: 'hidden_gems' })
        .or('category.is.null,category.eq.');

      if (gemsCategoryError) {
        console.error('❌ Error updating hidden gems categories:', gemsCategoryError);
      }

      console.log('✅ Hidden gems data migration completed');

      return { success: true };
    } catch (error) {
      console.error('❌ Data migration failed:', error);
      return { success: false, error };
    }
  }

  /**
   * Move an entry from attractions to hidden_gems
   */
  static async moveAttractionToHiddenGem(attractionId: string) {
    try {
      console.log(`🔄 Moving attraction ${attractionId} to hidden_gems`);
      
      // Get the attraction data
      const { data: attraction, error: fetchError } = await supabase
        .from('attractions')
        .select('*')
        .eq('id', attractionId)
        .single();

      if (fetchError || !attraction) {
        throw new Error(`Failed to fetch attraction: ${fetchError?.message}`);
      }

      // Insert into hidden_gems with mapped fields
      const { error: insertError } = await supabase
        .from('hidden_gems')
        .insert({
          title: attraction.title || attraction.name,
          name: attraction.name,
          description: attraction.description,
          city_name: attraction.city_name,
          state: attraction.state,
          latitude: attraction.latitude,
          longitude: attraction.longitude,
          image_url: attraction.image_url,
          thumbnail_url: attraction.thumbnail_url,
          website: attraction.website,
          category: 'hidden_gems',
          featured: attraction.featured || false,
          founded_year: attraction.founded_year,
          year_opened: attraction.year_opened,
          tags: attraction.tags || [],
          slug: attraction.slug
        });

      if (insertError) {
        throw new Error(`Failed to insert into hidden_gems: ${insertError.message}`);
      }

      // Delete from attractions
      const { error: deleteError } = await supabase
        .from('attractions')
        .delete()
        .eq('id', attractionId);

      if (deleteError) {
        throw new Error(`Failed to delete from attractions: ${deleteError.message}`);
      }

      console.log(`✅ Successfully moved attraction ${attractionId} to hidden_gems`);
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to move attraction to hidden gem:', error);
      return { success: false, error };
    }
  }

  /**
   * Move an entry from hidden_gems to attractions
   */
  static async moveHiddenGemToAttraction(hiddenGemId: string) {
    try {
      console.log(`🔄 Moving hidden gem ${hiddenGemId} to attractions`);
      
      // Get the hidden gem data
      const { data: hiddenGem, error: fetchError } = await supabase
        .from('hidden_gems')
        .select('*')
        .eq('id', hiddenGemId)
        .single();

      if (fetchError || !hiddenGem) {
        throw new Error(`Failed to fetch hidden gem: ${fetchError?.message}`);
      }

      // Insert into attractions with mapped fields
      const { error: insertError } = await supabase
        .from('attractions')
        .insert({
          name: hiddenGem.name || hiddenGem.title,
          title: hiddenGem.title,
          description: hiddenGem.description,
          city_name: hiddenGem.city_name,
          state: hiddenGem.state || '',
          latitude: hiddenGem.latitude,
          longitude: hiddenGem.longitude,
          image_url: hiddenGem.image_url,
          thumbnail_url: hiddenGem.thumbnail_url,
          website: hiddenGem.website,
          category: 'attraction',
          featured: hiddenGem.featured || false,
          founded_year: hiddenGem.founded_year,
          year_opened: hiddenGem.year_opened,
          tags: hiddenGem.tags || [],
          slug: hiddenGem.slug
        });

      if (insertError) {
        throw new Error(`Failed to insert into attractions: ${insertError.message}`);
      }

      // Delete from hidden_gems
      const { error: deleteError } = await supabase
        .from('hidden_gems')
        .delete()
        .eq('id', hiddenGemId);

      if (deleteError) {
        throw new Error(`Failed to delete from hidden_gems: ${deleteError.message}`);
      }

      console.log(`✅ Successfully moved hidden gem ${hiddenGemId} to attractions`);
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to move hidden gem to attraction:', error);
      return { success: false, error };
    }
  }
}
