
import React from 'react';
import { format } from 'date-fns';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import RambleBranding from '../../../shared/RambleBranding';

interface PDFFooterProps {
  shareUrl?: string;
  enrichedSegments: DailySegment[];
  includeQRCode: boolean;
}

const PDFFooter: React.FC<PDFFooterProps> = ({
  shareUrl,
  enrichedSegments,
  includeQRCode
}) => {
  const weatherSegmentsCount = enrichedSegments.filter(s => s.weather || s.weatherData).length;
  const forecastSegmentsCount = enrichedSegments.filter(s => 
    (s.weather?.isActualForecast) || (s.weatherData?.isActualForecast)
  ).length;

  return (
    <>
      {/* QR Code Section with Enhanced Styling */}
      {includeQRCode && shareUrl && (
        <div className="pdf-qr-section mt-8 p-6 bg-gradient-to-r from-route66-cream to-route66-vintage-beige rounded-lg border-2 border-route66-vintage-brown text-center">
          <div className="flex justify-center mb-4">
            <RambleBranding variant="logo" size="md" />
          </div>
          <h3 className="text-lg font-bold text-route66-vintage-red mb-2 font-route66">
            VIEW LIVE VERSION
          </h3>
          <p className="text-sm text-route66-vintage-brown mb-3 font-travel">
            Scan QR code or visit the link below for interactive features:
          </p>
          <div className="p-3 bg-white rounded border border-route66-tan mb-3">
            <p className="text-sm text-route66-primary break-all font-medium">{shareUrl}</p>
          </div>
          <p className="text-xs text-route66-navy">
            🛣️ Plan your own Route 66 adventure at <strong>www.ramble66.com</strong>
          </p>
        </div>
      )}

      {/* Enhanced PDF Footer */}
      <div className="pdf-footer mt-8 pt-6 border-t-2 border-route66-primary text-center">
        {/* Main Branding */}
        <div className="flex justify-center mb-4">
          <RambleBranding variant="full" size="md" />
        </div>
        
        {/* Generation Information */}
        <div className="mb-4 p-4 bg-route66-vintage-beige rounded border border-route66-tan">
          <p className="text-sm text-route66-vintage-brown mb-2 font-travel">
            <strong>Generated:</strong> {format(new Date(), 'MMMM d, yyyy')} at {format(new Date(), 'h:mm a')}
          </p>
          
          {/* Weather Data Summary */}
          <div className="text-xs text-route66-navy">
            <div className="mb-1">
              <strong>Weather Information:</strong> {weatherSegmentsCount} of {enrichedSegments.length} segments include weather data
            </div>
            <div className="flex justify-center gap-4 text-xs">
              <span>📡 Live Forecasts: {forecastSegmentsCount}</span>
              <span>📊 Historical Data: {weatherSegmentsCount - forecastSegmentsCount}</span>
            </div>
          </div>
        </div>
        
        {/* Website Promotion */}
        <div className="text-sm">
          <span className="text-route66-vintage-brown font-travel">Ready for your next adventure? Visit </span>
          <a 
            href="https://www.ramble66.com" 
            className="text-route66-primary font-bold hover:underline font-route66"
            target="_blank" 
            rel="noopener noreferrer"
          >
            www.ramble66.com
          </a>
          <span className="text-route66-vintage-brown font-travel"> to plan another Route 66 journey!</span>
        </div>
        
        {/* Live Version Link */}
        {shareUrl && (
          <div className="mt-3 p-2 bg-gray-50 rounded border">
            <p className="text-xs text-gray-500">
              <strong>Live Interactive Version:</strong>
            </p>
            <p className="text-xs text-gray-400 break-all mt-1">{shareUrl}</p>
          </div>
        )}
        
        {/* Copyright */}
        <div className="mt-4 text-xs text-gray-400 border-t border-gray-200 pt-2">
          © {new Date().getFullYear()} Ramble 66. Your Route 66 Adventure Starts Here.
        </div>
      </div>
    </>
  );
};

export default PDFFooter;
