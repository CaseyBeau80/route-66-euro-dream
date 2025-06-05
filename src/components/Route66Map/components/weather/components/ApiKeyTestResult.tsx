
import React from 'react';

interface ApiKeyTestResultProps {
  testResult: string;
}

const ApiKeyTestResult: React.FC<ApiKeyTestResultProps> = ({ testResult }) => {
  return (
    <div className="p-2 bg-gray-50 border border-gray-200 rounded text-gray-800">
      <span className="text-xs font-mono">{testResult}</span>
    </div>
  );
};

export default ApiKeyTestResult;
