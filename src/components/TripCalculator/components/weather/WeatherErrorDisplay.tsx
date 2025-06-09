
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WeatherErrorDisplayProps {
  error: string;
  retryCount: number;
  segmentEndCity: string;
  onRetry: () => void;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const WeatherErrorDisplay: React.FC<WeatherErrorDisplayProps> = ({
  error,
  retryCount,
  segmentEndCity,
  onRetry,
  isSharedView = false,
  isPDFExport = false
}) => {
  return (
    <div className="flex items-center gap-2 p-3 bg-red-50 rounded border border-red-200">
      <AlertTriangle className="h-5 w-5 text-red-600" />
      <div className="flex-1 text-sm text-red-800">
        <p className="font-semibold">Weather unavailable for {segmentEndCity}</p>
        <p className="text-xs">{error}</p>
        {retryCount > 0 && (
          <p className="text-xs mt-1">Retry attempt: {retryCount}</p>
        )}
      </div>
      {!isSharedView && !isPDFExport && (
        <Button 
          onClick={onRetry} 
          size="sm" 
          variant="outline"
          className="text-xs h-7"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Retry
        </Button>
      )}
    </div>
  );
};

export default WeatherErrorDisplay;
