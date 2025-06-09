
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

interface PDFExportOptions {
  format: 'full' | 'summary' | 'route-only';
  title?: string;
  watermark?: string;
  includeQRCode: boolean;
}

interface PDFExportOptionsFormProps {
  exportOptions: PDFExportOptions;
  updateExportOption: <K extends keyof PDFExportOptions>(key: K, value: PDFExportOptions[K]) => void;
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
        <Label className="text-route66-primary font-semibold text-sm">Export Format</Label>
        <Select 
          value={exportOptions.format} 
          onValueChange={(value: 'full' | 'summary' | 'route-only') => updateExportOption('format', value)}
        >
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full">Complete Itinerary (with weather & attractions)</SelectItem>
            <SelectItem value="summary">Summary View (overview only)</SelectItem>
            <SelectItem value="route-only">Route Only (basic route info)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Custom Title */}
      <div className="space-y-2">
        <Label className="text-route66-primary font-semibold text-sm">Custom Title (Optional)</Label>
        <Input
          placeholder="My Route 66 Adventure"
          value={exportOptions.title || ''}
          onChange={(e) => updateExportOption('title', e.target.value)}
          className="text-sm"
        />
      </div>

      {/* Weather Forecast Information */}
      <div className="p-4 bg-route66-vintage-beige border border-route66-tan rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-lg">🌤️</div>
          <Label className="text-route66-vintage-red font-semibold text-sm font-route66">
            Weather Forecast Information
          </Label>
        </div>
        <div className="text-xs text-route66-vintage-brown space-y-1">
          {weatherLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin w-3 h-3 border border-route66-primary border-t-transparent rounded-full"></div>
              <span>Loading current weather forecasts...</span>
            </div>
          ) : (
            <>
              <div>✅ Weather data will be included for each destination</div>
              <div>📅 Forecasts based on your travel dates</div>
              <div>🌡️ Temperature, conditions, and travel tips included</div>
            </>
          )}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="includeQRCode"
            checked={exportOptions.includeQRCode}
            onCheckedChange={(checked) => updateExportOption('includeQRCode', !!checked)}
          />
          <Label htmlFor="includeQRCode" className="text-route66-primary font-semibold text-sm">Include QR Code for Live Version</Label>
        </div>
      </div>

      {/* Watermark */}
      <div className="space-y-2">
        <Label className="text-route66-primary font-semibold text-sm">Watermark (Optional)</Label>
        <Input
          placeholder="DRAFT"
          value={exportOptions.watermark || ''}
          onChange={(e) => updateExportOption('watermark', e.target.value)}
          className="text-sm"
        />
      </div>

      {/* Instructions */}
      <div className="p-3 bg-route66-vintage-beige border border-route66-tan rounded-lg text-sm text-route66-navy">
        <div className="font-semibold mb-2 text-route66-vintage-red text-sm font-route66">🛣️ Enhanced PDF Features:</div>
        <ul className="text-xs space-y-1.5 leading-relaxed text-route66-vintage-brown">
          <li>• Instant preview opening for fast review</li>
          <li>• Enhanced Route 66 branding and nostalgic styling</li>
          <li>• Current weather forecasts for each destination</li>
          <li>• Optimized layout matching your final itinerary</li>
          <li>• Print-ready format with professional presentation</li>
        </ul>
      </div>
    </div>
  );
};

export default PDFExportOptionsForm;
