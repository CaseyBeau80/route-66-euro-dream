
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ExportOptions {
  format: 'summary' | 'full';
  includeWeather: boolean;
  includeQRCode: boolean;
  title: string;
  watermark: string;
}

interface ExportOptionsFormProps {
  exportOptions: ExportOptions;
  onExportOptionsChange: (options: ExportOptions) => void;
  shareUrl: string | null;
}

const ExportOptionsForm: React.FC<ExportOptionsFormProps> = ({
  exportOptions,
  onExportOptionsChange,
  shareUrl
}) => {
  const updateOption = (key: keyof ExportOptions, value: any) => {
    onExportOptionsChange({
      ...exportOptions,
      [key]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="export-format" className="text-sm font-medium">
            Format
          </Label>
          <Select
            value={exportOptions.format}
            onValueChange={(value) => updateOption('format', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summary">Summary</SelectItem>
              <SelectItem value="full">Full Details</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="trip-title" className="text-sm font-medium">
            Trip Title
          </Label>
          <Input
            id="trip-title"
            value={exportOptions.title}
            onChange={(e) => updateOption('title', e.target.value)}
            placeholder="My Route 66 Adventure"
            className="text-sm"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="include-weather"
            checked={exportOptions.includeWeather}
            onCheckedChange={(checked) => updateOption('includeWeather', checked)}
          />
          <Label htmlFor="include-weather" className="text-sm">
            Include weather information
          </Label>
        </div>
        
        {shareUrl && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-qr"
              checked={exportOptions.includeQRCode}
              onCheckedChange={(checked) => updateOption('includeQRCode', checked)}
            />
            <Label htmlFor="include-qr" className="text-sm">
              Include QR code for live version
            </Label>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="watermark" className="text-sm font-medium">
          Watermark (optional)
        </Label>
        <Input
          id="watermark"
          value={exportOptions.watermark}
          onChange={(e) => updateOption('watermark', e.target.value)}
          placeholder="RAMBLE 66"
          className="text-sm"
        />
      </div>
    </div>
  );
};

export default ExportOptionsForm;
