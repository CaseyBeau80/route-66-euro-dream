
export const usePDFStyles = () => {
  const addPrintStyles = () => {
    console.log('📄 Adding enhanced PDF print styles with Route 66 branding...');
    
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
        
        /* Header styling with Route 66 branding */
        .pdf-header {
          text-align: center !important;
          margin-bottom: 24px !important;
          padding-bottom: 16px !important;
          border-bottom: 2px solid #d97706 !important;
          page-break-inside: avoid !important;
        }
        
        .pdf-header h1 {
          font-size: 20px !important;
          font-weight: bold !important;
          color: #b91c1c !important;
          margin: 8px 0 !important;
        }
        
        /* Enhanced branding styles */
        .ramble-66-text-logo {
          text-align: center !important;
        }
        
        .font-route66 {
          font-family: 'Georgia', serif !important;
          font-weight: bold !important;
        }
        
        .font-travel {
          font-family: 'Times New Roman', serif !important;
        }
        
        /* Route 66 color scheme */
        .text-route66-primary,
        .text-route66-vintage-red {
          color: #b91c1c !important;
        }
        
        .text-route66-vintage-brown {
          color: #92400e !important;
        }
        
        .text-route66-navy {
          color: #1e3a8a !important;
        }
        
        .bg-route66-cream,
        .bg-route66-vintage-beige {
          background: #fef3c7 !important;
        }
        
        .bg-route66-vintage-yellow {
          background: #fde047 !important;
        }
        
        .bg-route66-primary {
          background: #d97706 !important;
        }
        
        .border-route66-vintage-brown {
          border-color: #92400e !important;
        }
        
        .border-route66-tan {
          border-color: #d6d3d1 !important;
        }
        
        /* Trip overview styling */
        .pdf-trip-overview {
          display: block !important;
          margin-bottom: 24px !important;
          padding: 16px !important;
          background: #fef3c7 !important;
          border: 2px solid #92400e !important;
          border-radius: 8px !important;
          page-break-inside: avoid !important;
        }
        
        .pdf-overview-card {
          display: inline-block !important;
          width: 23% !important;
          margin: 1% !important;
          text-align: center !important;
          padding: 12px !important;
          border: 2px solid #d6d3d1 !important;
          border-radius: 6px !important;
          background: white !important;
          vertical-align: top !important;
        }
        
        /* Day segments with enhanced styling */
        .pdf-day-segment {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
          margin-bottom: 20px !important;
          padding: 16px !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 8px !important;
          background: white !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
        }
        
        /* Weather sections with enhanced styling */
        .pdf-weather-section {
          background: #dbeafe !important;
          border: 1px solid #93c5fd !important;
          border-radius: 6px !important;
          padding: 12px !important;
          margin: 8px 0 !important;
          page-break-inside: avoid !important;
        }
        
        /* Footer with Route 66 branding */
        .pdf-footer {
          margin-top: 32px !important;
          padding-top: 20px !important;
          border-top: 2px solid #d97706 !important;
          text-align: center !important;
          font-size: 10px !important;
          color: #6b7280 !important;
          page-break-inside: avoid !important;
        }
        
        .pdf-footer a {
          color: #b91c1c !important;
          text-decoration: underline !important;
          font-weight: bold !important;
        }
        
        /* Typography fixes */
        h1, h2, h3, h4, h5, h6 {
          break-after: avoid !important;
          page-break-after: avoid !important;
          margin: 8px 0 !important;
        }
        
        /* Enhanced color corrections for Route 66 theme */
        .text-blue-600,
        .text-blue-700,
        .text-blue-800 {
          color: #1d4ed8 !important;
        }
        
        .bg-blue-50 {
          background: #dbeafe !important;
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
        
        /* QR Code section styling */
        .pdf-qr-section {
          background: #fef3c7 !important;
          border: 2px solid #92400e !important;
          border-radius: 8px !important;
          padding: 16px !important;
          margin: 16px 0 !important;
          page-break-inside: avoid !important;
        }
      }
    `;
    
    document.head.appendChild(style);
    console.log('✅ Enhanced PDF print styles with Route 66 branding added');
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
