
import { useEffect } from 'react';
import type { TimelineMilestone } from '@/data/timelineData';
import { ImageValidationService } from '../services/ImageValidationService';

export const useTimelineValidation = (milestones: TimelineMilestone[]) => {
  useEffect(() => {
    console.log('🔍 Validating timeline images...');
    
    const validationResults = ImageValidationService.validateTimelineImages(
      milestones.map(m => ({
        imageUrl: m.imageUrl,
        title: m.title,
        year: m.year
      }))
    );

    const totalImages = validationResults.length;
    const imagesWithUrls = validationResults.filter(r => r.hasUrl).length;
    const validImages = validationResults.filter(r => r.isValid).length;
    const invalidImages = validationResults.filter(r => r.hasUrl && !r.isValid);

    console.log('📊 Timeline Image Validation Summary:', {
      totalMilestones: totalImages,
      milestonesWithImages: imagesWithUrls,
      validImageUrls: validImages,
      invalidImageUrls: invalidImages.length,
      invalidUrls: invalidImages.map(img => ({ title: img.title, year: img.year, url: img.url }))
    });

    if (invalidImages.length > 0) {
      console.warn('⚠️ Invalid image URLs detected:', invalidImages);
    }

    // Test load a sample of images to verify they actually work
    const sampleUrls = validationResults
      .filter(r => r.isValid && r.url)
      .slice(0, 3)
      .map(r => r.url!);

    Promise.all(
      sampleUrls.map(async (url) => {
        const success = await ImageValidationService.testImageLoad(url);
        return { url, success };
      })
    ).then(results => {
      console.log('🧪 Sample image load test results:', results);
    });

  }, [milestones]);
};
