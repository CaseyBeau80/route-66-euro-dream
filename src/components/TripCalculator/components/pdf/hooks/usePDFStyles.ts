
export const usePDFStyles = () => {
  const addPrintStyles = () => {
    console.log('📄 Adding enhanced PDF print styles with container isolation...');
    
    // Remove any existing print styles
    const existingStyles = document.getElementById('pdf-print-styles');
    if (existingStyles) {
      existingStyles.remove();
    }

    // Create comprehensive print styles with container isolation
    const style = document.createElement('style');
    style.id = 'pdf-print-styles';
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      @keyframes fade-in-pdf {
        from { opacity: 0; transform: translate(-50%, -50%) translateY(-10px); }
        to { opacity: 1; transform: translate(-50%, -50%) translateY(0); }
      }

      @media print {
        @page {
          margin: 0.5in;
          size: letter;
        }
        
        /* Hide everything by default in print */
        body * {
          visibility: hidden !important;
        }
        
        /* Show only PDF container and its children */
        #pdf-export-content,
        #pdf-export-content * {
          visibility: visible !important;
        }
        
        /* Ensure PDF container takes full print space */
        #pdf-export-content {
          position: static !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          height: auto !important;
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          color: black !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
        
        /* Hide any overlay elements during print */
        .pdf-close-button-js,
        .pdf-loading-overlay-js,
        [role="dialog"],
        .fixed,
        .absolute {
          display: none !important;
          visibility: hidden !important;
        }
        
        /* Ensure proper print formatting */
        body {
          print-color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          background: white !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        .pdf-content {
          width: 100% !important;
          max-width: none !important;
          font-size: 12px !important;
          line-height: 1.4 !important;
        }
        
        .pdf-day-segment {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
          margin-bottom: 16px !important;
        }
        
        .no-page-break {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
        }
        
        h1, h2, h3, h4, h5, h6 {
          break-after: avoid !important;
          page-break-after: avoid !important;
          color: black !important;
        }
        
        /* Ensure weather cards print correctly */
        .weather-card,
        .pdf-weather-info {
          border: 1px solid #ccc !important;
          padding: 8px !important;
          margin-bottom: 8px !important;
          background: #f9f9f9 !important;
        }
        
        /* Print-friendly colors */
        .text-blue-600,
        .text-blue-700,
        .text-blue-800 {
          color: #1e3a8a !important;
        }
        
        .bg-blue-50,
        .bg-blue-100 {
          background: #f0f9ff !important;
        }
        
        .border-blue-200,
        .border-blue-300 {
          border-color: #93c5fd !important;
        }
      }
    `;
    
    document.head.appendChild(style);
    console.log('✅ Enhanced PDF print styles with container isolation added');
  };

  const removePrintStyles = () => {
    const styles = document.getElementById('pdf-print-styles');
    if (styles) {
      styles.remove();
      console.log('🧹 PDF print styles removed');
    }
  };

  return { addPrintStyles, removePrintStyles };
};
