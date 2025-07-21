
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import ApiKeyInput from './ApiKeyInput';
import { GoogleDistanceMatrixService } from '../services/GoogleDistanceMatrixService';

interface ApiKeySectionProps {
  showApiKeyInput: boolean;
  onApiKeySet: () => void;
}

const ApiKeySection: React.FC<ApiKeySectionProps> = ({ showApiKeyInput, onApiKeySet }) => {
  const [isCheckingApiKey, setIsCheckingApiKey] = useState(true);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const checkApiKey = async () => {
      setIsCheckingApiKey(true);
      try {
        const available = await GoogleDistanceMatrixService.isAvailable();
        setHasApiKey(available);
      } catch (error) {
        console.error('Error checking API key:', error);
        setHasApiKey(false);
      } finally {
        setIsCheckingApiKey(false);
      }
    };

    checkApiKey();
  }, []);

  const handleApiKeySet = async () => {
    // Recheck API key availability after setting
    const available = await GoogleDistanceMatrixService.isAvailable();
    setHasApiKey(available);
    onApiKeySet();
  };

  if (isCheckingApiKey) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 text-blue-600 animate-spin flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900">Checking Google Maps API...</h4>
              <p className="text-sm text-blue-800">
                Verifying API key availability for accurate distance calculations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (hasApiKey) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-green-900">Google Maps API Connected</h4>
              <p className="text-sm text-green-800">
                Your trip distances will be calculated using accurate Google Maps data for realistic Route 66 journey planning.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!showApiKeyInput) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-amber-900">Enhanced Accuracy Available</h4>
              <p className="text-sm text-amber-800">
                Add your Google Maps API key to get precise driving distances and times between Route 66 cities. 
                Without it, we'll use estimated distances that may be less accurate.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#e2e8f0]">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-[#1e293b] mb-2">Google Maps API Key (Recommended)</h4>
            <p className="text-sm text-[#64748b] mb-3">
              Add your Google Maps API key to get accurate driving distances and times between Route 66 destination cities. 
              This ensures your trip planning reflects real-world travel along the historic Mother Road.
            </p>
          </div>
          
          <ApiKeyInput onApiKeySet={handleApiKeySet} />
          
          <div className="text-xs text-[#94a3b8] space-y-1">
            <p>• Your API key is stored securely and used only for distance calculations</p>
            <p>• Distance Matrix API calls are made directly from your browser</p>
            <p>• You only pay Google for the API usage according to their pricing</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeySection;
