
import { useState, useCallback } from 'react';
import { TripFormData } from '../types/tripCalculator';
import { useFormValidation } from './useFormValidation';

export interface TwoPhasePlanningState {
  phase: 'form' | 'adjustment' | 'planning' | 'complete';
  adjustedFormData: TripFormData | null;
  isProcessing: boolean;
  adjustmentAcknowledged: boolean; // NEW: Track if user acknowledged the adjustment
}

export const useTwoPhasePlanning = (formData: TripFormData) => {
  const { dayAdjustmentInfo, isFormValid } = useFormValidation(formData);
  const [planningState, setPlanningState] = useState<TwoPhasePlanningState>({
    phase: 'form',
    adjustedFormData: null,
    isProcessing: false,
    adjustmentAcknowledged: false // NEW: Initialize as false
  });

  console.log('🔄 useTwoPhasePlanning state:', {
    phase: planningState.phase,
    dayAdjustmentInfo: !!dayAdjustmentInfo,
    isFormValid,
    adjustedFormData: !!planningState.adjustedFormData,
    adjustmentAcknowledged: planningState.adjustmentAcknowledged
  });

  const startPlanning = useCallback(async (onPlanTrip: (data: TripFormData) => Promise<void>) => {
    console.log('🚀 TWO-PHASE: Starting planning process');
    
    // Phase 1: Check if day adjustment is needed AND not yet acknowledged
    if (dayAdjustmentInfo && planningState.phase === 'form' && !planningState.adjustmentAcknowledged) {
      console.log('📋 TWO-PHASE: Phase 1 - Day adjustment needed, showing adjustment modal');
      
      // Create adjusted form data
      const adjustedData: TripFormData = {
        ...formData,
        travelDays: dayAdjustmentInfo.minimum
      };

      setPlanningState({
        phase: 'adjustment',
        adjustedFormData: adjustedData,
        isProcessing: false,
        adjustmentAcknowledged: false
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
  }, [formData, dayAdjustmentInfo, planningState.phase, planningState.adjustedFormData, planningState.adjustmentAcknowledged]);

  const acknowledgeAdjustment = useCallback(() => {
    console.log('✅ TWO-PHASE: User acknowledged day adjustment');
    // Mark adjustment as acknowledged and change phase to allow planning to proceed
    setPlanningState(prev => ({ 
      ...prev, 
      phase: 'form', // This allows startPlanning to proceed to phase 2
      adjustmentAcknowledged: true // NEW: Mark as acknowledged
    }));
  }, []);

  const resetPlanning = useCallback(() => {
    console.log('🔄 TWO-PHASE: Resetting planning state');
    setPlanningState({
      phase: 'form',
      adjustedFormData: null,
      isProcessing: false,
      adjustmentAcknowledged: false // NEW: Reset acknowledgment flag
    });
  }, []);

  return {
    planningState,
    startPlanning,
    acknowledgeAdjustment,
    resetPlanning,
    needsAdjustment: !!dayAdjustmentInfo && planningState.phase === 'form' && !planningState.adjustmentAcknowledged,
    canProceedWithPlanning: isFormValid && (!dayAdjustmentInfo || planningState.adjustmentAcknowledged)
  };
};
