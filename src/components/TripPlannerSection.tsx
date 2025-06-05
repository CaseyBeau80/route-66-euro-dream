
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Route, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TripPlannerSection = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Route className="w-8 h-8" />,
      title: "Custom Routes",
      description: "Plan your perfect Route 66 journey with personalized stops and attractions"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Time Estimates", 
      description: "Get accurate travel times and duration estimates for your entire trip"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Must-See Stops",
      description: "Discover iconic landmarks, hidden gems, and authentic Route 66 experiences"
    },
    {
      icon: <Calculator className="w-8 h-8" />,
      title: "Cost Calculator",
      description: "Budget your adventure with fuel costs, accommodations, and attraction fees"
    }
  ];

  return (
    <section className="py-16 bg-route66-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 bg-route66-background-section p-8 rounded-xl shadow-2xl border-4 border-route66-primary">
          <h2 className="text-4xl font-route66 text-route66-primary mb-4 font-bold">Plan Your Route 66 Adventure</h2>
          <p className="text-xl text-route66-text-secondary max-w-3xl mx-auto font-semibold">
            Create your perfect Mother Road journey with our comprehensive trip planning tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-route66-background-section p-6 rounded-xl shadow-lg border-2 border-route66-border hover:border-route66-primary transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <div className="text-route66-primary mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-route66-text-primary mb-3 text-center">
                {feature.title}
              </h3>
              <p className="text-route66-text-secondary text-center leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={() => navigate('/trip-calculator')}
            className="bg-route66-primary hover:bg-route66-rust text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Start Planning Your Trip
          </Button>
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
    </section>
  );
};

export default TripPlannerSection;
