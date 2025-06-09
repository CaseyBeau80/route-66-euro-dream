
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Printer } from 'lucide-react';
import { TripPlan } from '../services/planning/TripPlanBuilder';

interface ExportOptions {
  format: 'summary' | 'full';
  includeWeather: boolean;
  includeQRCode: boolean;
  title: string;
  watermark: string;
}

interface ExportActionsProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  shareUrl: string | null;
  exportOptions: ExportOptions;
  onExportToPDF: (tripPlan: TripPlan, tripStartDate?: Date, shareUrl?: string | null, exportOptions?: ExportOptions) => Promise<void>;
  onPrintTrip: (tripPlan: TripPlan, tripStartDate?: Date, shareUrl?: string | null, exportOptions?: ExportOptions) => Promise<void>;
  isExporting: boolean;
  isPrinting: boolean;
}

const ExportActions: React.FC<ExportActionsProps> = ({
  tripPlan,
  tripStartDate,
  shareUrl,
  exportOptions,
  onExportToPDF,
  onPrintTrip,
  isExporting,
  isPrinting
}) => {
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => onExportToPDF(tripPlan, tripStartDate, shareUrl, exportOptions)}
        disabled={isExporting}
        className="flex-1 bg-route66-primary hover:bg-route66-rust text-white"
      >
        <Download className="h-4 w-4 mr-2" />
        {isExporting ? 'Exporting...' : 'Export PDF'}
      </Button>
      
      <Button
        onClick={() => onPrintTrip(tripPlan, tripStartDate, shareUrl, exportOptions)}
        disabled={isPrinting}
        variant="outline"
        className="flex-1"
      >
        <Printer className="h-4 w-4 mr-2" />
        {isPrinting ? 'Preparing...' : 'Print'}
      </Button>
    </div>
  );
};

export default ExportActions;
