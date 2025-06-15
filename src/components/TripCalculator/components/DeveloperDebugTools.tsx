
import React from 'react';

const DeveloperDebugTools: React.FC = () => {
  // Only show in development mode
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
      <div className="text-purple-800 text-sm">
        🔧 Developer Tools: Recommendation system has been disabled
      </div>
    </div>
  );
};

export default DeveloperDebugTools;
