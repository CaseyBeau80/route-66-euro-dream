import React from 'react';
import { Camera, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhotoUploadCounterProps {
  uploadCount: number;
  maxPhotos: number;
  className?: string;
}

export const PhotoUploadCounter: React.FC<PhotoUploadCounterProps> = ({
  uploadCount,
  maxPhotos,
  className
}) => {
  const isAtLimit = uploadCount >= maxPhotos;
  const isNearLimit = uploadCount >= maxPhotos - 1;

  return (
    <div className={cn(
      "flex items-center justify-center gap-2 p-3 rounded-lg border transition-all duration-200",
      isAtLimit && "bg-red-50 border-red-200",
      isNearLimit && !isAtLimit && "bg-yellow-50 border-yellow-200",
      !isNearLimit && "bg-blue-50 border-blue-200",
      className
    )}>
      <div className="flex items-center gap-2">
        {isAtLimit ? (
          <AlertTriangle className="w-4 h-4 text-red-600" />
        ) : uploadCount > 0 ? (
          <CheckCircle className="w-4 h-4 text-green-600" />
        ) : (
          <Camera className="w-4 h-4 text-blue-600" />
        )}
        
        <span className={cn(
          "font-medium text-sm",
          isAtLimit && "text-red-800",
          isNearLimit && !isAtLimit && "text-yellow-800",
          !isNearLimit && "text-blue-800"
        )}>
          {uploadCount} of {maxPhotos} photos uploaded
        </span>
      </div>

      {isAtLimit && (
        <div className="ml-2 text-xs text-red-600 font-medium">
          • Limit reached
        </div>
      )}
      
      {isNearLimit && !isAtLimit && (
        <div className="ml-2 text-xs text-yellow-600 font-medium">
          • {maxPhotos - uploadCount} remaining
        </div>
      )}
    </div>
  );
};