
import { useEffect } from 'react';
import type { TimelineMilestone } from '@/data/timelineData';
import { EnhancedImageValidationService } from '../services/EnhancedImageValidationService';
import { SupabaseImageService } from '../services/SupabaseImageService';

export const useEnhancedTimelineValidation = (milestones: TimelineMilestone[]) => {
  useEffect(() => {
    console.log('🔍 Starting enhanced timeline validation...');
    console.log('📋 Milestones to validate:', milestones.map(m => ({
      title: m.title,
      year: m.year,
      hasImageUrl: !!m.imageUrl,
      originalImageUrl: m.imageUrl,
      migratedImageUrl: SupabaseImageService.migrateTimelineImageUrl(m.imageUrl, m.year)
    })));
    
    const runValidation = async () => {
      const { validationResults, summary } = await EnhancedImageValidationService.validateTimelineImages(
        milestones.map(m => ({
          imageUrl: m.imageUrl,
          title: m.title,
          year: m.year
        }))
      );

      console.log('🏁 Enhanced timeline validation completed');
      console.log('📈 Validation Summary:', summary);
      
      // Log detailed results for debugging
      validationResults.forEach(result => {
        if (result.source === 'fallback') {
          console.log(`⚠️ Using fallback for ${result.title}: ${result.finalUrl}`);
        } else if (result.source === 'none') {
          console.log(`❌ No valid image found for ${result.title}`);
        }
      });
    };

    runValidation().catch(error => {
      console.error('❌ Enhanced timeline validation failed:', error);
    });

  }, [milestones]);
};
