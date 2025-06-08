
import { useState } from 'react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { TripService } from '../services/TripService';
import { toast } from '@/hooks/use-toast';

export const useTripAutoSaveBeforeShare = () => {
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  const saveBeforeShare = async (
    tripPlan: TripPlan,
    currentShareCode?: string | null
  ): Promise<string | null> => {
    // If we already have a share code, return it
    if (currentShareCode) {
      console.log('🔗 Trip already has share code:', currentShareCode);
      return currentShareCode;
    }

    // Auto-save the trip to generate a share code
    setIsAutoSaving(true);
    
    try {
      console.log('💾 Auto-saving trip before sharing...');
      
      const shareCode = await TripService.saveTrip(
        tripPlan,
        tripPlan.title,
        `Route 66 trip from ${tripPlan.segments?.[0]?.startCity || 'Start'} to ${tripPlan.segments?.[tripPlan.segments.length - 1]?.endCity || 'End'}`
      );

      toast({
        title: "Trip Saved!",
        description: "Your trip has been saved and is ready to share.",
        variant: "default"
      });

      console.log('✅ Trip auto-saved with share code:', shareCode);
      return shareCode;
    } catch (error) {
      console.error('❌ Failed to auto-save trip:', error);
      
      toast({
        title: "Save Failed",
        description: "Could not save your trip. Please try again.",
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsAutoSaving(false);
    }
  };

  return {
    saveBeforeShare,
    isAutoSaving
  };
};
