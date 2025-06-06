
import React from 'react';
import { format } from 'date-fns';

interface PDFHeaderProps {
  tripTitle: string;
  startCity: string;
  endCity: string;
  weatherLoading: boolean;
  weatherLoadingTimeout: boolean;
  watermark?: string;
}

const PDFHeader: React.FC<PDFHeaderProps> = ({
  tripTitle,
  startCity,
  endCity,
  weatherLoading,
  weatherLoadingTimeout,
  watermark
}) => {
  return (
    <>
      {/* PDF Header */}
      <div className="pdf-header mb-8 text-center border-b-2 border-blue-500 pb-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {tripTitle}
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          {startCity} → {endCity}
        </p>
        <p className="text-base text-gray-500">
          Generated on {format(new Date(), 'MMMM d, yyyy')}
        </p>
        
        {/* Weather Loading Status */}
        {weatherLoading && (
          <p className="text-sm text-blue-600 mt-2">
            ⏳ Loading weather data... (this may take up to 10 seconds)
          </p>
        )}
        {weatherLoadingTimeout && (
          <p className="text-sm text-orange-600 mt-2">
            ⚠️ Weather data loading timed out - using seasonal fallbacks
          </p>
        )}
      </div>

      {/* Watermark */}
      {watermark && (
        <div className="pdf-watermark-text fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 text-8xl text-gray-100 font-bold pointer-events-none z-0">
          {watermark}
        </div>
      )}
    </>
  );
};

export default PDFHeader;
