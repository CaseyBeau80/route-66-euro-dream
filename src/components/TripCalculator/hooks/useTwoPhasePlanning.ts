
import { useState, useCallback } from 'react';
import { TripFormData } from '../types/tripCalculator';
import { useFormValidation } from './useFormValidation';

export interface TwoPhasePlanningState {
  phase: 'form' | 'adjustment' | 'planning' | 'complete';
  adjustedFormData: TripFormData | null;
  isProcessing: boolean;
  adjustmentAcknowledged: boolean;
}

export const useTwoPhasePlanning = (formData: TripFormData) => {
  const { dayAdjustmentInfo, isFormValid } = useFormValidation(formData);
  const [planningState, setPlanningState] = useState<TwoPhasePlanningState>({
    phase: 'form',
    adjustedFormData: null,
    isProcessing: false,
    adjustmentAcknowledged: false
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
    if (dayAdjustmentInfo && !planningState.adjustmentAcknowledged) {
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
      console.log('🎯 TWO-PHASE: Using data for planning:', {
        hasAdjustedData: !!planningState.adjustedFormData,
        travelDays: dataToUse.travelDays,
        originalDays: formData.travelDays
      });
      
      await onPlanTrip(dataToUse);
      
      console.log('✅ TWO-PHASE: Planning completed successfully');
      setPlanningState(prev => ({ ...prev, phase: 'complete', isProcessing: false }));
      
    } catch (error) {
      console.error('❌ TWO-PHASE: Planning failed:', error);
      setPlanningState(prev => ({ ...prev, phase: 'form', isProcessing: false }));
      throw error;
    }
  }, [formData, dayAdjustmentInfo, planningState.adjustedFormData, planningState.adjustmentAcknowledged]);

  const acknowledgeAdjustment = useCallback(() => {
    console.log('✅ TWO-PHASE: User acknowledged day adjustment');
    setPlanningState(prev => ({ 
      ...prev, 
      adjustmentAcknowledged: true
    }));
  }, []);

  const resetPlanning = useCallback(() => {
    console.log('🔄 TWO-PHASE: Resetting planning state');
    setPlanningState({
      phase: 'form',
      adjustedFormData: null,
      isProcessing: false,
      adjustmentAcknowledged: false
    });
  }, []);

  return {
    planningState,
    startPlanning,
    acknowledgeAdjustment,
    resetPlanning,
    needsAdjustment: !!dayAdjustmentInfo && !planningState.adjustmentAcknowledged,
    canProceedWithPlanning: isFormValid && (!dayAdjustmentInfo || planningState.adjustmentAcknowledged)
  };
};
