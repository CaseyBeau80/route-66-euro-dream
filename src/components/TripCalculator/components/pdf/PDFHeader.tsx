
import React from 'react';
import { format } from 'date-fns';
import PDFLogo from './components/PDFLogo';

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
      <div className="pdf-header mb-8 border-b-2 border-route66-primary pb-4 relative">
        {/* Logo in top left */}
        <div className="absolute top-0 left-0">
          <PDFLogo />
        </div>
        
        {/* Centered content with left margin for logo */}
        <div className="text-center ml-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {tripTitle}
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            {startCity} → {endCity}
          </p>
          <p className="text-base text-gray-500">
            Generated on {format(new Date(), 'MMMM d, yyyy')}
          </p>
          
          {/* Ramble 66 branding */}
          <p className="text-sm text-route66-primary font-medium mt-2">
            Planned with Ramble 66 - Your Route 66 Adventure Starts Here
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
