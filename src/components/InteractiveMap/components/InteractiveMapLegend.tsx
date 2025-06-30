
import React from 'react';
import { MapPin, Gem, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InteractiveMapLegend: React.FC = () => {
  const legendItems = [
    {
      icon: <Shield className="w-5 h-5 text-route66-primary" />,
      label: "Route 66 Shields",
      description: "Historic Route 66 markers and destination cities",
      color: "text-route66-primary"
    },
    {
      icon: <MapPin className="w-5 h-5 text-red-600" />,
      label: "Red Pins",
      description: "Major attractions and points of interest",
      color: "text-red-600"
    },
    {
      icon: <Gem className="w-5 h-5 text-blue-600" />,
      label: "Blue Gem Markers",
      description: "Hidden gems and secret local treasures",
      color: "text-blue-600"
    }
  ];

  return (
    <Card className="w-full border-2 border-route66-border shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-route66-text-primary flex items-center gap-2">
          <MapPin className="w-5 h-5 text-route66-primary" />
          Interactive Map Legend
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {legendItems.map((item, index) => (
            <div 
              key={index}
              className="flex items-start gap-4 p-3 rounded-lg bg-route66-background-alt border border-route66-divider hover:bg-route66-hover transition-all duration-200"
            >
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold text-sm mb-1 ${item.color}`}>
                  {item.label}
                </h4>
                <p className="text-xs text-route66-text-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Interactive Tips */}
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-route66-background to-route66-background-alt border border-route66-border">
          <h5 className="font-semibold text-sm text-route66-text-primary mb-2 flex items-center gap-2">
            <span>💡</span>
            Interactive Tips
          </h5>
          <div className="space-y-2 text-xs text-route66-text-secondary">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-route66-primary rounded-full"></span>
              <span>Click markers to discover stories and visit websites</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-route66-accent-orange rounded-full"></span>
              <span>Use mouse wheel or touch gestures to zoom</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-route66-accent-red rounded-full"></span>
              <span>Drag to explore different sections of Route 66</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveMapLegend;
