
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
        
        /* Reset everything and show only PDF content */
        * {
          visibility: hidden !important;
          print-color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
        }
        
        /* Make PDF container and all children visible */
        #pdf-export-content,
        #pdf-export-content *,
        #pdf-export-content *::before,
        #pdf-export-content *::after {
          visibility: visible !important;
        }
        
        /* Position PDF container for print */
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
          box-sizing: border-box !important;
          transform: none !important;
          opacity: 1 !important;
          pointer-events: auto !important;
          z-index: auto !important;
          overflow: visible !important;
        }
        
        /* Hide non-PDF elements */
        body > *:not(#pdf-export-content) {
          display: none !important;
        }
        
        /* PDF content styling */
        .pdf-content {
          width: 100% !important;
          max-width: none !important;
          font-size: 11px !important;
          line-height: 1.3 !important;
          padding: 20px !important;
          background: white !important;
        }
        
        /* Header styling */
        .pdf-header {
          text-align: center !important;
          margin-bottom: 24px !important;
          padding-bottom: 16px !important;
          border-bottom: 2px solid #3b82f6 !important;
          page-break-inside: avoid !important;
        }
        
        .pdf-header h1 {
          font-size: 20px !important;
          font-weight: bold !important;
          color: #1e3a8a !important;
          margin: 8px 0 !important;
        }
        
        /* Logo styling */
        .pdf-logo {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          margin-bottom: 16px !important;
        }
        
        .ramble-66-text-logo {
          text-align: center !important;
        }
        
        /* Trip overview */
        .pdf-trip-overview {
          display: block !important;
          margin-bottom: 24px !important;
          padding: 16px !important;
          background: #f8fafc !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 8px !important;
          page-break-inside: avoid !important;
        }
        
        .pdf-overview-card {
          display: inline-block !important;
          width: 23% !important;
          margin: 1% !important;
          text-align: center !important;
          padding: 8px !important;
          border: 1px solid #d1d5db !important;
          border-radius: 4px !important;
          background: white !important;
          vertical-align: top !important;
        }
        
        /* Day segments */
        .pdf-day-segment {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
          margin-bottom: 16px !important;
          padding: 12px !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 6px !important;
          background: white !important;
        }
        
        /* Weather sections */
        .pdf-weather-section,
        .pdf-weather-info {
          background: #f0f9ff !important;
          border: 1px solid #bfdbfe !important;
          border-radius: 4px !important;
          padding: 8px !important;
          margin: 6px 0 !important;
          page-break-inside: avoid !important;
        }
        
        /* Footer */
        .pdf-footer {
          margin-top: 24px !important;
          padding-top: 16px !important;
          border-top: 1px solid #e5e7eb !important;
          text-align: center !important;
          font-size: 9px !important;
          color: #6b7280 !important;
          page-break-inside: avoid !important;
        }
        
        .pdf-footer a {
          color: #2563eb !important;
          text-decoration: underline !important;
        }
        
        /* Typography fixes */
        h1, h2, h3, h4, h5, h6 {
          break-after: avoid !important;
          page-break-after: avoid !important;
          color: #1e3a8a !important;
          margin: 8px 0 !important;
        }
        
        /* Color corrections */
        .text-blue-600,
        .text-blue-700,
        .text-blue-800 {
          color: #1e3a8a !important;
        }
        
        .bg-blue-50 {
          background: #f0f9ff !important;
        }
        
        .border-blue-200 {
          border-color: #93c5fd !important;
        }
        
        /* Grid layouts for print */
        .grid {
          display: block !important;
        }
        
        .grid > * {
          display: inline-block !important;
          width: 48% !important;
          margin: 1% !important;
          vertical-align: top !important;
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
