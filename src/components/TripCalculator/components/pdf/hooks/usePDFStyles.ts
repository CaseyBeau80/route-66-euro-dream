
import { useCallback } from 'react';
import { PDFRoute66ThemingService } from '../../../services/pdf/PDFRoute66ThemingService';

export const usePDFStyles = () => {
  const addPrintStyles = useCallback(() => {
    // Remove any existing PDF styles
    const existingStyles = document.getElementById('pdf-print-styles');
    if (existingStyles) {
      existingStyles.remove();
    }

    // Create new style element with Route 66 theming
    const styleSheet = document.createElement('style');
    styleSheet.id = 'pdf-print-styles';
    styleSheet.type = 'text/css';
    
    // Get enhanced Route 66 print styles
    const route66Styles = PDFRoute66ThemingService.generatePrintStyles();
    
    // Additional PDF-specific styles
    const additionalStyles = `
      @media print {
        @page {
          size: A4;
          margin: 0.75in;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.4;
          color: #1a1a1a;
        }
        
        .pdf-container {
          max-width: none !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        
        .pdf-day-card {
          margin-bottom: 1rem !important;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        .pdf-header {
          margin-bottom: 1.5rem !important;
        }
        
        .pdf-weather-section {
          border-left: 4px solid #C41E3A !important;
          padding-left: 1rem !important;
        }
        
        .pdf-stops-section {
          background-color: #FFF8DC !important;
        }
        
        /* Hide interactive elements */
        button, .cursor-pointer, .hover\\:bg-gray-100 {
          display: none !important;
        }
        
        /* Ensure text is readable */
        .text-white {
          color: white !important;
        }
        
        .bg-route66-primary {
          background-color: #C41E3A !important;
        }
        
        .bg-route66-vintage-beige {
          background-color: #F5F5DC !important;
        }
        
        .bg-route66-cream {
          background-color: #FFF8DC !important;
        }
        
        .text-route66-navy {
          color: #2C3E50 !important;
        }
        
        .text-route66-vintage-brown {
          color: #8B4513 !important;
        }
        
        .text-route66-vintage-red {
          color: #C41E3A !important;
        }
        
        .border-route66-border {
          border-color: #D1D5DB !important;
        }
        
        .border-route66-tan {
          border-color: #D2B48C !important;
        }
        
        .border-route66-vintage-brown {
          border-color: #8B4513 !important;
        }
      }
    `;
    
    styleSheet.innerHTML = route66Styles + additionalStyles;
    document.head.appendChild(styleSheet);
    
    console.log('✅ PDF print styles added with Route 66 theming');
  }, []);

  const removePrintStyles = useCallback(() => {
    const existingStyles = document.getElementById('pdf-print-styles');
    if (existingStyles) {
      existingStyles.remove();
      console.log('✅ PDF print styles removed');
    }
  }, []);

  return {
    addPrintStyles,
    removePrintStyles
  };
};
