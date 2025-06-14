
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check, CloudSun } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { TripDataSerializer } from '../services/TripDataSerializer';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

interface SerializedShareButtonProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  weatherData?: Record<string, ForecastWeatherData>;
  className?: string;
}

const SerializedShareButton: React.FC<SerializedShareButtonProps> = ({
  tripPlan,
  tripStartDate,
  weatherData,
  className = ""
}) => {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSerializedShare = async () => {
    if (isGenerating) return;

    try {
      setIsGenerating(true);
      
      console.log('🔗 Generating serialized share URL with weather data...');
      
      const shareUrl = TripDataSerializer.generateSerializedShareUrl(
        tripPlan,
        tripStartDate,
        weatherData
      );

      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      
      toast({
        title: "Weather-Enabled Link Copied!",
        description: "Link with live weather forecasts copied to clipboard!",
        variant: "default"
      });

      setTimeout(() => setCopied(false), 2000);

      console.log('✅ Serialized share URL generated and copied', {
        urlLength: shareUrl.length,
        weatherEntries: Object.keys(weatherData || {}).length
      });

    } catch (error) {
      console.error('❌ Failed to generate serialized share URL:', error);
      
      toast({
        title: "Failed to Generate Link",
        description: "Could not create weather-enabled share link. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleSerializedShare}
      disabled={isGenerating}
      className={`gap-2 bg-blue-600 hover:bg-blue-700 text-white ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          Copied!
        </>
      ) : isGenerating ? (
        <>
          <CloudSun className="w-4 h-4 animate-pulse" />
          Generating...
        </>
      ) : (
        <>
          <CloudSun className="w-4 h-4" />
          Share with Weather
        </>
      )}
    </Button>
  );
};

export default SerializedShareButton;
