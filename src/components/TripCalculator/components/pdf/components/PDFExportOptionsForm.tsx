
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { PDFExportOptions } from '../../services/pdf/PDFLayoutService';

interface PDFExportOptionsFormProps {
  exportOptions: PDFExportOptions;
  updateExportOption: <K extends keyof PDFExportOptions>(
    key: K,
    value: PDFExportOptions[K]
  ) => void;
  weatherLoading: boolean;
}

const PDFExportOptionsForm: React.FC<PDFExportOptionsFormProps> = ({
  exportOptions,
  updateExportOption,
  weatherLoading
}) => {
  return (
    <div className="space-y-4">
      {/* Export Format */}
      <div className="space-y-2">
        <Label className="text-blue-700 font-semibold text-sm">Export Format</Label>
        <Select 
          value={exportOptions.format} 
          onValueChange={(value: 'full' | 'summary' | 'route-only') => updateExportOption('format', value)}
        >
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full">Full Itinerary (with weather & stops)</SelectItem>
            <SelectItem value="summary">Summary (basic info only)</SelectItem>
            <SelectItem value="route-only">Route Only (no weather or stops)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Custom Title */}
      <div className="space-y-2">
        <Label className="text-blue-700 font-semibold text-sm">Custom Title (Optional)</Label>
        <Input
          placeholder="My Route 66 Adventure"
          value={exportOptions.title || ''}
          onChange={(e) => updateExportOption('title', e.target.value)}
          className="text-sm"
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
          <Label htmlFor="includeQRCode" className="text-blue-700 font-semibold text-sm">Include QR Code for Live Version</Label>
        </div>
      </div>

      {/* Watermark */}
      <div className="space-y-2">
        <Label className="text-blue-700 font-semibold text-sm">Watermark (Optional)</Label>
        <Input
          placeholder="DRAFT"
          value={exportOptions.watermark || ''}
          onChange={(e) => updateExportOption('watermark', e.target.value)}
          className="text-sm"
        />
      </div>

      {/* Weather Loading Status */}
      {weatherLoading && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span className="text-sm text-blue-800 font-medium">Loading weather data...</span>
        </div>
      )}

      {/* Instructions */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        <div className="font-semibold mb-2 text-blue-700 text-sm">📋 PDF Export Instructions:</div>
        <ul className="text-xs space-y-1.5 leading-relaxed">
          <li>• Click "Export PDF" to create your printable itinerary</li>
          <li>• A preview will open where you can review the content</li>
          <li>• Press Ctrl+P (or Cmd+P on Mac) to open the print dialog</li>
          <li>• Choose "Save as PDF" as your destination to download the file</li>
          <li>• Weather data is loaded for enhanced trip planning</li>
        </ul>
      </div>
    </div>
  );
};

export default PDFExportOptionsForm;
