
import { supabase } from '@/integrations/supabase/client';
import { TableMigrationService } from './TableMigrationService';

export class HiddenGemsToAttractionsService {
  /**
   * List of entries to move from hidden_gems to attractions
   */
  private static readonly ENTRIES_TO_MOVE = [
    'Blue Swallow Motel',
    'Cozy Dog Drive In',
    'Munger Moss Motel',
    'Rock Cafe',
    'The Big Texan Steak Ranch',
    'Midpoint Cafe',
    'El Rancho Hotel',
    'Wigwam Motel',
    'Santa Monica Pier',
    'End of the Trail Sign'
  ];

  /**
   * Execute the complete migration plan
   */
  static async executeMigrationPlan() {
    console.log('🚀 Starting Hidden Gems to Attractions migration plan...');
    
    try {
      // Step 1: Handle El Rancho Hotel duplicate
      console.log('🔧 Step 1: Handling El Rancho Hotel duplicate...');
      await this.handleElRanchoHotelDuplicate();

      // Step 2: Populate missing state values
      console.log('📍 Step 2: Populating missing state values...');
      await this.populateMissingStates();

      // Step 3: Move entries from hidden_gems to attractions
      console.log('📦 Step 3: Moving entries to attractions...');
      const moveResults = await this.moveEntriesToAttractions();

      // Step 4: Verify the migration
      console.log('✅ Step 4: Verifying migration...');
      const verificationResults = await this.verifyMigration();

      console.log('🎉 Migration plan completed successfully!');
      return {
        success: true,
        duplicateHandled: true,
        statesPopulated: true,
        moveResults,
        verificationResults
      };

    } catch (error) {
      console.error('❌ Migration plan failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Handle El Rancho Hotel duplicate by removing it from hidden_gems
   */
  private static async handleElRanchoHotelDuplicate() {
    try {
      // Check if El Rancho Hotel exists in attractions
      const { data: attractionExists, error: attractionError } = await supabase
        .from('attractions')
        .select('id, name')
        .ilike('name', '%el rancho%')
        .limit(1);

      if (attractionError) {
        throw new Error(`Failed to check attractions: ${attractionError.message}`);
      }

      // Check if El Rancho Hotel exists in hidden_gems
      const { data: hiddenGemExists, error: hiddenGemError } = await supabase
        .from('hidden_gems')
        .select('id, title, name')
        .or('title.ilike.%el rancho%,name.ilike.%el rancho%')
        .limit(1);

      if (hiddenGemError) {
        throw new Error(`Failed to check hidden_gems: ${hiddenGemError.message}`);
      }

      if (attractionExists && attractionExists.length > 0 && hiddenGemExists && hiddenGemExists.length > 0) {
        console.log('🔄 El Rancho Hotel found in both tables, removing from hidden_gems...');
        
        const { error: deleteError } = await supabase
          .from('hidden_gems')
          .delete()
          .eq('id', hiddenGemExists[0].id);

        if (deleteError) {
          throw new Error(`Failed to delete duplicate: ${deleteError.message}`);
        }

        console.log('✅ El Rancho Hotel duplicate removed from hidden_gems');
      } else {
        console.log('ℹ️ No duplicate El Rancho Hotel found');
      }

    } catch (error) {
      console.error('❌ Error handling El Rancho Hotel duplicate:', error);
      throw error;
    }
  }

  /**
   * Populate missing state values for entries to be moved
   */
  private static async populateMissingStates() {
    try {
      // Get all hidden_gems entries that need state updates
      const { data: gemsWithoutState, error: fetchError } = await supabase
        .from('hidden_gems')
        .select('id, title, name, city_name, state')
        .or('state.is.null,state.eq.');

      if (fetchError) {
        throw new Error(`Failed to fetch gems without state: ${fetchError.message}`);
      }

      if (!gemsWithoutState || gemsWithoutState.length === 0) {
        console.log('ℹ️ No gems found without state values');
        return;
      }

      // Update states based on known patterns
      for (const gem of gemsWithoutState) {
        let newState = null;
        const title = gem.title?.toLowerCase() || '';
        const name = gem.name?.toLowerCase() || '';
        const city = gem.city_name?.toLowerCase() || '';
        
        // Determine state based on location patterns
        if (title.includes('blue swallow') || city.includes('tucumcari')) newState = 'NM';
        else if (title.includes('cozy dog') || city.includes('springfield')) newState = 'IL';
        else if (title.includes('munger moss') || city.includes('lebanon')) newState = 'MO';
        else if (title.includes('rock cafe') || city.includes('stroud')) newState = 'OK';
        else if (title.includes('big texan') || city.includes('amarillo')) newState = 'TX';
        else if (title.includes('midpoint') || city.includes('adrian')) newState = 'TX';
        else if (title.includes('wigwam') || city.includes('holbrook')) newState = 'AZ';
        else if (title.includes('santa monica') || city.includes('santa monica')) newState = 'CA';
        else if (title.includes('end of the trail') || city.includes('santa monica')) newState = 'CA';
        
        if (newState) {
          const { error: updateError } = await supabase
            .from('hidden_gems')
            .update({ state: newState })
            .eq('id', gem.id);

          if (updateError) {
            console.warn(`⚠️ Failed to update state for ${gem.title || gem.name}:`, updateError);
          } else {
            console.log(`✅ Updated state for ${gem.title || gem.name} to ${newState}`);
          }
        }
      }

    } catch (error) {
      console.error('❌ Error populating missing states:', error);
      throw error;
    }
  }

  /**
   * Move entries from hidden_gems to attractions
   */
  private static async moveEntriesToAttractions() {
    const results = [];

    for (const entryName of this.ENTRIES_TO_MOVE) {
      try {
        console.log(`🔄 Processing: ${entryName}`);

        // Find the entry in hidden_gems
        const { data: hiddenGem, error: findError } = await supabase
          .from('hidden_gems')
          .select('*')
          .or(`title.ilike.%${entryName}%,name.ilike.%${entryName}%`)
          .limit(1);

        if (findError) {
          console.warn(`⚠️ Error finding ${entryName}:`, findError);
          results.push({ name: entryName, success: false, error: findError.message });
          continue;
        }

        if (!hiddenGem || hiddenGem.length === 0) {
          console.warn(`⚠️ ${entryName} not found in hidden_gems`);
          results.push({ name: entryName, success: false, error: 'Not found in hidden_gems' });
          continue;
        }

        // Use TableMigrationService to move the entry
        const moveResult = await TableMigrationService.moveHiddenGemToAttraction(hiddenGem[0].id);
        
        if (moveResult.success) {
          console.log(`✅ Successfully moved ${entryName}`);
          results.push({ name: entryName, success: true });
        } else {
          console.warn(`⚠️ Failed to move ${entryName}:`, moveResult.error);
          results.push({ name: entryName, success: false, error: moveResult.error });
        }

      } catch (error) {
        console.error(`❌ Error processing ${entryName}:`, error);
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
   * Verify the migration was successful
   */
  private static async verifyMigration() {
    try {
      const results = {
        movedEntries: [],
        remainingInHiddenGems: [],
        totalInAttractions: 0,
        totalInHiddenGems: 0
      };

      // Check each entry in attractions
      for (const entryName of this.ENTRIES_TO_MOVE) {
        const { data: attractionData, error: attractionError } = await supabase
          .from('attractions')
          .select('id, name, title')
          .or(`name.ilike.%${entryName}%,title.ilike.%${entryName}%`)
          .limit(1);

        if (!attractionError && attractionData && attractionData.length > 0) {
          results.movedEntries.push({
            name: entryName,
            id: attractionData[0].id,
            actualName: attractionData[0].name || attractionData[0].title
          });
        }

        // Check if still in hidden_gems
        const { data: hiddenGemData, error: hiddenGemError } = await supabase
          .from('hidden_gems')
          .select('id, title, name')
          .or(`title.ilike.%${entryName}%,name.ilike.%${entryName}%`)
          .limit(1);

        if (!hiddenGemError && hiddenGemData && hiddenGemData.length > 0) {
          results.remainingInHiddenGems.push({
            name: entryName,
            id: hiddenGemData[0].id,
            actualName: hiddenGemData[0].title || hiddenGemData[0].name
          });
        }
      }

      // Get total counts
      const { count: attractionsCount } = await supabase
        .from('attractions')
        .select('*', { count: 'exact', head: true });

      const { count: hiddenGemsCount } = await supabase
        .from('hidden_gems')
        .select('*', { count: 'exact', head: true });

      results.totalInAttractions = attractionsCount || 0;
      results.totalInHiddenGems = hiddenGemsCount || 0;

      console.log('📊 Migration Verification Results:');
      console.log(`   Successfully moved: ${results.movedEntries.length}/${this.ENTRIES_TO_MOVE.length}`);
      console.log(`   Still in hidden_gems: ${results.remainingInHiddenGems.length}`);
      console.log(`   Total attractions: ${results.totalInAttractions}`);
      console.log(`   Total hidden_gems: ${results.totalInHiddenGems}`);

      return results;

    } catch (error) {
      console.error('❌ Error verifying migration:', error);
      throw error;
    }
  }

  /**
   * Get migration status
   */
  static async getMigrationStatus() {
    try {
      const statusResults = {
        entriesInAttractions: [],
        entriesInHiddenGems: [],
        notFound: []
      };

      for (const entryName of this.ENTRIES_TO_MOVE) {
        // Check attractions
        const { data: attractionData } = await supabase
          .from('attractions')
          .select('id, name, title')
          .or(`name.ilike.%${entryName}%,title.ilike.%${entryName}%`)
          .limit(1);

        // Check hidden_gems
        const { data: hiddenGemData } = await supabase
          .from('hidden_gems')
          .select('id, title, name')
          .or(`title.ilike.%${entryName}%,name.ilike.%${entryName}%`)
          .limit(1);

        if (attractionData && attractionData.length > 0) {
          statusResults.entriesInAttractions.push({
            name: entryName,
            actualName: attractionData[0].name || attractionData[0].title
          });
        } else if (hiddenGemData && hiddenGemData.length > 0) {
          statusResults.entriesInHiddenGems.push({
            name: entryName,
            actualName: hiddenGemData[0].title || hiddenGemData[0].name
          });
        } else {
          statusResults.notFound.push(entryName);
        }
      }

      return statusResults;

    } catch (error) {
      console.error('❌ Error getting migration status:', error);
      return null;
    }
  }
}
