
import React, { useState } from 'react';
import SplitViewSection from '../SplitViewSection/SplitViewSection';
import Route66Map from '../Route66Map';
import Route66TripCalculator from '../Route66TripCalculator';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Route, Clock, DollarSign } from 'lucide-react';

const TripPlannerSplitView: React.FC = () => {
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);

  const mapContent = (
    <div className="h-full min-h-[600px] relative">
      {/* Map Header */}
      <div className="bg-gradient-to-r from-route66-primary to-route66-secondary text-white p-4 rounded-lg mb-4">
        <div className="flex items-center gap-3 mb-2">
          <MapPin className="h-6 w-6 text-yellow-300" />
          <h3 className="text-xl font-bold">Interactive Route 66 Map</h3>
        </div>
        <p className="text-blue-100">
          Explore destinations, view attractions, and plan your perfect route
        </p>
      </div>

      {/* Map Features */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-blue-700">
            <Route className="h-4 w-4" />
            <span className="text-sm font-medium">2,448 Miles</span>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-green-700">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">8 States</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 bg-gray-100 rounded-lg border-2 border-route66-border overflow-hidden">
        <Route66Map />
      </div>
    </div>
  );

  const plannerContent = (
    <div className="space-y-6">
      {/* Planner Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-route66-primary mb-2">
          Plan Your Route 66 Adventure
        </h3>
        <p className="text-route66-text-secondary mb-4">
          Create your perfect heritage cities journey with our smart planning tools
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center bg-white rounded-lg p-3 border border-blue-100">
            <div className="text-lg font-bold text-route66-primary">Free</div>
            <div className="text-xs text-gray-600">Planning</div>
          </div>
          <div className="text-center bg-white rounded-lg p-3 border border-green-100">
            <div className="text-lg font-bold text-green-600">Smart</div>
            <div className="text-xs text-gray-600">Optimization</div>
          </div>
          <div className="text-center bg-white rounded-lg p-3 border border-purple-100">
            <div className="text-lg font-bold text-purple-600">Heritage</div>
            <div className="text-xs text-gray-600">Cities</div>
          </div>
        </div>
      </div>

      {/* Trip Calculator */}
      <Card>
        <CardContent className="p-6">
          <Route66TripCalculator />
        </CardContent>
      </Card>

      {/* Planning Features */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">✨ Smart Planning Features</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Auto-optimized drive times (max 10 hours/day)</li>
          <li>• Heritage cities focus for authentic experiences</li>
          <li>• Flexible trip duration adjustment</li>
          <li>• Cost estimation and budgeting tools</li>
        </ul>
      </div>
    </div>
  );

  return (
    <SplitViewSection
      leftContent={mapContent}
      rightContent={plannerContent}
      leftTitle="Interactive Route 66 Map"
      rightTitle="Trip Planner"
      sectionId="trip-planner-split"
      leftBg="bg-white"
      rightBg="bg-route66-background-alt"
    />
  );
};

export default TripPlannerSplitView;
