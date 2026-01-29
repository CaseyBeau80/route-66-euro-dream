
import React from 'react';
import { Share2 } from 'lucide-react';
import Route66TripCalculator from './Route66TripCalculator';

const TripPlannerSection = () => {
  return <section className="py-10 bg-route66-background">
      <div className="container mx-auto px-4">
        {/* SEO-Friendly Section Header */}
        <div className="text-center mb-12">
          <div className="bg-route66-background-alt rounded-xl p-6 border-4 border-route66-primary shadow-xl max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-route66 text-route66-primary font-bold uppercase mb-4 tracking-wide">
              Shareable Travel Planner
            </h2>
            <p className="text-lg text-route66-text-secondary max-w-2xl mx-auto leading-relaxed">
              Build custom Route 66 trips and share them with friends and family
            </p>
          </div>
        </div>

        {/* Trip Calculator - Exact copy from dedicated page */}
        <div className="max-w-4xl mx-auto">
          {/* Feature Cards - Updated to include Shareable */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
            {/* Time Estimates Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-300 p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-200 to-transparent rounded-bl-full"></div>
              <div className="text-blue-600 text-2xl mb-2">⏱️</div>
              <h3 className="font-bold text-blue-800 mb-2">Time Estimates</h3>
              <p className="text-sm text-blue-700">Get accurate travel times and duration estimates for your entire trip</p>
            </div>
            
            {/* Must-See Stops Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-300 p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-200 to-transparent rounded-bl-full"></div>
              <div className="text-green-600 text-2xl mb-2">📍</div>
              <h3 className="font-bold text-green-800 mb-2">Destination Stops</h3>
              <p className="text-sm text-green-700">Discover iconic landmarks, hidden gems, and authentic Route 66 experiences</p>
            </div>
            
            {/* Weather Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 border-purple-300 p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-purple-200 to-transparent rounded-bl-full"></div>
              <div className="text-purple-600 text-2xl mb-2">🌤️</div>
              <h3 className="font-bold text-purple-800 mb-2">Weather</h3>
              <p className="text-sm text-purple-700">Get accurate weather forecasts for each day and destination of your journey</p>
            </div>
            
            {/* Budget Estimates Card */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border-2 border-orange-300 p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-orange-200 to-transparent rounded-bl-full"></div>
              <div className="text-orange-600 text-2xl mb-2">💲</div>
              <h3 className="font-bold text-orange-800 mb-2">Budget Estimates</h3>
              <p className="text-sm text-orange-700">Budget your adventure with fuel costs, accommodations, and attraction fees</p>
            </div>

            {/* Shareable Card - Changed to yellow theme to match Weather card */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border-2 border-yellow-300 p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-yellow-200 to-transparent rounded-bl-full"></div>
              <div className="text-yellow-600 mb-2 flex justify-center">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-yellow-800 mb-2">Shareable</h3>
              <p className="text-sm text-yellow-700">Share the link, email direct, and/or add to your Google or Apple calendar</p>
            </div>
          </div>
          
          {/* Trip Planner Container */}
          <div className="bg-white rounded-xl shadow-lg border border-route66-border p-4">
            <Route66TripCalculator />
          </div>
        </div>

        {/* Decorative Route 66 Badge */}
        
      </div>
    </section>;
};

export default TripPlannerSection;
