
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Route66Map from '../Route66Map';
import { MapPin, Route, Clock, Eye, EyeOff } from 'lucide-react';

const InteractiveMapSection: React.FC = () => {
  const [isMapVisible, setIsMapVisible] = useState(false);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-route66-primary text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg">
            <MapPin className="h-5 w-5" />
            INTERACTIVE EXPLORATION
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-route66-primary mb-6">
            Explore Route 66 Interactive Map
          </h2>
          <p className="text-xl text-route66-text-secondary max-w-3xl mx-auto leading-relaxed">
            Navigate the legendary Mother Road with our interactive map featuring heritage cities, 
            historic attractions, and hidden gems along all 2,448 miles.
          </p>
        </div>

        {/* Map Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto">
          <div className="text-center bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="text-2xl font-bold text-route66-primary mb-1">2,448</div>
            <div className="text-sm text-gray-600">Miles to Explore</div>
          </div>
          <div className="text-center bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="text-2xl font-bold text-green-600 mb-1">8</div>
            <div className="text-sm text-gray-600">States to Visit</div>
          </div>
          <div className="text-center bg-red-50 rounded-xl p-4 border border-red-200">
            <div className="text-2xl font-bold text-route66-accent-red mb-1">100+</div>
            <div className="text-sm text-gray-600">Historic Sites</div>
          </div>
        </div>

        {/* Map Toggle Button */}
        <div className="text-center mb-8">
          <Button 
            onClick={() => setIsMapVisible(!isMapVisible)}
            size="lg"
            className="bg-route66-primary hover:bg-route66-primary-dark text-white px-8 py-4 text-lg font-semibold"
          >
            {isMapVisible ? (
              <>
                <EyeOff className="mr-3 h-5 w-5" />
                Hide Interactive Map
              </>
            ) : (
              <>
                <Eye className="mr-3 h-5 w-5" />
                Show Interactive Map
              </>
            )}
          </Button>
        </div>

        {/* Interactive Map Container */}
        {isMapVisible && (
          <Card className="shadow-2xl border-2 border-route66-border overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-route66-primary to-route66-primary-light text-white p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Route className="h-6 w-6 text-yellow-300" />
                  <h3 className="text-xl font-bold">Interactive Route 66 Map</h3>
                </div>
                <p className="text-blue-100">
                  Click on destinations to explore attractions, plan your route, and discover hidden gems
                </p>
              </div>
              <div className="h-[600px] bg-gray-100">
                <Route66Map />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Map Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
            <MapPin className="h-12 w-12 text-route66-primary mx-auto mb-4" />
            <h4 className="text-lg font-bold text-gray-800 mb-2">Heritage Cities</h4>
            <p className="text-gray-600">Discover authentic Route 66 destinations with rich history and culture</p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
            <Route className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-gray-800 mb-2">Historic Route</h4>
            <p className="text-gray-600">Follow the original path through America's heartland</p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
            <Clock className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-gray-800 mb-2">Real-time Info</h4>
            <p className="text-gray-600">Get current weather, events, and travel conditions</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveMapSection;
