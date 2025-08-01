
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, Camera } from 'lucide-react';
import { useRef } from 'react';

interface FileUploadInputProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const FileUploadInput = ({ onFileSelect, disabled }: FileUploadInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="text-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-muted-foreground/50 transition-colors">
        <div className="flex justify-center mb-4">
          <Camera className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Share Your Route 66 Photo</h3>
        <p className="text-muted-foreground mb-4">
          Upload a photo from your Route 66 adventure or roadside discovery
        </p>
        
        <Button 
          onClick={handleButtonClick}
          disabled={disabled}
          className="mb-4"
        >
          <Upload className="h-4 w-4 mr-2" />
          Choose Photo
        </Button>
        
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />
        
        <p className="text-xs text-muted-foreground">
          Accepted formats: JPG, PNG • Maximum size: 50MB
        </p>
      </div>
    </div>
  );
};
