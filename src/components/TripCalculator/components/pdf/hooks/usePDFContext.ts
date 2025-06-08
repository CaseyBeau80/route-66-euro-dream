
import { useState, useEffect } from 'react';

export const usePDFContext = () => {
  const [isPDFExportContext, setIsPDFExportContext] = useState(false);

  useEffect(() => {
    // Check if we're in a PDF export context
    const checkPDFContext = () => {
      // Look for PDF export container
      const pdfContainer = document.getElementById('pdf-export-content');
      const isPDFMode = !!pdfContainer;
      
      console.log('🔍 PDF Context Check:', {
        hasPDFContainer: isPDFMode,
        currentContext: isPDFMode ? 'PDF Export' : 'Normal UI'
      });
      
      setIsPDFExportContext(isPDFMode);
    };

    // Initial check
    checkPDFContext();

    // Set up observer for PDF container changes
    const observer = new MutationObserver(() => {
      checkPDFContext();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return {
    isPDFExportContext,
    setIsPDFExportContext
  };
};
