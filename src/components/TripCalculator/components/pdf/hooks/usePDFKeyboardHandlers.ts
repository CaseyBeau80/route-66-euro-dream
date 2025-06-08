
import { useEffect } from 'react';

interface UsePDFKeyboardHandlersProps {
  showPreview: boolean;
  onClosePreview: () => void;
}

export const usePDFKeyboardHandlers = ({
  showPreview,
  onClosePreview
}: UsePDFKeyboardHandlersProps) => {
  useEffect(() => {
    if (!showPreview) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClosePreview();
      }
      
      if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        // Allow default print behavior
        console.log('🖨️ Print command detected');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showPreview, onClosePreview]);
};
