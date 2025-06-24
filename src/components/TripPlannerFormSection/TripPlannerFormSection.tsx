
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Route66TripCalculator from '../Route66TripCalculator';
import { MapPin, Calendar, DollarSign, Clock } from 'lucide-react';

const TripPlannerFormSection: React.FC = () => {
  return (
    <section className="py-20 bg-route66-background-section">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-route66-accent-red text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg">
            <Calendar className="h-5 w-5" />
            TRIP PLANNING
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-route66-primary mb-6">
            Plan Your Perfect Route 66 Adventure
          </h2>
          <p className="text-xl text-route66-text-secondary max-w-3xl mx-auto leading-relaxed">
            Create your ideal journey with our smart trip calculator. Get personalized itineraries, 
            cost estimates, and timing recommendations for your Route 66 experience.
          </p>
        </div>

        {/* Planning Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center bg-white rounded-xl p-6 shadow-md border border-route66-border">
            <MapPin className="h-8 w-8 text-route66-primary mx-auto mb-3" />
            <h4 className="font-bold text-gray-800 mb-1">Smart Routing</h4>
            <p className="text-sm text-gray-600">Optimized heritage cities path</p>
          </div>
          <div className="text-center bg-white rounded-xl p-6 shadow-md border border-route66-border">
            <Clock className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h4 className="font-bold text-gray-800 mb-1">Time Planning</h4>
            <p className="text-sm text-gray-600">Flexible duration options</p>
          </div>
          <div className="text-center bg-white rounded-xl p-6 shadow-md border border-route66-border">
            <DollarSign className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
            <h4 className="font-bold text-gray-800 mb-1">Cost Estimates</h4>
            <p className="text-sm text-gray-600">Budget planning tools</p>
          </div>
          <div className="text-center bg-white rounded-xl p-6 shadow-md border border-route66-border">
            <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h4 className="font-bold text-gray-800 mb-1">Date Selection</h4>
            <p className="text-sm text-gray-600">Weather-optimized timing</p>
          </div>
        </div>

        {/* Trip Calculator Card */}
        <Card className="shadow-2xl border-2 border-route66-border">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-route66-border">
            <CardTitle className="text-2xl text-route66-primary text-center">
              Route 66 Trip Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <Route66TripCalculator />
          </CardContent>
        </Card>

        {/* Planning Tips */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h4 className="font-bold text-yellow-800 mb-4 text-center">✨ Smart Planning Tips</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
            <div className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              <span>Optimal drive time: Maximum 8-10 hours per day for comfort</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              <span>Heritage cities focus for authentic Route 66 experiences</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              <span>Spring and fall offer the best weather conditions</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              <span>Budget extra time for spontaneous stops and photo opportunities</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TripPlannerFormSection;
