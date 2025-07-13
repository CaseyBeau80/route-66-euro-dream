
import React, { useEffect } from 'react';
import { X, Printer, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PDFContentRenderer from './PDFContentRenderer';
import { TripPlan } from '../../services/planning/TripPlanBuilder';

interface PDFPreviewContainerProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  exportOptions: any;
  shareUrl?: string;
  weatherTimeout?: boolean;
  onClose: () => void;
  onPrint: () => void;
}

const PDFPreviewContainer: React.FC<PDFPreviewContainerProps> = ({
  tripPlan,
  tripStartDate,
  exportOptions,
  shareUrl,
  weatherTimeout = false,
  onClose,
  onPrint
}) => {
  useEffect(() => {
    // Disable body scroll when preview is open
    document.body.style.overflow = 'hidden';
    console.log('🔒 PDFPreviewContainer: Scroll locked for preview');
    
    return () => {
      // Simple, guaranteed scroll unlock on unmount
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.position = '';
      document.body.removeAttribute('data-scroll-locked');
      console.log('🧹 PDFPreviewContainer: Scroll unlocked on cleanup');
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-[10000] bg-black bg-opacity-50 flex items-center justify-center"
      onClick={(e) => {
        // Close on backdrop click with scroll cleanup
        if (e.target === e.currentTarget) {
          console.log('🔄 PDF Preview backdrop clicked');
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.top = '';
          document.documentElement.style.overflow = '';
          document.documentElement.style.position = '';
          document.body.removeAttribute('data-scroll-locked');
          onClose();
        }
      }}
    >
      <div className="w-full h-full max-w-6xl bg-white rounded-lg shadow-2xl flex flex-col">
        {/* Enhanced Preview Header */}
        <div className="flex items-center justify-between p-4 border-b bg-route66-primary text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full p-2">
              <Printer className="w-5 h-5 text-route66-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-route66">PDF Preview</h2>
              <p className="text-sm text-route66-cream font-travel">
                Review your Route 66 itinerary before printing
              </p>
              {weatherTimeout && (
                <div className="flex items-center gap-1 text-xs text-route66-vintage-yellow mt-1">
                  <AlertTriangle className="w-3 h-3" />
                  Weather timeout - using seasonal estimates
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={onPrint}
              className="bg-route66-accent-gold hover:bg-route66-vintage-yellow text-route66-navy font-semibold"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print / Save PDF
            </Button>
            <Button
              onClick={() => {
                console.log('🔄 PDF Preview close button clicked');
                // Force scroll unlock before closing
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.top = '';
                document.documentElement.style.overflow = '';
                document.documentElement.style.position = '';
                document.body.removeAttribute('data-scroll-locked');
                onClose();
              }}
              variant="ghost"
              className="text-white hover:bg-route66-primary-dark"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* PDF Content Preview */}
        <div 
          id="pdf-export-content"
          className="flex-1 overflow-auto bg-gray-100 p-4"
        >
          <div className="max-w-4xl mx-auto">
            <PDFContentRenderer
              tripPlan={tripPlan}
              tripStartDate={tripStartDate}
              exportOptions={exportOptions}
              shareUrl={shareUrl}
            />
          </div>
        </div>

        {/* Preview Footer with Instructions */}
        <div className="p-4 border-t bg-route66-vintage-beige">
          <div className="text-center">
            <p className="text-sm text-route66-vintage-brown mb-2 font-travel">
              <strong>📋 Printing Instructions:</strong> Click "Print / Save PDF" above, then choose "Save as PDF" in your browser's print dialog
            </p>
            <div className="flex justify-center gap-4 text-xs text-route66-navy">
              <span>🖨️ Optimized for Letter size (8.5" x 11")</span>
              <span>🎨 Enhanced Route 66 branding included</span>
              <span>{weatherTimeout ? '📊 Seasonal weather estimates' : '🌤️ Live weather data integrated'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFPreviewContainer;
