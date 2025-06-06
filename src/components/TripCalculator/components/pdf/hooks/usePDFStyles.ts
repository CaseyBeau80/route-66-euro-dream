
export const usePDFStyles = () => {
  const addPrintStyles = () => {
    const printStyleId = 'pdf-print-styles';
    let printStyles = document.getElementById(printStyleId);
    if (!printStyles) {
      printStyles = document.createElement('style');
      printStyles.id = printStyleId;
      document.head.appendChild(printStyles);
    }
    
    printStyles.textContent = `
      @media screen {
        #pdf-export-content.pdf-preview-visible {
          position: static !important;
          transform: scale(1.1) !important;
          transform-origin: top center !important;
          margin: 20px auto !important;
          padding: 40px !important;
          max-width: none !important;
          width: calc(100% - 80px) !important;
        }
      }
      
      @media print {
        @page {
          size: A4;
          margin: 0.5in;
        }
        
        body * {
          visibility: hidden;
        }
        
        #pdf-export-content,
        #pdf-export-content * {
          visibility: visible !important;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.5;
          color: #1f2937 !important;
          background: white !important;
          font-size: 14px !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        #pdf-export-content {
          position: static !important;
          left: auto !important;
          top: auto !important;
          visibility: visible !important;
          width: 100% !important;
          background: white !important;
          padding: 0.6in !important;
          margin: 0 !important;
          transform: none !important;
        }
        
        .pdf-clean-container {
          width: 100% !important;
          max-width: none !important;
          background: white !important;
          color: #1f2937 !important;
          font-family: inherit !important;
          font-size: 14px !important;
          line-height: 1.5 !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        
        .pdf-day-segment,
        .no-page-break {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        
        .bg-gray-50 {
          background-color: #f9fafb !important;
          border: 1px solid #e5e7eb !important;
        }
        
        .border {
          border: 1px solid #e5e7eb !important;
        }
        
        .rounded,
        .rounded-lg {
          border-radius: 8px !important;
        }
        
        .text-blue-600 { color: #2563eb !important; }
        .text-blue-800 { color: #1e40af !important; }
        .text-gray-800 { color: #1f2937 !important; }
        .text-gray-700 { color: #374151 !important; }
        .text-gray-600 { color: #4b5563 !important; }
        .text-gray-500 { color: #6b7280 !important; }
        
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `;
  };

  return { addPrintStyles };
};
