
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, MapPin, Calendar, Camera, Route } from 'lucide-react';

const FinalCallToActionSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-route66-primary to-route66-primary-dark text-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Main CTA Content */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-bold mb-8 shadow-lg">
            <Route className="h-5 w-5" />
            START YOUR JOURNEY
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
            Your Route 66 Adventure Awaits
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed max-w-4xl mx-auto">
            From Chicago to Santa Monica, create memories that will last a lifetime. 
            Join millions who have experienced America's Mother Road.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <MapPin className="h-12 w-12 text-yellow-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Plan Your Route</h3>
              <p className="text-blue-100 mb-4">
                Use our smart trip calculator to create your perfect itinerary
              </p>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/20">
                Start Planning
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 text-green-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Book Your Trip</h3>
              <p className="text-blue-100 mb-4">
                Reserve accommodations and plan stops at heritage destinations
              </p>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/20">
                Book Now
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <Camera className="h-12 w-12 text-pink-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Share Your Story</h3>
              <p className="text-blue-100 mb-4">
                Join our community and document your Route 66 adventure
              </p>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/20">
                Join Community
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Primary CTA */}
        <div className="text-center">
          <Button 
            size="lg"
            className="bg-route66-accent-red hover:bg-red-700 text-white border-0 text-xl py-8 px-12 transform hover:scale-105 transition-all duration-300 shadow-2xl font-bold rounded-xl"
          >
            <MapPin className="mr-3" size={24} />
            Begin Your Route 66 Journey
            <ArrowRight className="ml-3" size={24} />
          </Button>
        </div>

        {/* Footer Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 text-center">
          <div>
            <div className="text-3xl font-black text-yellow-300 mb-2">2,448</div>
            <div className="text-sm text-blue-200">Miles of Adventure</div>
          </div>
          <div>
            <div className="text-3xl font-black text-yellow-300 mb-2">100</div>
            <div className="text-sm text-blue-200">Years of History</div>
          </div>
          <div>
            <div className="text-3xl font-black text-yellow-300 mb-2">8</div>
            <div className="text-sm text-blue-200">States to Explore</div>
          </div>
        </div>

        {/* Fine Print */}
        <div className="text-center mt-12">
          <p className="text-blue-200 text-sm">
            Experience the magic of Route 66 • America's Mother Road • Get your kicks on Route 66
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCallToActionSection;
