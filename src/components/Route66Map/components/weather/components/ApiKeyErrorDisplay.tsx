
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ApiKeyErrorDisplayProps {
  error: string;
}

const ApiKeyErrorDisplay: React.FC<ApiKeyErrorDisplayProps> = ({ error }) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-red-800">
      <AlertTriangle className="w-4 h-4" />
      <span className="text-xs">{error}</span>
    </div>
  );
};

export default ApiKeyErrorDisplay;
