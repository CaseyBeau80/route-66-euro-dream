import React from 'react';
import { Share2 } from 'lucide-react';
import Route66TripCalculator from './Route66TripCalculator';
const TripPlannerSection = () => {
  return <section className="py-16 bg-route66-background">
      <div className="container mx-auto px-4">
        {/* Header - Made equally wide as the main heading */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="text-center bg-route66-background-section p-8 rounded-xl shadow-2xl border-4 border-route66-primary">
            <h2 className="text-4xl font-route66 text-route66-primary mb-4 font-bold">Plan Your Route 66 Adventure</h2>
            <p className="text-xl text-route66-text-secondary max-w-3xl mx-auto font-semibold">Create your perfect  journey with this comprehensive trip planning tool</p>
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
        <div className="flex justify-center mt-12">
          <div className="relative">
            <div className="w-20 h-26 bg-route66-background rounded-lg border-2 border-route66-primary shadow-xl flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-1 border border-route66-border rounded-md"></div>
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <div className="text-route66-text-muted text-xs font-semibold tracking-wider">ROUTE</div>
                <div className="text-route66-primary text-2xl font-black leading-none">66</div>
                <div className="text-route66-text-muted text-[8px] font-medium">TRIP PLANNER</div>
              </div>
            </div>
            <div className="absolute inset-0 rounded-lg bg-route66-primary/20 opacity-20 blur-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>;
};
export default TripPlannerSection;