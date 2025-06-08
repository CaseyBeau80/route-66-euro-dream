
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle } from 'lucide-react';

interface ShareTripOptionsFormProps {
  shareOptions: any;
  updateShareOption: (key: string, value: any) => void;
  isGeneratingLink: boolean;
}

const ShareTripOptionsForm: React.FC<ShareTripOptionsFormProps> = ({
  shareOptions,
  updateShareOption,
  isGeneratingLink
}) => {
  return (
    <div className="space-y-4">
      {/* Link Generation Loading Notice */}
      {isGeneratingLink && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span className="text-sm text-blue-800 font-medium">Generating shareable link...</span>
        </div>
      )}

      {/* Custom Title */}
      <div className="space-y-2">
        <Label className="text-blue-700 font-semibold text-sm">Custom Title (Optional)</Label>
        <Input
          placeholder="My Route 66 Adventure"
          value={shareOptions.title || ''}
          onChange={(e) => updateShareOption('title', e.target.value)}
          className="text-sm"
        />
      </div>

      {/* Share Options */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="includeWeather"
            checked={shareOptions.includeWeather}
            onCheckedChange={(checked) => updateShareOption('includeWeather', !!checked)}
          />
          <Label htmlFor="includeWeather" className="text-blue-700 font-semibold text-sm">Include Weather Forecast</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="includeStops"
            checked={shareOptions.includeStops}
            onCheckedChange={(checked) => updateShareOption('includeStops', !!checked)}
          />
          <Label htmlFor="includeStops" className="text-blue-700 font-semibold text-sm">Include Recommended Stops</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="allowPublicAccess"
            checked={shareOptions.allowPublicAccess}
            onCheckedChange={(checked) => updateShareOption('allowPublicAccess', !!checked)}
          />
          <Label htmlFor="allowPublicAccess" className="text-blue-700 font-semibold text-sm">Allow Public Access (No Password Required)</Label>
        </div>
      </div>

      {/* User Note */}
      <div className="space-y-2">
        <Label className="text-blue-700 font-semibold text-sm">Personal Note (Optional)</Label>
        <Input
          placeholder="Add a personal message for recipients..."
          value={shareOptions.userNote || ''}
          onChange={(e) => updateShareOption('userNote', e.target.value)}
          className="text-sm"
        />
      </div>

      {/* Instructions */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        <div className="font-semibold mb-2 text-blue-700 text-sm">📋 Share Instructions:</div>
        <ul className="text-xs space-y-1.5 leading-relaxed">
          <li>• A shareable link will be generated for your trip</li>
          <li>• Recipients can view your complete itinerary online</li>
          <li>• The link remains active for 30 days by default</li>
          <li>• You can copy the link to share via email, text, or social media</li>
          <li>• Weather data is loaded in real-time when recipients view the trip</li>
        </ul>
      </div>
    </div>
  );
};

export default ShareTripOptionsForm;
