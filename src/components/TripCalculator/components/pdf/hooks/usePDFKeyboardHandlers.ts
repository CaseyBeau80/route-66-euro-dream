
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

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log('⌨️ ESC key pressed, closing PDF preview');
        onClosePreview();
      }
      
      // Enhanced keyboard shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        console.log('⌨️ Ctrl+P detected, print dialog should open');
        // Don't prevent default - let browser handle print
      }
    };

    const handleBeforePrint = () => {
      console.log('🖨️ Before print event detected');
    };

    const handleAfterPrint = () => {
      console.log('🖨️ After print event detected, cleaning up PDF preview');
      // Auto-close preview after printing
      setTimeout(() => {
        onClosePreview();
      }, 1000);
    };

    document.addEventListener('keydown', handleKeyPress);
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [showPreview, onClosePreview]);
};
