import React from 'react';

// DEPRECATED: This modal component is no longer used in favor of simple inline approach
// Keeping for reference but should be removed once migration is confirmed working

interface TwoPhasePlanningModalProps {
  formData: any;
  planningState: any;
  onAcknowledgeAndProceed: () => void;
  onClose: () => void;
}

const TwoPhasePlanningModal: React.FC<TwoPhasePlanningModalProps> = ({
  formData,
  planningState,
  onAcknowledgeAndProceed,
  onClose
}) => {
  console.warn('⚠️ DEPRECATED: TwoPhasePlanningModal component is deprecated. Use InlineDayAdjustmentNotice instead.');
  
  // Always return null - this component is deprecated
  return null;
};

export default TwoPhasePlanningModal;
