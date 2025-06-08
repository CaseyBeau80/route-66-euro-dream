
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Printer } from 'lucide-react';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import PDFContentRenderer from './PDFContentRenderer';

interface PDFPreviewContainerProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  exportOptions: any;
  shareUrl?: string;
  onClose: () => void;
  onPrint: () => void;
}

const PDFPreviewContainer: React.FC<PDFPreviewContainerProps> = ({
  tripPlan,
  tripStartDate,
  exportOptions,
  shareUrl,
  onClose,
  onPrint
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-4 pb-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 mb-4">
        {/* Preview Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-50">
          <h3 className="text-lg font-semibold text-blue-800">PDF Preview</h3>
          <div className="flex items-center gap-2">
            <Button
              onClick={onPrint}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print/Save as PDF
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* PDF Content in Preview */}
        <div className="max-h-[80vh] overflow-y-auto bg-gray-100 p-4">
          <div className="bg-white shadow-lg mx-auto" style={{ width: '8.5in', minHeight: '11in' }}>
            <PDFContentRenderer
              tripPlan={tripPlan}
              tripStartDate={tripStartDate}
              exportOptions={exportOptions}
              shareUrl={shareUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFPreviewContainer;
