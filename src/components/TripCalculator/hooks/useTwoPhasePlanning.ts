import { useState, useCallback } from 'react';
import { TripFormData } from '../types/tripCalculator';
import { useFormValidation } from './useFormValidation';

export interface TwoPhasePlanningState {
  phase: 'form' | 'adjustment' | 'planning' | 'complete';
  adjustedFormData: TripFormData | null;
  isProcessing: boolean;
  adjustmentAcknowledged: boolean;
  showModal: boolean;
}

export const useTwoPhasePlanning = (formData: TripFormData) => {
  const { dayAdjustmentInfo, isFormValid } = useFormValidation(formData);
  const [planningState, setPlanningState] = useState<TwoPhasePlanningState>({
    phase: 'form',
    adjustedFormData: null,
    isProcessing: false,
    adjustmentAcknowledged: false,
    showModal: false
  });

  console.log('🔄 useTwoPhasePlanning state:', {
    phase: planningState.phase,
    dayAdjustmentInfo: !!dayAdjustmentInfo,
    isFormValid,
    adjustedFormData: !!planningState.adjustedFormData,
    adjustmentAcknowledged: planningState.adjustmentAcknowledged,
    showModal: planningState.showModal
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
        adjustmentAcknowledged: false,
        showModal: true
      });
      
      // CRITICAL: Return here - wait for user acknowledgment, do NOT proceed
      return;
    }

    // Phase 2: Direct planning (no adjustment needed)
    console.log('🎯 TWO-PHASE: Phase 2 - Direct planning (no adjustment needed)');
    
    try {
      setPlanningState(prev => ({ 
        ...prev, 
        phase: 'planning', 
        isProcessing: true,
        showModal: false // No modal needed for direct planning
      }));
      
      await onPlanTrip(formData);
      
      console.log('✅ TWO-PHASE: Direct planning completed successfully');
      setPlanningState(prev => ({ 
        ...prev, 
        phase: 'complete', 
        isProcessing: false,
        showModal: false
      }));
      
    } catch (error) {
      console.error('❌ TWO-PHASE: Direct planning failed:', error);
      setPlanningState(prev => ({ 
        ...prev, 
        phase: 'form', 
        isProcessing: false,
        showModal: false 
      }));
      throw error;
    }
  }, [formData, dayAdjustmentInfo, planningState.adjustmentAcknowledged]);

  const acknowledgeAdjustment = useCallback(() => {
    console.log('✅ TWO-PHASE: User acknowledged day adjustment');
    setPlanningState(prev => ({ 
      ...prev, 
      adjustmentAcknowledged: true
      // Keep showModal: true - modal stays open for proceedWithPlanning
    }));
  }, []);

  const proceedWithPlanning = useCallback(async (onPlanTrip: (data: TripFormData) => Promise<void>) => {
    console.log('🎯 TWO-PHASE: Proceeding with planning after acknowledgment');
    
    // CRITICAL: This function is called ONLY after acknowledgment
    // It should NEVER re-evaluate dayAdjustmentInfo or call startPlanning
    try {
      setPlanningState(prev => ({ 
        ...prev, 
        phase: 'planning', 
        isProcessing: true
        // Keep showModal: true - modal shows planning progress
      }));
      
      const dataToUse = planningState.adjustedFormData || formData;
      console.log('🎯 TWO-PHASE: Using adjusted data for planning:', {
        hasAdjustedData: !!planningState.adjustedFormData,
        travelDays: dataToUse.travelDays,
        originalDays: formData.travelDays
      });
      
      await onPlanTrip(dataToUse);
      
      console.log('✅ TWO-PHASE: Planning completed successfully after acknowledgment');
      setPlanningState(prev => ({ 
        ...prev, 
        phase: 'complete', 
        isProcessing: false,
        showModal: false // Only hide modal when planning is complete
      }));
      
    } catch (error) {
      console.error('❌ TWO-PHASE: Planning failed after acknowledgment:', error);
      setPlanningState(prev => ({ 
        ...prev, 
        phase: 'form', 
        isProcessing: false,
        showModal: false 
      }));
      throw error;
    }
  }, [formData, planningState.adjustedFormData]);

  const resetPlanning = useCallback(() => {
    console.log('🔄 TWO-PHASE: Resetting planning state');
    setPlanningState({
      phase: 'form',
      adjustedFormData: null,
      isProcessing: false,
      adjustmentAcknowledged: false,
      showModal: false
    });
  }, []);

  return {
    planningState,
    startPlanning,
    acknowledgeAdjustment,
    proceedWithPlanning,
    resetPlanning,
    needsAdjustment: !!dayAdjustmentInfo && !planningState.adjustmentAcknowledged,
    canProceedWithPlanning: isFormValid && (!dayAdjustmentInfo || planningState.adjustmentAcknowledged)
  };
};
