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
        .pdf-close-button {
          position: absolute !important;
          top: 10px !important;
          right: 10px !important;
          z-index: 10000 !important;
          background: #dc2626 !important;
          color: white !important;
          border: none !important;
          padding: 16px 24px !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4) !important;
          font-size: 16px !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          transition: all 0.2s ease !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          min-width: 140px !important;
          justify-content: center !important;
          width: fit-content !important;
        }
        
        .pdf-close-button:hover {
          background: #b91c1c !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 12px 35px rgba(220, 38, 38, 0.5) !important;
        }
        
        .pdf-close-button:active {
          transform: translateY(0) !important;
          box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4) !important;
        }
        
        .pdf-instructions {
          position: absolute !important;
          top: 70px !important;
          right: 10px !important;
          z-index: 9999 !important;
          background: rgba(15, 23, 42, 0.95) !important;
          color: white !important;
          padding: 16px !important;
          border-radius: 8px !important;
          font-size: 13px !important;
          max-width: 220px !important;
          backdrop-filter: blur(8px) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
          width: fit-content !important;
        }

        .pdf-instructions div {
          margin-bottom: 4px !important;
        }

        .pdf-instructions div:last-child {
          margin-bottom: 0 !important;
        }

        #pdf-export-content.pdf-preview-visible {
          position: relative !important;
          transform: scale(1.1) !important;
          transform-origin: top center !important;
          margin: 20px auto !important;
          padding: 40px !important;
          max-width: none !important;
          width: calc(100% - 80px) !important;
        }
      }
      
      @media print {
        .pdf-close-button,
        .pdf-instructions {
          display: none !important;
        }
        
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
