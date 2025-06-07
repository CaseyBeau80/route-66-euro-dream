
import React, { useState } from 'react';
import NavigationBar from '@/components/NavigationBar';
import Route66PlannerForm from '@/components/Route66Planner/Route66PlannerForm';
import PlannerResults from '@/components/Route66Planner/PlannerResults';
import { PlannerFormData, TripItinerary } from '@/components/Route66Planner/types';

const Route66Planner = () => {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "pt">("en");
  const [formData, setFormData] = useState<PlannerFormData>({
    startDate: '',
    startCity: '',
    endCity: '',
    planningType: 'duration',
    tripDuration: 7,
    dailyHours: 6,
    dailyMiles: 300
  });
  const [itinerary, setItinerary] = useState<TripItinerary | null>(null);
  const [isPlanning, setIsPlanning] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <NavigationBar language={language} setLanguage={setLanguage} />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-26 bg-white rounded-lg border-2 border-[#3b82f6] shadow-xl flex flex-col items-center justify-center">
                <div className="text-[#1e293b] text-xs font-semibold tracking-wider">ROUTE</div>
                <div className="text-[#3b82f6] text-2xl font-black leading-none">66</div>
                <div className="text-[#1e293b] text-[8px] font-medium">PLANNER</div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-[#1e293b] mb-4">
              Route 66 Travel Planner
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-6">
              Plan your perfect Mother Road journey with destination cities, attractions, and day-by-day itineraries
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Planning Form */}
            <div className="bg-white rounded-xl shadow-lg border border-[#e2e8f0] p-6">
              <Route66PlannerForm
                formData={formData}
                setFormData={setFormData}
                onPlan={setItinerary}
                isPlanning={isPlanning}
                setIsPlanning={setIsPlanning}
              />
            </div>

            {/* Results */}
            <div className="bg-white rounded-xl shadow-lg border border-[#e2e8f0] p-6">
              <PlannerResults 
                itinerary={itinerary}
                isPlanning={isPlanning}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Route66Planner;
