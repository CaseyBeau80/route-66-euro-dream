
import React, { useEffect } from 'react';
import { X, Printer } from 'lucide-react';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import { usePDFExportOptions } from '../../hooks/usePDFExportOptions';
import { usePDFExportSimple } from './hooks/usePDFExportSimple';
import { PDFExportContent } from './components/PDFExportContent';

interface EnhancedPDFExportProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  shareUrl?: string;
  isOpen: boolean;
  onClose: () => void;
}

const EnhancedPDFExport: React.FC<EnhancedPDFExportProps> = ({
  tripPlan,
  tripStartDate,
  shareUrl,
  isOpen,
  onClose
}) => {
  const { exportOptions } = usePDFExportOptions();
  
  const { isExporting, isTripComplete, handleExportPDF } = usePDFExportSimple({
    tripPlan,
    tripStartDate,
    shareUrl,
    exportOptions,
    onClose
  });

  // Enhanced interaction prevention and scroll lock
  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.setAttribute('data-scroll-locked', 'true');

    // Prevent all keyboard interactions except specific keys
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow only Tab, Shift+Tab, Enter, and Space for accessibility
      const allowedKeys = ['Tab', 'Enter', ' '];
      const isAllowed = allowedKeys.includes(e.key) || 
                       (e.key === 'Tab' && (e.shiftKey || !e.shiftKey));
      
      if (!isAllowed) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Prevent context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('contextmenu', handleContextMenu, true);

    // Cleanup function
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.width = '';
      document.body.removeAttribute('data-scroll-locked');
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  // Handle overlay click (only close via X button)
  const handleOverlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Don't close - user must use X button
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Enhanced full-screen overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      
      {/* Modal container */}
      <div className="relative z-10 w-full max-w-lg mx-4">
        {/* Modal content */}
        <div className="bg-background border border-border shadow-2xl rounded-xl p-6 animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Printer className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Print Trip Plan
              </h2>
            </div>
            
            {/* Close button - only way to close */}
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors duration-200"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <PDFExportContent
            isTripComplete={isTripComplete}
            isExporting={isExporting}
            tripStartDate={tripStartDate}
            onExport={handleExportPDF}
          />

          {/* Subtle close instruction */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground opacity-70">
              Click the ❌ to close this window
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPDFExport;
