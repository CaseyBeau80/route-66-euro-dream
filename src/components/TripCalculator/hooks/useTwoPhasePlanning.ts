
import { useState, useCallback } from 'react';
import { TripFormData } from '../types/tripCalculator';
import { useFormValidation } from './useFormValidation';

export interface TwoPhasePlanningState {
  phase: 'form' | 'acknowledgment' | 'planning' | 'complete';
  isProcessing: boolean;
  userAcknowledgedAdjustment: boolean;
  showModal: boolean;
}

export const useTwoPhasePlanning = (formData: TripFormData) => {
  const { dayAdjustmentInfo, isFormValid } = useFormValidation(formData);
  const [planningState, setPlanningState] = useState<TwoPhasePlanningState>({
    phase: 'form',
    isProcessing: false,
    userAcknowledgedAdjustment: false,
    showModal: false
  });

  console.log('🔄 useTwoPhasePlanning state:', {
    phase: planningState.phase,
    dayAdjustmentInfo: !!dayAdjustmentInfo,
    isFormValid,
    userAcknowledgedAdjustment: planningState.userAcknowledgedAdjustment,
    isProcessing: planningState.isProcessing,
    showModal: planningState.showModal
  });

  const startPlanning = useCallback(async (onPlanTrip: (data: TripFormData) => Promise<void>) => {
    console.log('🚀 Starting two-phase planning process');
    
    // If day adjustment is needed and user hasn't acknowledged, show modal
    if (dayAdjustmentInfo && !planningState.userAcknowledgedAdjustment) {
      console.log('⚠️ Day adjustment needed - showing modal for acknowledgment');
      setPlanningState(prev => ({ 
        ...prev, 
        phase: 'acknowledgment',
        showModal: true
      }));
      return; // Don't proceed until user acknowledges
    }

    // Proceed with planning
    console.log('🎯 Proceeding with planning');
    
    try {
      setPlanningState(prev => ({ 
        ...prev, 
        phase: 'planning', 
        isProcessing: true,
        showModal: true // Keep modal open during planning
      }));
      
      // Use adjusted data if available
      const dataToUse = dayAdjustmentInfo ? {
        ...formData,
        travelDays: dayAdjustmentInfo.minimum
      } : formData;
      
      await onPlanTrip(dataToUse);
      
      console.log('✅ Planning completed successfully');
      setPlanningState(prev => ({ 
        ...prev, 
        phase: 'complete', 
        isProcessing: false,
        showModal: false // Close modal when complete
      }));
      
    } catch (error) {
      console.error('❌ Planning failed:', error);
      setPlanningState(prev => ({ 
        ...prev, 
        phase: 'form', 
        isProcessing: false,
        showModal: false
      }));
      throw error;
    }
  }, [formData, dayAdjustmentInfo, planningState.userAcknowledgedAdjustment]);

  const acknowledgeAdjustment = useCallback(() => {
    console.log('✅ User acknowledged day adjustment');
    setPlanningState(prev => ({ 
      ...prev, 
      userAcknowledgedAdjustment: true,
      phase: 'acknowledgment' // Keep in acknowledgment phase
    }));
  }, []);

  const proceedWithPlanning = useCallback(async (onPlanTrip: (data: TripFormData) => Promise<void>) => {
    console.log('🚀 Proceeding with planning after acknowledgment');
    
    try {
      setPlanningState(prev => ({ 
        ...prev, 
        phase: 'planning', 
        isProcessing: true
      }));
      
      // Use adjusted data
      const dataToUse = dayAdjustmentInfo ? {
        ...formData,
        travelDays: dayAdjustmentInfo.minimum
      } : formData;
      
      await onPlanTrip(dataToUse);
      
      console.log('✅ Planning completed successfully');
      setPlanningState(prev => ({ 
        ...prev, 
        phase: 'complete', 
        isProcessing: false,
        showModal: false
      }));
      
    } catch (error) {
      console.error('❌ Planning failed:', error);
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
      userAcknowledgedAdjustment: false,
      showModal: false
    });
  }, []);

  const closeModal = useCallback(() => {
    console.log('🔄 Closing modal');
    setPlanningState(prev => ({ 
      ...prev, 
      showModal: false
    }));
  }, []);

  return {
    planningState,
    startPlanning,
    acknowledgeAdjustment,
    proceedWithPlanning,
    resetPlanning,
    closeModal,
    needsAdjustment: !!dayAdjustmentInfo && !planningState.userAcknowledgedAdjustment,
    canProceedWithPlanning: isFormValid && (!dayAdjustmentInfo || planningState.userAcknowledgedAdjustment)
  };
};
