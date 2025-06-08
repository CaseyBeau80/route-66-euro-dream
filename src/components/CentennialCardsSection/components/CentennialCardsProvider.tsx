
import React from 'react';
import CentennialDataProvider from './CentennialDataProvider';
import CentennialLayout from './CentennialLayout';

const CentennialCardsProvider: React.FC = () => {
  return (
    <CentennialDataProvider>
      <CentennialLayout />
    </CentennialDataProvider>
  );
};

export default CentennialCardsProvider;
