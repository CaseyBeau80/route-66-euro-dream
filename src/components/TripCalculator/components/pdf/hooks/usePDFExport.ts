
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { TripPlan } from '../../../services/planning/TripPlanBuilder';
import PDFContentRenderer from '../PDFContentRenderer';
import ReactDOM from 'react-dom/client';

interface UsePDFExportProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  shareUrl?: string;
  exportOptions: any;
  onClose: () => void;
}

export const usePDFExport = ({
  tripPlan,
  tripStartDate,
  shareUrl,
  exportOptions,
  onClose
}: UsePDFExportProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const handleClosePreview = () => {
    console.log('🔄 Closing PDF preview and restoring UI...');
    setShowPreview(false);
    
    // Restore original content
    const originalChildren = Array.from(document.body.children);
    originalChildren.forEach(child => {
      if (child.id !== 'pdf-export-content') {
        (child as HTMLElement).style.display = '';
      }
    });
    
    // Hide PDF content and remove scaling
    const pdfContainer = document.getElementById('pdf-export-content');
    if (pdfContainer) {
      pdfContainer.classList.remove('pdf-preview-visible');
      pdfContainer.style.cssText = `
        position: absolute;
        left: -9999px;
        top: -9999px;
        visibility: hidden;
      `;
    }
    
    // Remove print styles
    const printStyles = document.getElementById('pdf-print-styles');
    if (printStyles) {
      printStyles.remove();
    }
    
    toast({
      title: "PDF Preview Closed",
      description: "Returned to normal view",
      variant: "default"
    });
  };

  const handleExportPDF = async () => {
    console.log('🖨️ Starting enhanced PDF export with improved readability...');
    setIsExporting(true);
    setWeatherLoading(true);
    
    try {
      // Step 1: Close modal first and wait for it to fully close
      onClose();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 2: Show weather loading toast
      toast({
        title: "Preparing PDF",
        description: "Loading weather data and formatting content for enhanced readability...",
        variant: "default"
      });
      
      console.log('📄 Creating PDF content with enhanced scaling and typography...');
      
      // Step 3: Create a clean PDF container
      let pdfContainer = document.getElementById('pdf-export-content');
      if (!pdfContainer) {
        pdfContainer = document.createElement('div');
        pdfContainer.id = 'pdf-export-content';
        document.body.appendChild(pdfContainer);
      }
      
      // Step 4: Style the container for PDF with enhanced scaling
      pdfContainer.style.cssText = `
        position: absolute;
        left: -9999px;
        top: -9999px;
        width: 100%;
        background: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        color: #1f2937;
        padding: 0;
        margin: 0;
      `;
      
      // Step 5: Render PDFContentRenderer with timeout
      const root = ReactDOM.createRoot(pdfContainer);
      
      await new Promise<void>((resolve) => {
        root.render(
          React.createElement(PDFContentRenderer, {
            tripPlan,
            tripStartDate,
            exportOptions,
            shareUrl
          })
        );
        
        // Wait for React to render and weather to load
        setTimeout(() => {
          setWeatherLoading(false);
          console.log('✅ PDF content rendered with enhanced typography and weather data');
          resolve();
        }, 3000); // Give weather API time to load
      });
      
      // Step 6: Add enhanced print styles with close button
      const printStyleId = 'pdf-print-styles';
      let printStyles = document.getElementById(printStyleId);
      if (!printStyles) {
        printStyles = document.createElement('style');
        printStyles.id = printStyleId;
        document.head.appendChild(printStyles);
      }
      
      printStyles.textContent = `
        @media screen {
          .pdf-close-button {
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 10000 !important;
            background: #dc2626 !important;
            color: white !important;
            border: none !important;
            padding: 12px 20px !important;
            border-radius: 6px !important;
            font-weight: bold !important;
            cursor: pointer !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
            font-size: 14px !important;
          }
          
          .pdf-close-button:hover {
            background: #b91c1c !important;
          }
          
          .pdf-instructions {
            position: fixed !important;
            top: 80px !important;
            right: 20px !important;
            z-index: 9999 !important;
            background: rgba(0,0,0,0.8) !important;
            color: white !important;
            padding: 12px !important;
            border-radius: 6px !important;
            font-size: 12px !important;
            max-width: 200px !important;
          }

          #pdf-export-content.pdf-preview-visible {
            transform: scale(1.1) !important;
            transform-origin: top center !important;
            margin: 20px auto !important;
            padding: 40px !important;
            max-width: none !important;
            width: calc(100% - 80px) !important;
          }
        }
        
        @media print {
          .pdf-close-button,
          .pdf-instructions {
            display: none !important;
          }
          
          @page {
            size: A4;
            margin: 0.5in;
          }
          
          body * {
            visibility: hidden;
          }
          
          #pdf-export-content,
          #pdf-export-content * {
            visibility: visible !important;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.5;
            color: #1f2937 !important;
            background: white !important;
            font-size: 14px !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          #pdf-export-content {
            position: static !important;
            left: auto !important;
            top: auto !important;
            visibility: visible !important;
            width: 100% !important;
            background: white !important;
            padding: 0.6in !important;
            margin: 0 !important;
            transform: none !important;
          }
          
          .pdf-clean-container {
            width: 100% !important;
            max-width: none !important;
            background: white !important;
            color: #1f2937 !important;
            font-family: inherit !important;
            font-size: 14px !important;
            line-height: 1.5 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          .pdf-day-segment,
          .no-page-break {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          .bg-gray-50 {
            background-color: #f9fafb !important;
            border: 1px solid #e5e7eb !important;
          }
          
          .border {
            border: 1px solid #e5e7eb !important;
          }
          
          .rounded,
          .rounded-lg {
            border-radius: 8px !important;
          }
          
          .text-blue-600 { color: #2563eb !important; }
          .text-blue-800 { color: #1e40af !important; }
          .text-gray-800 { color: #1f2937 !important; }
          .text-gray-700 { color: #374151 !important; }
          .text-gray-600 { color: #4b5563 !important; }
          .text-gray-500 { color: #6b7280 !important; }
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `;
      
      // Step 7: Add close button and instructions to PDF container
      const closeButton = document.createElement('button');
      closeButton.className = 'pdf-close-button';
      closeButton.innerHTML = '✕ Close PDF Preview';
      closeButton.onclick = handleClosePreview;
      
      const instructions = document.createElement('div');
      instructions.className = 'pdf-instructions';
      instructions.innerHTML = `
        <div><strong>Enhanced PDF Preview</strong></div>
        <div>• 110% scaled for readability</div>
        <div>• Press ESC to close</div>
        <div>• Use Ctrl+P to print</div>
        <div>• Click close button to exit</div>
      `;
      
      pdfContainer.appendChild(closeButton);
      pdfContainer.appendChild(instructions);
      
      // Step 8: Make PDF container visible with enhanced scaling
      setShowPreview(true);
      pdfContainer.classList.add('pdf-preview-visible');
      pdfContainer.style.cssText = `
        position: static;
        left: auto;
        top: auto;
        width: 100%;
        background: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        color: #1f2937;
        padding: 0;
        margin: 0;
      `;
      
      // Hide all other content
      const originalChildren = Array.from(document.body.children);
      originalChildren.forEach(child => {
        if (child.id !== 'pdf-export-content') {
          (child as HTMLElement).style.display = 'none';
        }
      });
      
      // Add automatic timeout
      setTimeout(() => {
        if (showPreview) {
          console.log('⏰ Auto-closing PDF preview after 60 seconds');
          handleClosePreview();
        }
      }, 60000);
      
      console.log('🖨️ Enhanced PDF preview ready with 110% scaling and improved typography.');
      
      toast({
        title: "Enhanced PDF Preview Ready",
        description: "Scaled to 110% for better readability. Press Ctrl+P to print, ESC to close.",
        variant: "default"
      });
      
    } catch (error) {
      console.error('❌ PDF export failed:', error);
      handleClosePreview();
      toast({
        title: "PDF Export Failed",
        description: "Could not generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
      setWeatherLoading(false);
    }
  };

  return {
    isExporting,
    showPreview,
    weatherLoading,
    handleClosePreview,
    handleExportPDF
  };
};
