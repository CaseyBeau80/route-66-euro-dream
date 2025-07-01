import { supabase } from '@/integrations/supabase/client';

export class HiddenGemsToAttractionsService {
  /**
   * List of specific entries to move
   */
  private static readonly ENTRIES_TO_MOVE = [
    'Cadillac Ranch',
    'Blue Whale of Catoosa',
    'World\'s Largest Rocking Chair',
    'Leaning Water Tower of Britten',
    'Devil\'s Rope Museum',
    'Big Texan Steak Ranch',
    'Meteor Crater',
    'Wigwam Motel',
    'World\'s Largest Thermometer',
    'End of the Trail Monument'
  ];

  /**
   * Execute the complete migration plan
   */
  static async executeMigrationPlan() {
    console.log('🚀 Starting Hidden Gems to Attractions migration...');
    
    try {
      // Step 1: Handle the duplicate "Cadillac Ranch" in both tables
      console.log('🔍 Step 1: Checking for duplicates...');
      const duplicateResult = await this.handleDuplicates();
      
      // Step 2: Move the 10 specific entries
      console.log('📦 Step 2: Moving specific entries...');
      const moveResults = await this.moveSpecificEntries();
      
      // Step 3: Populate missing state values in attractions
      console.log('🏛️ Step 3: Populating missing states...');
      const statesResult = await this.populateMissingStates();
      
      // Step 4: Verify the migration
      console.log('✅ Step 4: Verifying migration...');
      const verificationResults = await this.verifyMigration();
      
      console.log('🎉 Migration completed successfully!');
      
      return {
        success: true,
        duplicateHandled: duplicateResult.success,
        moveResults: moveResults,
        statesPopulated: statesResult.success,
        verificationResults: verificationResults
      };
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Handle duplicate entries between tables
   */
  private static async handleDuplicates() {
    try {
      console.log('🔍 Checking for "Cadillac Ranch" in both tables...');
      
      // Check if Cadillac Ranch exists in both tables
      const [hiddenGemResult, attractionResult] = await Promise.all([
        supabase
          .from('hidden_gems')
          .select('id, title, name')
          .ilike('title', '%cadillac ranch%'),
        supabase
          .from('attractions')
          .select('id, name, title')
          .ilike('name', '%cadillac ranch%')
      ]);

      console.log('Hidden Gems Cadillac Ranch:', hiddenGemResult.data?.length || 0);
      console.log('Attractions Cadillac Ranch:', attractionResult.data?.length || 0);

      if (hiddenGemResult.data && hiddenGemResult.data.length > 0 && 
          attractionResult.data && attractionResult.data.length > 0) {
        
        console.log('🗑️ Removing duplicate from attractions table...');
        
        // Remove from attractions (keep the one in hidden_gems to be moved)
        const { error: deleteError } = await supabase
          .from('attractions')
          .delete()
          .ilike('name', '%cadillac ranch%');

        if (deleteError) {
          console.error('❌ Error removing duplicate:', deleteError);
          return { success: false, error: deleteError.message };
        }
        
        console.log('✅ Duplicate removed from attractions');
      }
      
      return { success: true };
      
    } catch (error) {
      console.error('❌ Error handling duplicates:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Move specific entries from hidden_gems to attractions
   */
  private static async moveSpecificEntries() {
    const results = [];
    
    for (const entryName of this.ENTRIES_TO_MOVE) {
      console.log(`🔄 Processing: ${entryName}`);
      
      try {
        // Find the entry in hidden_gems
        const { data: hiddenGem, error: fetchError } = await supabase
          .from('hidden_gems')
          .select('*')
          .or(`title.ilike.%${entryName}%,name.ilike.%${entryName}%`)
          .limit(1)
          .single();

        if (fetchError || !hiddenGem) {
          console.log(`⚠️ Entry not found: ${entryName}`);
          results.push({ name: entryName, success: false, error: 'Not found' });
          continue;
        }

        console.log(`📍 Found: ${hiddenGem.title || hiddenGem.name} in hidden_gems`);

        // Insert into attractions
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
          console.error(`❌ Error inserting ${entryName}:`, insertError);
          results.push({ name: entryName, success: false, error: insertError.message });
          continue;
        }

        // Delete from hidden_gems
        const { error: deleteError } = await supabase
          .from('hidden_gems')
          .delete()
          .eq('id', hiddenGem.id);

        if (deleteError) {
          console.error(`❌ Error deleting ${entryName} from hidden_gems:`, deleteError);
          results.push({ name: entryName, success: false, error: deleteError.message });
          continue;
        }

        console.log(`✅ Successfully moved: ${entryName}`);
        results.push({ name: entryName, success: true });

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
   * Populate missing state values in attractions
   */
  private static async populateMissingStates() {
    try {
      console.log('🏛️ Populating missing state values...');
      
      const { data: attractionsWithoutState, error: fetchError } = await supabase
        .from('attractions')
        .select('id, city_name, state')
        .or('state.is.null,state.eq.');

      if (fetchError) {
        console.error('❌ Error fetching attractions without state:', fetchError);
        return { success: false, error: fetchError.message };
      }

      if (!attractionsWithoutState || attractionsWithoutState.length === 0) {
        console.log('✅ No attractions missing state values');
        return { success: true };
      }

      for (const attraction of attractionsWithoutState) {
        let newState = null;
        const cityLower = attraction.city_name?.toLowerCase() || '';
        
        // State mapping logic
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

          if (updateError) {
            console.error('❌ Error updating state:', updateError);
          } else {
            console.log(`✅ Updated state for ${attraction.city_name}: ${newState}`);
          }
        }
      }
      
      return { success: true };
      
    } catch (error) {
      console.error('❌ Error populating states:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Verify the migration was successful
   */
  private static async verifyMigration() {
    try {
      const results = {
        movedEntries: [],
        totalInAttractions: 0
      };

      // Check how many of our target entries are now in attractions
      for (const entryName of this.ENTRIES_TO_MOVE) {
        const { data: attraction } = await supabase
          .from('attractions')
          .select('name, title')
          .or(`name.ilike.%${entryName}%,title.ilike.%${entryName}%`)
          .limit(1)
          .single();

        if (attraction) {
          results.movedEntries.push({
            targetName: entryName,
            actualName: attraction.name || attraction.title
          });
        }
      }

      // Get total count in attractions
      const { count: attractionsCount } = await supabase
        .from('attractions')
        .select('*', { count: 'exact', head: true });

      results.totalInAttractions = attractionsCount || 0;

      console.log(`✅ Verification complete: ${results.movedEntries.length}/${this.ENTRIES_TO_MOVE.length} entries moved`);
      
      return results;
      
    } catch (error) {
      console.error('❌ Verification error:', error);
      return { movedEntries: [], totalInAttractions: 0 };
    }
  }

  /**
   * Get current migration status
   */
  static async getMigrationStatus() {
    try {
      const status = {
        entriesInAttractions: [],
        entriesInHiddenGems: [],
        notFound: []
      };

      for (const entryName of this.ENTRIES_TO_MOVE) {
        // Check attractions first
        const { data: attraction } = await supabase
          .from('attractions')
          .select('name, title')
          .or(`name.ilike.%${entryName}%,title.ilike.%${entryName}%`)
          .limit(1)
          .single();

        if (attraction) {
          status.entriesInAttractions.push({
            name: entryName,
            actualName: attraction.name || attraction.title
          });
          continue;
        }

        // Check hidden_gems
        const { data: hiddenGem } = await supabase
          .from('hidden_gems')
          .select('name, title')
          .or(`title.ilike.%${entryName}%,name.ilike.%${entryName}%`)
          .limit(1)
          .single();

        if (hiddenGem) {
          status.entriesInHiddenGems.push({
            name: entryName,
            actualName: hiddenGem.title || hiddenGem.name
          });
        } else {
          status.notFound.push(entryName);
        }
      }

      return status;
      
    } catch (error) {
      console.error('❌ Status check error:', error);
      return {
        entriesInAttractions: [],
        entriesInHiddenGems: [],
        notFound: this.ENTRIES_TO_MOVE
      };
    }
  }
}
