
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle } from 'lucide-react';

interface PDFExportOptionsFormProps {
  exportOptions: any;
  updateExportOption: (key: string, value: any) => void;
  weatherLoading: boolean;
}

const PDFExportOptionsForm: React.FC<PDFExportOptionsFormProps> = ({
  exportOptions,
  updateExportOption,
  weatherLoading
}) => {
  return (
    <div className="space-y-4">
      {/* Weather Loading Notice */}
      {weatherLoading && (
        <div className="flex items-center gap-2 p-3 bg-route66-orange-50 border border-route66-orange-200 rounded">
          <AlertCircle className="w-4 h-4 text-route66-orange-600" />
          <span className="text-sm text-route66-orange-800">Loading weather data...</span>
        </div>
      )}

      {/* Export Format */}
      <div className="space-y-2">
        <Label className="text-route66-orange-600 font-semibold">Export Format</Label>
        <Select 
          value={exportOptions.format} 
          onValueChange={(value: 'full' | 'summary' | 'route-only') => 
            updateExportOption('format', value)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full">Full Details (Route + Weather)</SelectItem>
            <SelectItem value="summary">Summary (Route + Key Stops)</SelectItem>
            <SelectItem value="route-only">Route Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Custom Title */}
      <div className="space-y-2">
        <Label className="text-route66-orange-600 font-semibold">Custom Title (Optional)</Label>
        <Input
          placeholder="My Route 66 Adventure"
          value={exportOptions.title || ''}
          onChange={(e) => updateExportOption('title', e.target.value)}
        />
      </div>

      {/* Options */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="includeQRCode"
            checked={exportOptions.includeQRCode}
            onCheckedChange={(checked) => updateExportOption('includeQRCode', !!checked)}
          />
          <Label htmlFor="includeQRCode" className="text-route66-orange-600 font-semibold">QR Code to Live Version</Label>
        </div>
      </div>

      {/* Watermark */}
      <div className="space-y-2">
        <Label className="text-route66-orange-600 font-semibold">Watermark (Optional)</Label>
        <Input
          placeholder="DRAFT, CONFIDENTIAL, etc."
          value={exportOptions.watermark || ''}
          onChange={(e) => updateExportOption('watermark', e.target.value)}
        />
      </div>

      {/* Instructions */}
      <div className="p-3 bg-route66-orange-50 border border-route66-orange-200 rounded text-sm text-route66-orange-700">
        <div className="font-medium mb-1 text-route66-orange-600">📋 Export Instructions:</div>
        <ul className="text-xs space-y-1">
          <li>• Weather data loads automatically (may take a few seconds)</li>
          <li>• Weather forecast unavailable? Please check online before departure</li>
          <li>• Press <kbd className="bg-route66-orange-200 px-1 rounded">ESC</kbd> to close PDF preview</li>
          <li>• Use <kbd className="bg-route66-orange-200 px-1 rounded">Ctrl+P</kbd> to print or save as PDF</li>
          <li>• Click the red close button to exit preview mode</li>
        </ul>
      </div>
    </div>
  );
};

export default PDFExportOptionsForm;
