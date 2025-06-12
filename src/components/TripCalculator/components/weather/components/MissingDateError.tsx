
import React from 'react';

interface MissingDateErrorProps {
  cityName: string;
}

const MissingDateError: React.FC<MissingDateErrorProps> = ({ cityName }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded p-3 text-red-700">
      ❌ Missing segment date for {cityName}
    </div>
  );
};

export default MissingDateError;
