
import ReactDOM from 'react-dom/client';
import React from 'react';
import PDFContentRenderer from '../PDFContentRenderer';
import { TripPlan } from '../../../services/planning/TripPlanBuilder';
import { usePDFWeatherPreloader } from './usePDFWeatherPreloader';

interface UsePDFContainerProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  exportOptions: any;
  shareUrl?: string;
}

export const usePDFContainer = () => {
  const { preloadWeatherData } = usePDFWeatherPreloader();

  const createPDFContainer = async ({
    tripPlan,
    tripStartDate,
    exportOptions,
    shareUrl
  }: UsePDFContainerProps) => {
    console.log('📄 Creating PDF container with enhanced weather integration...');
    
    // Clean up any existing PDF container
    let pdfContainer = document.getElementById('pdf-export-content');
    if (pdfContainer) {
      console.log('🧹 Removing existing PDF container');
      pdfContainer.remove();
    }

    // Step 1: Preload weather data for all segments
    console.log('🌤️ Preloading weather data for PDF export...');
    const weatherResult = await preloadWeatherData(tripPlan.segments || [], tripStartDate);
    
    if (weatherResult.weatherErrors.length > 0) {
      console.warn('⚠️ Some weather data failed to load:', weatherResult.weatherErrors);
    }

    // Update trip plan with enriched segments
    const enrichedTripPlan = {
      ...tripPlan,
      segments: weatherResult.enrichedSegments
    };
    
    // Create new PDF container - positioned for print visibility
    pdfContainer = document.createElement('div');
    pdfContainer.id = 'pdf-export-content';
    pdfContainer.className = 'pdf-container-ready';
    document.body.appendChild(pdfContainer);
    
    // Style container to be ready for both preview and print
    pdfContainer.style.cssText = `
      position: fixed;
      top: -10000px;
      left: 0;
      width: 8.5in;
      min-height: 11in;
      background: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      line-height: 1.4;
      color: #1f2937;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      overflow: visible;
      z-index: 9999;
    `;
    
    console.log('📄 PDF container created, rendering React content...');
    
    // Create React root and render content
    const root = ReactDOM.createRoot(pdfContainer);
    
    // Render content with enriched trip plan
    root.render(
      React.createElement(PDFContentRenderer, {
        tripPlan: enrichedTripPlan,
        tripStartDate,
        exportOptions,
        shareUrl
      })
    );
    
    console.log('📄 PDFContentRenderer rendered, waiting for content to stabilize...');
    
    // Wait for React to render and DOM to stabilize
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log('📄 Content check after render...');
        
        const hasContent = pdfContainer!.innerHTML.trim().length > 100;
        const segmentElements = pdfContainer!.querySelectorAll('.pdf-day-segment');
        
        console.log('📄 Content verification:', {
          hasContent,
          segmentCount: segmentElements.length,
          expectedSegments: enrichedTripPlan.segments?.length || 0,
          containerHTML: pdfContainer!.innerHTML.length
        });
        
        resolve();
      }, 1500);
    });

    console.log('✅ PDF container fully created and ready');
    return pdfContainer;
  };

  return { createPDFContainer };
};
