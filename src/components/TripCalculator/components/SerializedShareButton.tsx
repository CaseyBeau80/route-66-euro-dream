
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check, CloudSun, AlertTriangle } from 'lucide-react';
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

      // Check URL length before copying - lower threshold for warning
      if (shareUrl.length > 3000) {
        toast({
          title: "URL May Be Too Long",
          description: "The generated link is very long and may not work in all browsers. Try a shorter trip or fewer days.",
          variant: "destructive"
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      
      const weatherCount = Object.keys(weatherData || {}).length;
      const hasWeather = weatherCount > 0;
      
      toast({
        title: hasWeather ? "Weather-Enabled Link Copied!" : "Trip Link Copied!",
        description: hasWeather 
          ? `Link with ${weatherCount} weather forecasts copied to clipboard!`
          : "Trip link copied to clipboard (weather data was reduced to fit URL limits).",
        variant: "default"
      });

      setTimeout(() => setCopied(false), 2000);

      console.log('✅ Serialized share URL generated and copied', {
        urlLength: shareUrl.length,
        weatherEntries: weatherCount,
        hasWeather
      });

    } catch (error) {
      console.error('❌ Failed to generate serialized share URL:', error);
      
      toast({
        title: "Failed to Generate Link",
        description: "Could not create share link. The trip data may be too large. Try a shorter trip with fewer days.",
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
