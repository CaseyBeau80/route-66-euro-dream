
import React from 'react';
import { format } from 'date-fns';
import { DailySegment } from '../../services/planning/TripPlanBuilder';

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
  return (
    <>
      {/* QR Code Section */}
      {includeQRCode && shareUrl && (
        <div className="pdf-qr-section mt-8 p-4 bg-gray-50 rounded border text-center">
          <h3 className="text-base font-semibold text-gray-700 mb-2">View Live Version</h3>
          <p className="text-sm text-gray-600 mb-2">Scan QR code or visit:</p>
          <p className="text-sm text-blue-600 break-all">{shareUrl}</p>
          <p className="text-xs text-gray-500 mt-2">
            Plan your own Route 66 adventure at www.ramble66.com
          </p>
        </div>
      )}

      {/* PDF Footer */}
      <div className="pdf-footer mt-8 pt-4 border-t border-gray-200 text-center">
        <div className="mb-2">
          <strong className="text-route66-primary text-sm">RAMBLE 66</strong>
          <span className="text-xs text-gray-500 ml-2">Route 66 Trip Planner</span>
        </div>
        
        <p className="text-xs text-gray-500 mb-1">
          Generated on {format(new Date(), 'MMMM d, yyyy')}
        </p>
        
        <p className="text-xs text-gray-500 mb-2">
          Weather data: {enrichedSegments.filter(s => s.weather || s.weatherData).length} of {enrichedSegments.length} segments loaded
        </p>
        
        <div className="text-xs">
          <span className="text-gray-500">Plan your next adventure at </span>
          <a 
            href="https://www.ramble66.com" 
            className="text-route66-primary font-medium hover:underline"
            target="_blank" 
            rel="noopener noreferrer"
          >
            www.ramble66.com
          </a>
        </div>
        
        {shareUrl && (
          <p className="text-xs text-gray-400 mt-2 break-all">
            Live version: {shareUrl}
          </p>
        )}
      </div>
    </>
  );
};

export default PDFFooter;
