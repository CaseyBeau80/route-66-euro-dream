
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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showPreview && event.key === 'Escape') {
        onClosePreview();
      }
    };

    if (showPreview) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showPreview, onClosePreview]);
};
