import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, Camera, ImageIcon, AlertTriangle } from 'lucide-react';
import { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
interface DragDropFileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}
export const DragDropFileUpload = ({
  onFileSelect,
  disabled
}: DragDropFileUploadProps) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);
  const validateFile = (file: File): {
    valid: boolean;
    error?: string;
  } => {
    // Check file type - accept all image types for mobile compatibility
    if (!file.type.startsWith('image/')) {
      return {
        valid: false,
        error: 'Only image files are allowed'
      };
    }

    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File too large. Maximum size is 50MB (${(file.size / (1024 * 1024)).toFixed(1)}MB uploaded)`
      };
    }
    return {
      valid: true
    };
  };
  const handleFile = useCallback((file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      setDragError(validation.error || 'Invalid file');
      setTimeout(() => setDragError(null), 3000);
      return;
    }
    setDragError(null);
    onFileSelect(file);
  }, [onFileSelect]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };
  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleGalleryClick = () => {
    galleryInputRef.current?.click();
  };
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
      setDragError(null);
    }
  }, [disabled]);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only set dragOver to false if we're leaving the drop zone entirely
    // Use LayoutOptimizer to prevent forced reflows during drag operations
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  }, []);
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    if (files.length > 1) {
      setDragError('Please drop only one file at a time');
      setTimeout(() => setDragError(null), 3000);
      return;
    }
    handleFile(files[0]);
  }, [disabled, handleFile]);
  return <div className="space-y-4">
      <div className={cn("relative text-center p-8 border-2 border-dashed rounded-lg transition-all duration-200", disabled && "opacity-50 cursor-not-allowed", !disabled && !isDragOver && !dragError && "border-border hover:border-route66-primary hover:bg-route66-primary/5", !disabled && isDragOver && "border-route66-primary bg-route66-primary/10 scale-[1.02]", dragError && "border-destructive bg-destructive/5")} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}>
        {/* Visual feedback overlay */}
        {isDragOver && !disabled && <div className="absolute inset-0 bg-route66-primary/10 border-2 border-dashed border-route66-primary rounded-lg flex items-center justify-center">
            <div className="text-route66-primary font-medium flex items-center gap-2">
              <ImageIcon className="h-6 w-6" />
              Drop your photo here
            </div>
          </div>}

        {/* Error overlay */}
        {dragError && <div className="absolute inset-0 bg-destructive/10 border-2 border-dashed border-destructive rounded-lg flex items-center justify-center">
            <div className="text-destructive font-medium flex items-center gap-2 max-w-xs">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">{dragError}</span>
            </div>
          </div>}

        <div className={cn("transition-opacity duration-200", (isDragOver || dragError) && "opacity-30")}>
          {/* Mobile-friendly buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
            <Button onClick={handleCameraClick} disabled={disabled} className="bg-route66-primary hover:bg-route66-primary-dark text-white min-h-[50px] flex-1 sm:flex-none">
              <Camera className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Take Photo</span>
              <span className="sm:hidden">Camera</span>
            </Button>
            
            <Button onClick={handleGalleryClick} disabled={disabled} variant="outline" className="border-route66-border text-route66-text-secondary hover:bg-route66-background min-h-[50px] flex-1 sm:flex-none">
              <Upload className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Choose from Gallery</span>
              <span className="sm:hidden">Gallery</span>
            </Button>
          </div>
          
          {/* Hidden camera input */}
          <Input 
            ref={cameraInputRef} 
            type="file" 
            accept="image/*" 
            capture="environment"
            onChange={handleFileChange} 
            disabled={disabled} 
            className="hidden" 
          />
          
          {/* Hidden gallery input */}
          <Input 
            ref={galleryInputRef} 
            type="file" 
            accept="image/*"
            onChange={handleFileChange} 
            disabled={disabled} 
            className="hidden" 
          />
          
          <p className="text-xs text-muted-foreground">
            Take a photo or choose from gallery • Maximum size: 50MB
          </p>
        </div>
      </div>
    </div>;
};