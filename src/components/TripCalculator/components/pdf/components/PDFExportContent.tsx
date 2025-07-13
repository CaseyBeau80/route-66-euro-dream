import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface PDFExportContentProps {
  isTripComplete: boolean;
  isExporting: boolean;
  tripStartDate?: Date;
  onExport: () => void;
}

export const PDFExportContent: React.FC<PDFExportContentProps> = ({
  isTripComplete,
  isExporting,
  tripStartDate,
  onExport
}) => {
  if (!isTripComplete) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">
          <p className="text-lg font-medium">Trip Not Complete</p>
          <p className="text-sm mt-2">Please create a trip plan first before exporting to PDF.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center text-gray-600">
        <p className="text-sm">
          This will fetch live weather data and open your trip plan in a new window optimized for printing.
          You can then save it as a PDF using your browser's print dialog.
        </p>
        {tripStartDate && (
          <p className="text-xs mt-2 text-blue-600">
            🌤️ Weather forecasts will be included for each destination
          </p>
        )}
      </div>

      <Button
        onClick={onExport}
        disabled={isExporting || !isTripComplete}
        className="w-full bg-route66-primary hover:bg-route66-primary-dark text-white font-bold py-3 px-4 rounded transition-colors duration-200 text-sm sm:text-base font-route66 flex items-center justify-center gap-2"
      >
        <Printer className="w-4 h-4" />
        {isExporting ? 'Opening Print Window...' : 'Generate PDF with Weather'}
      </Button>
    </div>
  );
};