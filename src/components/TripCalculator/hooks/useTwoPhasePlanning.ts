import { useState, useCallback } from 'react';
import { TripFormData } from '../types/tripCalculator';
import { useFormValidation } from './useFormValidation';

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

  console.log('🔄 useTwoPhasePlanning state:', {
    phase: planningState.phase,
    dayAdjustmentInfo: !!dayAdjustmentInfo,
    isFormValid,
    isProcessing: planningState.isProcessing,
    showModal: planningState.showModal
  });

  const startPlanning = useCallback(async (onPlanTrip: (data: TripFormData) => Promise<void>) => {
    console.log('🚀 Starting two-phase planning process');
    
    // If day adjustment is needed, show modal for acknowledgment
    if (dayAdjustmentInfo) {
      console.log('⚠️ Day adjustment needed - showing modal for acknowledgment');
      setPlanningState(prev => ({ 
        ...prev, 
        phase: 'acknowledgment',
        showModal: true
      }));
      return; // Don't proceed until user acknowledges
    }

    // No adjustment needed - proceed directly with planning
    console.log('🎯 No adjustment needed - proceeding directly with planning');
    
    try {
      setPlanningState(prev => ({ 
        ...prev, 
        phase: 'planning', 
        isProcessing: true,
        showModal: false // No modal needed for direct planning
      }));
      
      await onPlanTrip(formData);
      
      console.log('✅ Direct planning completed successfully');
      setPlanningState(prev => ({ 
        ...prev, 
        phase: 'form', 
        isProcessing: false,
        showModal: false
      }));
      
    } catch (error) {
      console.error('❌ Direct planning failed:', error);
      setPlanningState(prev => ({ 
        ...prev, 
        phase: 'form', 
        isProcessing: false,
        showModal: false
      }));
      throw error;
    }
  }, [formData, dayAdjustmentInfo]);

  const acknowledgeAndProceed = useCallback(async (onPlanTrip: (data: TripFormData) => Promise<void>) => {
    console.log('✅ User acknowledged adjustment - proceeding immediately to planning');
    
    try {
      setPlanningState(prev => ({ 
        ...prev, 
        phase: 'planning', 
        isProcessing: true
        // Keep showModal: true
      }));
      
      // Use adjusted data
      const dataToUse = dayAdjustmentInfo ? {
        ...formData,
        travelDays: dayAdjustmentInfo.minimum
      } : formData;
      
      await onPlanTrip(dataToUse);
      
      console.log('✅ Planning completed successfully after acknowledgment');
      setPlanningState(prev => ({ 
        ...prev, 
        phase: 'complete', 
        isProcessing: false
        // Keep showModal: true - user must manually close
      }));
      
    } catch (error) {
      console.error('❌ Planning failed after acknowledgment:', error);
      setPlanningState(prev => ({ 
        ...prev, 
        phase: 'form', 
        isProcessing: false,
        showModal: false
      }));
      throw error;
    }
  }, [formData, dayAdjustmentInfo]);

  const resetPlanning = useCallback(() => {
    console.log('🔄 Resetting planning state');
    setPlanningState({
      phase: 'form',
      isProcessing: false,
      showModal: false
    });
  }, []);

  const closeModal = useCallback(() => {
    console.log('🔄 Closing modal - user manually closed');
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
