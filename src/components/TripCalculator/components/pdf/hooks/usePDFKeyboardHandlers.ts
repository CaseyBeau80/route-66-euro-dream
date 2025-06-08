
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
      // ESC key to close preview
      if (event.key === 'Escape') {
        onClosePreview();
        return;
      }

      // Ctrl+P or Cmd+P to print
      if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        event.preventDefault();
        window.print();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showPreview, onClosePreview]);
};
