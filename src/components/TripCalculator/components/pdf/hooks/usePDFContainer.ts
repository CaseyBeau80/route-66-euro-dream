
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
    console.log('📄 Creating PDF container with weather integration...');
    console.log('📄 Trip validation:', {
      tripPlanExists: !!tripPlan,
      hasSegments: !!(tripPlan.segments && tripPlan.segments.length > 0),
      segmentsCount: tripPlan.segments?.length || 0,
      tripStartDate: tripStartDate?.toISOString(),
      exportFormat: exportOptions.format
    });
    
    // Clean up any existing PDF container
    let pdfContainer = document.getElementById('pdf-export-content');
    if (pdfContainer) {
      console.log('🧹 Removing existing PDF container');
      pdfContainer.remove();
    }
    
    // Create new PDF container with proper styling
    pdfContainer = document.createElement('div');
    pdfContainer.id = 'pdf-export-content';
    pdfContainer.className = 'pdf-container-ready';
    document.body.appendChild(pdfContainer);
    
    // Set up container for PDF rendering with proper dimensions
    pdfContainer.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: 8.5in;
      min-height: 11in;
      background: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      color: #1f2937;
      padding: 40px;
      margin: 0;
      overflow: visible;
      box-sizing: border-box;
    `;
    
    console.log('📄 PDF container created, rendering React content...');
    
    // Create React root and render content
    const root = ReactDOM.createRoot(pdfContainer);
    
    // Render content immediately
    root.render(
      React.createElement(PDFContentRenderer, {
        tripPlan,
        tripStartDate,
        exportOptions,
        shareUrl
      })
    );
    
    console.log('📄 PDFContentRenderer rendered, waiting for content to stabilize...');
    
    // Wait for React to render and DOM to stabilize
    await new Promise<void>((resolve) => {
      // Give React time to render
      setTimeout(() => {
        console.log('📄 Initial render complete, checking for content...');
        
        // Verify content was rendered
        const hasContent = pdfContainer!.innerHTML.trim().length > 100;
        const segmentElements = pdfContainer!.querySelectorAll('.pdf-day-segment');
        
        console.log('📄 Content verification:', {
          hasContent,
          segmentCount: segmentElements.length,
          expectedSegments: tripPlan.segments?.length || 0,
          containerInnerHTML: pdfContainer!.innerHTML.length
        });
        
        if (!hasContent) {
          console.warn('⚠️ PDF container appears to be empty, but proceeding...');
        }
        
        resolve();
      }, 1500); // Give more time for weather data to load
    });

    console.log('✅ PDF container fully created with content');
    return pdfContainer;
  };

  return { createPDFContainer };
};
