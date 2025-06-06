
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
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showPreview) {
        onClosePreview();
      }
    };

    if (showPreview) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [showPreview, onClosePreview]);
};
