
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
    console.log('📄 Creating enhanced PDF container with weather data validation...');
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
    
    // Create new PDF container with enhanced setup
    pdfContainer = document.createElement('div');
    pdfContainer.id = 'pdf-export-content';
    pdfContainer.className = 'pdf-container-enhanced';
    document.body.appendChild(pdfContainer);
    
    // Initially hide the container
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
      padding: 0;
      margin: 0;
      overflow: visible;
    `;
    
    console.log('📄 PDF container created, rendering React content...');
    
    // Create React root and render content
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
      
      console.log('📄 PDFContentRenderer rendered, waiting for weather data...');
      
      // Enhanced waiting strategy for weather data
      const checkWeatherData = (attempt = 1) => {
        const maxAttempts = 10;
        const weatherElements = pdfContainer!.querySelectorAll('[data-weather-loaded]');
        const totalSegments = tripPlan.segments?.length || 0;
        
        console.log(`🌤️ Weather check attempt ${attempt}/${maxAttempts}:`, {
          weatherElementsFound: weatherElements.length,
          totalSegments,
          containerHasContent: !!pdfContainer!.innerHTML
        });
        
        if (attempt >= maxAttempts || weatherElements.length >= totalSegments * 0.5) {
          console.log('✅ Weather data loading completed or timed out');
          resolve();
        } else {
          setTimeout(() => checkWeatherData(attempt + 1), 500);
        }
      };
      
      // Start weather data check after initial render
      setTimeout(() => checkWeatherData(), 1000);
    });

    console.log('✅ PDF container fully created with content and weather data');
    return pdfContainer;
  };

  return { createPDFContainer };
};
