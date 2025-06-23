
import { useState, useEffect } from "react";
import NavigationBar from "@/components/NavigationBar";
import Route66TripCalculator from "@/components/Route66TripCalculator";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { Share2, Calendar, Mail } from "lucide-react";

const TripCalculator = () => {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "pt-BR">("en");
  
  useEffect(() => {
    console.log('🚗 TripCalculator page mounted');

    // Check for any critical errors on mount
    const handleError = (event: ErrorEvent) => {
      console.error('❌ Critical error in TripCalculator:', event.error);
    };
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('❌ Unhandled promise rejection in TripCalculator:', event.reason);
    };
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-route66-background via-route66-background-alt to-route66-background-section">
      {/* Navigation Bar */}
      <NavigationBar language={language} setLanguage={setLanguage} />
      
      {/* Main Content */}
      <div className="pt-16 pb-6">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Modern Header with Blue Theme */}
            <div className="text-center mb-6">
              <div className="flex justify-center items-center gap-4 mb-4">
                {/* Removed Route 66 shield icon and Unit Toggle */}
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-route66-primary mb-3">
                Plan Your Route 66 Adventure
              </h1>
              <p className="text-lg text-route66-text-secondary max-w-2xl mx-auto leading-relaxed mb-4">Try the free trip planner tool below 👇</p>

              {/* YouTube Video Section */}
              <div className="mb-6">
                <YouTubeEmbed videoId="3904gZljFmY" title="Route 66 Travel Guide & Planning Tips" className="max-w-2xl mx-auto" />
              </div>

              {/* Feature Cards with Share/Calendar/Email Icons */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {/* Highlighted Time Estimates Card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-300 p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-200 to-transparent rounded-bl-full"></div>
                  <div className="text-blue-600 text-2xl mb-2">⏱️</div>
                  <h3 className="font-bold text-blue-800 mb-2">Time Estimates</h3>
                  <p className="text-sm text-blue-700">Get accurate travel times and duration estimates for your entire trip</p>
                </div>
                
                {/* Highlighted Must-See Stops Card */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-300 p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-200 to-transparent rounded-bl-full"></div>
                  <div className="text-green-600 text-2xl mb-2">📍</div>
                  <h3 className="font-bold text-green-800 mb-2">Destination Stops</h3>
                  <p className="text-sm text-green-700">Discover iconic landmarks, hidden gems, and authentic Route 66 experiences</p>
                </div>
                
                {/* Highlighted Weather Card */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 border-purple-300 p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-purple-200 to-transparent rounded-bl-full"></div>
                  <div className="text-purple-600 text-2xl mb-2">🌤️</div>
                  <h3 className="font-bold text-purple-800 mb-2">Weather</h3>
                  <p className="text-sm text-purple-700">Get accurate weather forecasts for each day and destination of your journey</p>
                </div>
                
                {/* Highlighted Budget Estimates Card with Dollar Sign */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border-2 border-orange-300 p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-orange-200 to-transparent rounded-bl-full"></div>
                  <div className="text-orange-600 text-2xl mb-2">💲</div>
                  <h3 className="font-bold text-orange-800 mb-2">Budget Estimates</h3>
                  <p className="text-sm text-orange-700">Budget your adventure with fuel costs, accommodations, and attraction fees</p>
                </div>
              </div>

              {/* NEW: Share & Export Features Banner */}
              <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 border-2 border-indigo-200 rounded-xl p-4 mb-6 shadow-lg">
                <h3 className="text-lg font-bold text-indigo-800 mb-3">📤 Share Your Adventure</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-indigo-100">
                    <Share2 className="h-5 w-5 text-indigo-600" />
                    <span className="text-sm font-medium text-indigo-700">Share Link</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-indigo-100">
                    <Calendar className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium text-red-700">Google Calendar</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-indigo-100">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">iPhone Calendar</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-indigo-100">
                    <Mail className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Email Trip</span>
                  </div>
                </div>
                <p className="text-sm text-indigo-600 mt-2">Plan your trip below and easily share it with friends or sync to your calendar!</p>
              </div>
            </div>
            
            {/* Trip Planner Container */}
            <div className="bg-white rounded-xl shadow-lg border border-route66-border p-4">
              <Route66TripCalculator />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCalculator;
