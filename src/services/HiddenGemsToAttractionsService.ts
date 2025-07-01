
import { supabase } from '@/integrations/supabase/client';

export class HiddenGemsToAttractionsService {
  // List of specific entries to migrate (names as they appear in hidden_gems)
  private static readonly ENTRIES_TO_MIGRATE = [
    'Blue Whale of Catoosa',
    'Cadillac Ranch',
    'The Chain of Rocks Bridge',
    'Meramec Caverns',
    'Devils Elbow Bridge',
    'Blue Swallow Motel',
    'Wigwam Motel',
    'Petrified Forest National Park',
    'London Bridge',
    'Santa Monica Pier'
  ];

  /**
   * Get the current status of migration entries
   */
  static async getMigrationStatus() {
    try {
      console.log('🔍 Checking migration status for specific entries...');

      const entriesInAttractions = [];
      const entriesInHiddenGems = [];
      const notFound = [];

      // Check each entry individually
      for (const entryName of this.ENTRIES_TO_MIGRATE) {
        // Check if in attractions
        const { data: attractionData, error: attractionError } = await supabase
          .from('attractions')
          .select('id, name, title')
          .or(`name.ilike.%${entryName}%,title.ilike.%${entryName}%`)
          .limit(1);

        if (!attractionError && attractionData && attractionData.length > 0) {
          entriesInAttractions.push({
            name: entryName,
            actualName: attractionData[0].name || attractionData[0].title,
            id: attractionData[0].id
          });
          continue;
        }

        // Check if in hidden_gems
        const { data: hiddenGemData, error: hiddenGemError } = await supabase
          .from('hidden_gems')
          .select('id, name, title')
          .or(`name.ilike.%${entryName}%,title.ilike.%${entryName}%`)
          .limit(1);

        if (!hiddenGemError && hiddenGemData && hiddenGemData.length > 0) {
          entriesInHiddenGems.push({
            name: entryName,
            actualName: hiddenGemData[0].name || hiddenGemData[0].title,
            id: hiddenGemData[0].id
          });
        } else {
          notFound.push(entryName);
        }
      }

      console.log('✅ Migration status check completed:', {
        inAttractions: entriesInAttractions.length,
        inHiddenGems: entriesInHiddenGems.length,
        notFound: notFound.length
      });

      return {
        entriesInAttractions,
        entriesInHiddenGems,
        notFound
      };
    } catch (error) {
      console.error('❌ Error checking migration status:', error);
      throw error;
    }
  }

  /**
   * Execute the complete migration plan
   */
  static async executeMigrationPlan() {
    try {
      console.log('🚀 Starting migration execution plan...');

      // Step 1: Handle duplicates (remove from hidden_gems if already in attractions)
      console.log('🧹 Step 1: Handling duplicates...');
      const duplicateHandledResult = await this.handleDuplicates();

      // Step 2: Move remaining entries from hidden_gems to attractions
      console.log('📦 Step 2: Moving entries...');
      const moveResults = await this.moveEntriesToAttractions();

      // Step 3: Populate missing state values
      console.log('📍 Step 3: Populating missing states...');
      const statesPopulatedResult = await this.populateStates();

      // Step 4: Verify the migration
      console.log('🔍 Step 4: Verifying migration...');
      const verificationResults = await this.verifyMigration();

      console.log('✅ Migration execution completed successfully');

      return {
        success: true,
        duplicateHandled: duplicateHandledResult.success,
        moveResults,
        statesPopulated: statesPopulatedResult.success,
        verificationResults
      };
    } catch (error) {
      console.error('❌ Migration execution failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Handle duplicate entries (remove from hidden_gems if already in attractions)
   */
  private static async handleDuplicates() {
    try {
      let duplicatesHandled = 0;

      for (const entryName of this.ENTRIES_TO_MIGRATE) {
        // Check if entry exists in attractions
        const { data: attractionData } = await supabase
          .from('attractions')
          .select('id, name, title')
          .or(`name.ilike.%${entryName}%,title.ilike.%${entryName}%`)
          .limit(1);

        if (attractionData && attractionData.length > 0) {
          // If it exists in attractions, remove from hidden_gems
          const { data: hiddenGemData } = await supabase
            .from('hidden_gems')
            .select('id')
            .or(`name.ilike.%${entryName}%,title.ilike.%${entryName}%`)
            .limit(1);

          if (hiddenGemData && hiddenGemData.length > 0) {
            const { error: deleteError } = await supabase
              .from('hidden_gems')
              .delete()
              .eq('id', hiddenGemData[0].id);

            if (!deleteError) {
              duplicatesHandled++;
              console.log(`🗑️ Removed duplicate from hidden_gems: ${entryName}`);
            }
          }
        }
      }

      return { success: true, duplicatesHandled };
    } catch (error) {
      console.error('❌ Error handling duplicates:', error);
      return { success: false, error };
    }
  }

  /**
   * Move entries from hidden_gems to attractions
   */
  private static async moveEntriesToAttractions() {
    const results = [];

    for (const entryName of this.ENTRIES_TO_MIGRATE) {
      try {
        // Find the entry in hidden_gems
        const { data: hiddenGemData, error: fetchError } = await supabase
          .from('hidden_gems')
          .select('*')
          .or(`name.ilike.%${entryName}%,title.ilike.%${entryName}%`)
          .limit(1);

        if (fetchError || !hiddenGemData || hiddenGemData.length === 0) {
          results.push({
            name: entryName,
            success: false,
            error: 'Not found in hidden_gems'
          });
          continue;
        }

        const gem = hiddenGemData[0];

        // Insert into attractions
        const { error: insertError } = await supabase
          .from('attractions')
          .insert({
            name: gem.name || gem.title,
            title: gem.title,
            description: gem.description,
            city_name: gem.city_name,
            state: gem.state || 'Unknown',
            latitude: gem.latitude,
            longitude: gem.longitude,
            image_url: gem.image_url,
            thumbnail_url: gem.thumbnail_url,
            website: gem.website,
            category: 'attraction',
            featured: gem.featured || false,
            founded_year: gem.founded_year,
            year_opened: gem.year_opened,
            tags: gem.tags || [],
            slug: gem.slug
          });

        if (insertError) {
          results.push({
            name: entryName,
            success: false,
            error: insertError.message
          });
          continue;
        }

        // Delete from hidden_gems
        const { error: deleteError } = await supabase
          .from('hidden_gems')
          .delete()
          .eq('id', gem.id);

        if (deleteError) {
          results.push({
            name: entryName,
            success: false,
            error: `Inserted but failed to delete: ${deleteError.message}`
          });
        } else {
          results.push({
            name: entryName,
            success: true
          });
          console.log(`✅ Successfully moved: ${entryName}`);
        }

      } catch (error) {
        results.push({
          name: entryName,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }

  /**
   * Populate missing state values
   */
  private static async populateStates() {
    try {
      // Get attractions with missing states
      const { data: attractionsWithoutState, error: fetchError } = await supabase
        .from('attractions')
        .select('id, city_name, state')
        .or('state.is.null,state.eq.');

      if (fetchError) {
        return { success: false, error: fetchError.message };
      }

      let statesUpdated = 0;

      if (attractionsWithoutState) {
        for (const attraction of attractionsWithoutState) {
          let newState = null;
          const cityLower = attraction.city_name?.toLowerCase() || '';

          // Map cities to states
          if (cityLower.includes('chicago')) newState = 'IL';
          else if (cityLower.includes('springfield') && !cityLower.includes('missouri')) newState = 'IL';
          else if (cityLower.includes('st. louis') || cityLower.includes('saint louis')) newState = 'MO';
          else if (cityLower.includes('tulsa') || cityLower.includes('oklahoma')) newState = 'OK';
          else if (cityLower.includes('amarillo') || cityLower.includes('texas')) newState = 'TX';
          else if (cityLower.includes('albuquerque') || cityLower.includes('santa fe')) newState = 'NM';
          else if (cityLower.includes('flagstaff') || cityLower.includes('arizona')) newState = 'AZ';
          else if (cityLower.includes('los angeles') || cityLower.includes('santa monica')) newState = 'CA';

          if (newState) {
            const { error: updateError } = await supabase
              .from('attractions')
              .update({ state: newState })
              .eq('id', attraction.id);

            if (!updateError) {
              statesUpdated++;
            }
          }
        }
      }

      return { success: true, statesUpdated };
    } catch (error) {
      console.error('❌ Error populating states:', error);
      return { success: false, error };
    }
  }

  /**
   * Verify the migration results
   */
  private static async verifyMigration() {
    try {
      // Count how many of our target entries are now in attractions
      const movedEntries = [];
      const stillInHiddenGems = [];

      for (const entryName of this.ENTRIES_TO_MIGRATE) {
        const { data: attractionData } = await supabase
          .from('attractions')
          .select('id, name, title')
          .or(`name.ilike.%${entryName}%,title.ilike.%${entryName}%`)
          .limit(1);

        if (attractionData && attractionData.length > 0) {
          movedEntries.push(entryName);
        } else {
          stillInHiddenGems.push(entryName);
        }
      }

      // Get total count in attractions table
      const { count: totalInAttractions } = await supabase
        .from('attractions')
        .select('*', { count: 'exact', head: true });

      return {
        movedEntries,
        stillInHiddenGems,
        totalInAttractions: totalInAttractions || 0,
        migrationSuccess: movedEntries.length >= 8 // Success if at least 8 out of 10 moved
      };
    } catch (error) {
      console.error('❌ Error verifying migration:', error);
      return {
        movedEntries: [],
        stillInHiddenGems: this.ENTRIES_TO_MIGRATE,
        totalInAttractions: 0,
        migrationSuccess: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
