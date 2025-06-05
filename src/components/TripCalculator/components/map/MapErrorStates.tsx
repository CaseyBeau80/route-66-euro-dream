
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';

export const MapNoApiKey: React.FC = () => (
  <Card className="border border-route66-border">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-sm font-semibold text-route66-text-primary">
        <Navigation className="h-4 w-4" />
        Route Map
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Google Maps API key required</p>
          <p className="text-xs text-gray-500 mt-2">
            Please set your API key to view route maps
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const MapLoadError: React.FC = () => (
  <Card className="border border-route66-border">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-sm font-semibold text-route66-text-primary">
        <Navigation className="h-4 w-4" />
        Route Map
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Failed to load Google Maps</p>
          <p className="text-xs text-gray-500 mt-2">
            Please check your API key and try again
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const MapLoading: React.FC = () => (
  <Card className="border border-route66-border">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-sm font-semibold text-route66-text-primary">
        <Navigation className="h-4 w-4" />
        Route Map
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center">
          <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-pulse" />
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    </CardContent>
  </Card>
);
