
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
    console.log('📄 Creating PDF content with enhanced scaling and typography...');
    
    // Create a clean PDF container
    let pdfContainer = document.getElementById('pdf-export-content');
    if (!pdfContainer) {
      pdfContainer = document.createElement('div');
      pdfContainer.id = 'pdf-export-content';
      document.body.appendChild(pdfContainer);
    }
    
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
    
    // Render PDFContentRenderer
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
        console.log('✅ PDF content rendered with enhanced typography and weather data');
        resolve();
      }, 3000); // Give weather API time to load
    });

    return pdfContainer;
  };

  return { createPDFContainer };
};
