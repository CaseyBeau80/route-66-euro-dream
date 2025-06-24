
import { useState, useEffect } from "react";
import NavigationBar from "@/components/NavigationBar";
import Route66TripCalculator from "@/components/Route66TripCalculator";
import Route66Map from "@/components/Route66Map";
import { Share2, Calendar, Mail } from "lucide-react";

const TripCalculator = () => {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "pt-BR">("en");
  
  useEffect(() => {
    console.log('🚗 TripCalculator page mounted with split-screen layout');

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
      
      {/* Split-Screen Layout */}
      <div className="pt-16 h-screen overflow-hidden">
        <div className="flex h-full">
          {/* Left Side - Interactive Map */}
          <div className="w-1/2 h-full border-r border-route66-border bg-white">
            <div className="h-full relative">
              {/* Map Header */}
              <div className="absolute top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm border-b border-route66-border p-4">
                <h2 className="text-xl font-bold text-route66-primary mb-1">
                  Interactive Route 66 Map
                </h2>
                <p className="text-sm text-route66-text-secondary">
                  Explore destinations, attractions, and plan your route
                </p>
              </div>
              
              {/* Map Content */}
              <div className="pt-20 h-full">
                <Route66Map />
              </div>
            </div>
          </div>
          
          {/* Right Side - Trip Planner Form */}
          <div className="w-1/2 h-full bg-white overflow-y-auto">
            <div className="p-6">
              {/* Header Section */}
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-route66-primary mb-2">
                  Plan Your Route 66 Adventure
                </h1>
                <p className="text-route66-text-secondary mb-4">
                  Create your perfect heritage cities journey
                </p>

                {/* Share & Export Features Banner */}
                <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 border-2 border-indigo-200 rounded-xl p-4 mb-4 shadow-sm">
                  <h3 className="text-sm font-bold text-indigo-800 mb-2">📤 Share Your Adventure</h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded text-xs border border-indigo-100">
                      <Share2 className="h-3 w-3 text-indigo-600" />
                      <span className="text-indigo-700">Share</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded text-xs border border-indigo-100">
                      <Calendar className="h-3 w-3 text-red-600" />
                      <span className="text-red-700">Google Cal</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded text-xs border border-indigo-100">
                      <Calendar className="h-3 w-3 text-blue-600" />
                      <span className="text-blue-700">iPhone Cal</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded text-xs border border-indigo-100">
                      <Mail className="h-3 w-3 text-green-600" />
                      <span className="text-green-700">Email</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Trip Calculator Component */}
              <Route66TripCalculator />
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Warning Overlay */}
      <div className="md:hidden fixed inset-0 bg-route66-primary/95 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 text-center max-w-sm mx-auto">
          <h3 className="text-lg font-bold text-route66-primary mb-2">
            Desktop Experience Required
          </h3>
          <p className="text-route66-text-secondary text-sm mb-4">
            The split-screen trip planner is optimized for desktop and tablet devices. Please use a larger screen for the best experience.
          </p>
          <a 
            href="/" 
            className="inline-block bg-route66-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-route66-primary/90 transition-colors"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    </div>
  );
};

export default TripCalculator;
