
import ReactDOM from 'react-dom/client';
import React from 'react';
import PDFContentRenderer from '../PDFContentRenderer';
import { TripPlan } from '../../../services/planning/TripPlanBuilder';

interface UsePDFContainerProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  exportOptions: any;
  shareUrl?: string;
}

export const usePDFContainer = () => {
  const createPDFContainer = async ({
    tripPlan,
    tripStartDate,
    exportOptions,
    shareUrl
  }: UsePDFContainerProps) => {
    console.log('📄 createPDFContainer: Starting PDF content creation with enhanced logging...');
    console.log('📄 Trip data validation:', {
      tripPlanExists: !!tripPlan,
      hasSegments: !!(tripPlan.segments && tripPlan.segments.length > 0),
      segmentsCount: tripPlan.segments?.length || 0,
      startCity: tripPlan.startCity,
      endCity: tripPlan.endCity,
      totalDays: tripPlan.totalDays,
      exportFormat: exportOptions.format
    });
    
    // Create a clean PDF container
    let pdfContainer = document.getElementById('pdf-export-content');
    if (pdfContainer) {
      console.log('📄 Removing existing PDF container');
      pdfContainer.remove();
    }
    
    pdfContainer = document.createElement('div');
    pdfContainer.id = 'pdf-export-content';
    document.body.appendChild(pdfContainer);
    
    console.log('📄 Created new PDF container element');
    
    // Style the container for PDF with enhanced scaling
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
    
    console.log('📄 Applied container styles');
    
    // Render PDFContentRenderer
    const root = ReactDOM.createRoot(pdfContainer);
    
    console.log('📄 Creating React root and rendering PDFContentRenderer...');
    
    await new Promise<void>((resolve) => {
      root.render(
        React.createElement(PDFContentRenderer, {
          tripPlan,
          tripStartDate,
          exportOptions,
          shareUrl
        })
      );
      
      console.log('📄 PDFContentRenderer rendered, waiting for completion...');
      
      // Wait for React to render and weather to load
      setTimeout(() => {
        console.log('✅ PDF content rendering completed with enhanced typography and weather data');
        console.log('📄 Final container verification:', {
          containerExists: !!document.getElementById('pdf-export-content'),
          containerHasContent: !!pdfContainer?.innerHTML,
          contentLength: pdfContainer?.innerHTML?.length || 0
        });
        resolve();
      }, 3000); // Give weather API time to load
    });

    return pdfContainer;
  };

  return { createPDFContainer };
};
