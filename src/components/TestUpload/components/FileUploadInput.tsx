
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FileUploadInputProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const FileUploadInput = ({ onFileSelect, disabled }: FileUploadInputProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="fileUpload">Select Image (JPG or PNG)</Label>
      <Input
        id="fileUpload"
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileChange}
        disabled={disabled}
      />
      <p className="text-sm text-muted-foreground">
        Trip ID: demo-trip | Stop ID: tulsa
      </p>
    </div>
  );
};
