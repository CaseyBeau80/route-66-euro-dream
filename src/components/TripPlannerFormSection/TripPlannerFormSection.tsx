
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import Route66TripCalculator from '../Route66TripCalculator';

const TripPlannerFormSection: React.FC = () => {
  return (
    <section className="py-20 bg-route66-background-section">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-route66-primary text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg">
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

        {/* Planning Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-6 bg-white rounded-xl border border-route66-border shadow-md">
            <MapPin className="h-12 w-12 text-route66-primary mx-auto mb-4" />
            <h4 className="text-lg font-bold text-route66-primary mb-2">Custom Routes</h4>
            <p className="text-route66-text-secondary text-sm">Plan your personalized Route 66 journey</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl border border-route66-border shadow-md">
            <Clock className="h-12 w-12 text-route66-primary mx-auto mb-4" />
            <h4 className="text-lg font-bold text-route66-primary mb-2">Smart Timing</h4>
            <p className="text-route66-text-secondary text-sm">Optimize your schedule and stops</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl border border-route66-border shadow-md">
            <Users className="h-12 w-12 text-route66-primary mx-auto mb-4" />
            <h4 className="text-lg font-bold text-route66-primary mb-2">Group Planning</h4>
            <p className="text-route66-text-secondary text-sm">Perfect for families and friends</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl border border-route66-border shadow-md">
            <Calendar className="h-12 w-12 text-route66-primary mx-auto mb-4" />
            <h4 className="text-lg font-bold text-route66-primary mb-2">Weather Forecast</h4>
            <p className="text-route66-text-secondary text-sm">Plan around weather conditions</p>
          </div>
        </div>

        {/* Trip Calculator */}
        <Card className="shadow-2xl border-2 border-route66-border overflow-hidden">
          <div className="bg-route66-primary text-white h-2"></div>
          <CardContent className="p-0">
            <Route66TripCalculator />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TripPlannerFormSection;
