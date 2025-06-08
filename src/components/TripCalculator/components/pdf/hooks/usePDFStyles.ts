
export const usePDFStyles = () => {
  const addPrintStyles = () => {
    console.log('📄 Adding enhanced PDF print styles...');
    
    const existingStyles = document.getElementById('pdf-print-styles');
    if (existingStyles) {
      existingStyles.remove();
    }

    const style = document.createElement('style');
    style.id = 'pdf-print-styles';
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      @media print {
        @page {
          margin: 0.75in;
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
        
        /* Ensure PDF container is visible and positioned correctly during print */
        #pdf-export-content {
          position: static !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          height: auto !important;
          margin: 0 !important;
          padding: 20px !important;
          background: white !important;
          color: black !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          box-sizing: border-box !important;
          transform: none !important;
          opacity: 1 !important;
          pointer-events: auto !important;
          z-index: auto !important;
        }
        
        /* Hide UI elements during print */
        .pdf-close-button-js,
        .pdf-loading-overlay-js,
        [role="dialog"],
        .fixed,
        .absolute,
        nav,
        header,
        footer:not(.pdf-footer),
        .sidebar,
        .modal {
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
        
        /* PDF content styling */
        .pdf-content {
          width: 100% !important;
          max-width: none !important;
          font-size: 12px !important;
          line-height: 1.4 !important;
        }
        
        /* Page break controls */
        .pdf-day-segment {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
          margin-bottom: 20px !important;
          padding: 16px !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 8px !important;
          background: white !important;
        }
        
        .no-page-break,
        .pdf-header,
        .pdf-trip-overview,
        .pdf-weather-section,
        .pdf-weather-info {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
        }
        
        /* Header styling */
        .pdf-header {
          text-align: center !important;
          margin-bottom: 30px !important;
          padding-bottom: 20px !important;
          border-bottom: 2px solid #3b82f6 !important;
        }
        
        .pdf-header h1 {
          font-size: 24px !important;
          font-weight: bold !important;
          color: #1f2937 !important;
          margin-bottom: 8px !important;
        }
        
        /* Trip overview grid */
        .pdf-trip-overview {
          display: grid !important;
          grid-template-columns: repeat(4, 1fr) !important;
          gap: 16px !important;
          margin-bottom: 30px !important;
        }
        
        .pdf-overview-card {
          text-align: center !important;
          padding: 12px !important;
          border: 1px solid #d1d5db !important;
          border-radius: 6px !important;
          background: #f9fafb !important;
        }
        
        /* Weather styling */
        .pdf-weather-section,
        .pdf-weather-info {
          background: #f0f9ff !important;
          border: 1px solid #bfdbfe !important;
          border-radius: 6px !important;
          padding: 12px !important;
          margin: 8px 0 !important;
        }
        
        /* Color adjustments for print */
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
        
        /* Typography */
        h1, h2, h3, h4, h5, h6 {
          break-after: avoid !important;
          page-break-after: avoid !important;
          color: black !important;
        }
        
        /* Footer */
        .pdf-footer {
          margin-top: 30px !important;
          padding-top: 20px !important;
          border-top: 1px solid #e5e7eb !important;
          text-align: center !important;
          font-size: 10px !important;
          color: #6b7280 !important;
        }
      }
    `;
    
    document.head.appendChild(style);
    console.log('✅ Enhanced PDF print styles added');
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
