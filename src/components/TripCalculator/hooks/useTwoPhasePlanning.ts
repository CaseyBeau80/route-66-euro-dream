import { useState, useCallback } from 'react';
import { TripFormData } from '../types/tripCalculator';
import { useFormValidation } from './useFormValidation';

export interface TwoPhasePlanningState {
  phase: 'form' | 'adjustment' | 'planning' | 'complete';
  adjustedFormData: TripFormData | null;
  isProcessing: boolean;
}

export const useTwoPhasePlanning = (formData: TripFormData) => {
  const { dayAdjustmentInfo, isFormValid } = useFormValidation(formData);
  const [planningState, setPlanningState] = useState<TwoPhasePlanningState>({
    phase: 'form',
    adjustedFormData: null,
    isProcessing: false
  });

  console.log('🔄 useTwoPhasePlanning state:', {
    phase: planningState.phase,
    dayAdjustmentInfo: !!dayAdjustmentInfo,
    isFormValid,
    adjustedFormData: !!planningState.adjustedFormData
  });

  const startPlanning = useCallback(async (onPlanTrip: (data: TripFormData) => Promise<void>) => {
    console.log('🚀 TWO-PHASE: Starting planning process');
    
    // Phase 1: Check if day adjustment is needed and we're not already in adjustment phase
    if (dayAdjustmentInfo && planningState.phase === 'form') {
      console.log('📋 TWO-PHASE: Phase 1 - Day adjustment needed, showing adjustment modal');
      
      // Create adjusted form data
      const adjustedData: TripFormData = {
        ...formData,
        travelDays: dayAdjustmentInfo.minimum
      };

      setPlanningState({
        phase: 'adjustment',
        adjustedFormData: adjustedData,
        isProcessing: false
      });
      
      // CRITICAL: Return here without proceeding - wait for user acknowledgment
      return;
    }

    // Phase 2: Proceed with planning (either no adjustment needed, or user acknowledged adjustment)
    try {
      console.log('🎯 TWO-PHASE: Phase 2 - Proceeding with trip planning');
      
      setPlanningState(prev => ({ ...prev, phase: 'planning', isProcessing: true }));
      
      const dataToUse = planningState.adjustedFormData || formData;
      await onPlanTrip(dataToUse);
      
      console.log('✅ TWO-PHASE: Planning completed successfully');
      setPlanningState(prev => ({ ...prev, phase: 'complete', isProcessing: false }));
      
    } catch (error) {
      console.error('❌ TWO-PHASE: Planning failed:', error);
      setPlanningState(prev => ({ ...prev, phase: 'form', isProcessing: false }));
      throw error;
    }
  }, [formData, dayAdjustmentInfo, planningState.phase, planningState.adjustedFormData]);

  const acknowledgeAdjustment = useCallback(() => {
    console.log('✅ TWO-PHASE: User acknowledged day adjustment');
    // Keep the adjusted data but change phase to allow planning to proceed
    setPlanningState(prev => ({ 
      ...prev, 
      phase: 'form' // This allows startPlanning to proceed to phase 2
    }));
  }, []);

  const resetPlanning = useCallback(() => {
    console.log('🔄 TWO-PHASE: Resetting planning state');
    setPlanningState({
      phase: 'form',
      adjustedFormData: null,
      isProcessing: false
    });
  }, []);

  return {
    planningState,
    startPlanning,
    acknowledgeAdjustment,
    resetPlanning,
    needsAdjustment: !!dayAdjustmentInfo && planningState.phase === 'form',
    canProceedWithPlanning: isFormValid && (!dayAdjustmentInfo || planningState.adjustedFormData)
  };
};
