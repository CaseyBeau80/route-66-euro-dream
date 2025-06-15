
import React from 'react';

interface StopsEmptyProps {
  message?: string;
}

// Stub component - no empty states for stops
const StopsEmpty: React.FC<StopsEmptyProps> = () => {
  console.log('🚫 StopsEmpty: Component disabled');
  return null;
};

export default StopsEmpty;
