
import { useState, useCallback } from 'react';
import { TripFormData } from '../types/tripCalculator';
import { useFormValidation } from './useFormValidation';

export interface TwoPhasePlanningState {
  phase: 'form' | 'planning' | 'complete';
  isProcessing: boolean;
  userAcknowledgedAdjustment: boolean;
}

export const useTwoPhasePlanning = (formData: TripFormData) => {
  const { dayAdjustmentInfo, isFormValid } = useFormValidation(formData);
  const [planningState, setPlanningState] = useState<TwoPhasePlanningState>({
    phase: 'form',
    isProcessing: false,
    userAcknowledgedAdjustment: false
  });

  console.log('🔄 useTwoPhasePlanning state:', {
    phase: planningState.phase,
    dayAdjustmentInfo: !!dayAdjustmentInfo,
    isFormValid,
    userAcknowledgedAdjustment: planningState.userAcknowledgedAdjustment,
    isProcessing: planningState.isProcessing
  });

  const startPlanning = useCallback(async (onPlanTrip: (data: TripFormData) => Promise<void>) => {
    console.log('🚀 SIMPLE APPROACH: Starting planning process');
    
    // If day adjustment is needed and user hasn't acknowledged, require acknowledgment first
    if (dayAdjustmentInfo && !planningState.userAcknowledgedAdjustment) {
      console.log('⚠️ SIMPLE APPROACH: Day adjustment needed but not acknowledged yet');
      return; // Don't proceed until user acknowledges
    }

    // Proceed with planning
    console.log('🎯 SIMPLE APPROACH: Proceeding with planning');
    
    try {
      setPlanningState(prev => ({ 
        ...prev, 
        phase: 'planning', 
        isProcessing: true
      }));
      
      // Use adjusted data if available
      const dataToUse = dayAdjustmentInfo ? {
        ...formData,
        travelDays: dayAdjustmentInfo.minimum
      } : formData;
      
      await onPlanTrip(dataToUse);
      
      console.log('✅ SIMPLE APPROACH: Planning completed successfully');
      setPlanningState(prev => ({ 
        ...prev, 
        phase: 'complete', 
        isProcessing: false
      }));
      
    } catch (error) {
      console.error('❌ SIMPLE APPROACH: Planning failed:', error);
      setPlanningState(prev => ({ 
        ...prev, 
        phase: 'form', 
        isProcessing: false
      }));
      throw error;
    }
  }, [formData, dayAdjustmentInfo, planningState.userAcknowledgedAdjustment]);

  const acknowledgeAdjustment = useCallback(() => {
    console.log('✅ SIMPLE APPROACH: User acknowledged day adjustment');
    setPlanningState(prev => ({ 
      ...prev, 
      userAcknowledgedAdjustment: true
    }));
  }, []);

  const resetPlanning = useCallback(() => {
    console.log('🔄 SIMPLE APPROACH: Resetting planning state');
    setPlanningState({
      phase: 'form',
      isProcessing: false,
      userAcknowledgedAdjustment: false
    });
  }, []);

  return {
    planningState,
    startPlanning,
    acknowledgeAdjustment,
    resetPlanning,
    needsAdjustment: !!dayAdjustmentInfo && !planningState.userAcknowledgedAdjustment,
    canProceedWithPlanning: isFormValid && (!dayAdjustmentInfo || planningState.userAcknowledgedAdjustment)
  };
};
