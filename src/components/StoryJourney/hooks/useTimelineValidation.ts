
import { useEffect } from 'react';
import type { TimelineMilestone } from '@/data/timelineData';
import { ImageValidationService } from '../services/ImageValidationService';

export const useTimelineValidation = (milestones: TimelineMilestone[]) => {
  useEffect(() => {
    console.log('🔍 Validating timeline images...');
    console.log('📋 Milestones to validate:', milestones.map(m => ({
      title: m.title,
      year: m.year,
      hasImageUrl: !!m.imageUrl,
      imageUrl: m.imageUrl
    })));
    
    const validationResults = ImageValidationService.validateTimelineImages(
      milestones.map(m => ({
        imageUrl: m.imageUrl,
        title: m.title,
        year: m.year
      }))
    );

    // Test actual image loading for the first few images
    const imagesToTest = validationResults
      .filter(r => r.isValid && r.url)
      .slice(0, 3);

    if (imagesToTest.length > 0) {
      console.log('🧪 Testing actual image loading for sample images...');
      
      Promise.all(
        imagesToTest.map(async (item) => {
          const success = await ImageValidationService.testImageLoad(item.url!);
          console.log(`${success ? '✅' : '❌'} Load test for ${item.title}:`, {
            url: item.url,
            success
          });
          return { ...item, loadSuccess: success };
        })
      ).then(results => {
        console.log('🏁 Image load test results:', results);
      });
    }

  }, [milestones]);
};
