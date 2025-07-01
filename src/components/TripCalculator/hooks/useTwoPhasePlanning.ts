import { useState, useCallback } from 'react';
import { TripFormData } from '../types/tripCalculator';
import { useFormValidation } from './useFormValidation';

// DEPRECATED: This hook is no longer used in favor of simple inline approach
// Keeping for reference but should be removed once migration is confirmed working

export interface TwoPhasePlanningState {
  phase: 'form' | 'acknowledgment' | 'planning' | 'complete';
  isProcessing: boolean;
  showModal: boolean;
}

export const useTwoPhasePlanning = (formData: TripFormData) => {
  const { dayAdjustmentInfo, isFormValid } = useFormValidation(formData);
  const [planningState, setPlanningState] = useState<TwoPhasePlanningState>({
    phase: 'form',
    isProcessing: false,
    showModal: false
  });

  console.warn('⚠️ DEPRECATED: useTwoPhasePlanning hook is deprecated. Use simple inline approach instead.');

  const startPlanning = useCallback(async (onPlanTrip: (data: TripFormData) => Promise<void>) => {
    console.log('🚀 DEPRECATED: useTwoPhasePlanning.startPlanning called');
    
    try {
      setPlanningState(prev => ({ 
        ...prev, 
        phase: 'planning', 
        isProcessing: true,
        showModal: false
      }));
      
      await onPlanTrip(formData);
      
      setPlanningState(prev => ({ 
        ...prev, 
        phase: 'form', 
        isProcessing: false,
        showModal: false
      }));
      
    } catch (error) {
      console.error('❌ DEPRECATED: Planning failed:', error);
      setPlanningState(prev => ({ 
        ...prev, 
        phase: 'form', 
        isProcessing: false,
        showModal: false
      }));
      throw error;
    }
  }, [formData]);

  const acknowledgeAndProceed = useCallback(async (onPlanTrip: (data: TripFormData) => Promise<void>) => {
    console.log('✅ DEPRECATED: acknowledgeAndProceed called');
    return startPlanning(onPlanTrip);
  }, [startPlanning]);

  const resetPlanning = useCallback(() => {
    console.log('🔄 DEPRECATED: Resetting planning state');
    setPlanningState({
      phase: 'form',
      isProcessing: false,
      showModal: false
    });
  }, []);

  const closeModal = useCallback(() => {
    console.log('🔄 DEPRECATED: Closing modal');
    setPlanningState(prev => ({ 
      ...prev, 
      showModal: false,
      phase: 'form',
      isProcessing: false
    }));
  }, []);

  return {
    planningState,
    startPlanning,
    acknowledgeAndProceed,
    resetPlanning,
    closeModal,
    needsAdjustment: !!dayAdjustmentInfo,
    canProceedWithPlanning: isFormValid
  };
};
