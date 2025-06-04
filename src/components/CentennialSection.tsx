
import Route66Countdown from "./Route66Countdown";
import Route66FunFacts from "./Route66Countdown/Route66FunFacts";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Route } from "lucide-react";

const CentennialSection = () => {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-br from-route66-background-section via-route66-background-alt to-route66-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-route66-accent-orange/10 text-route66-accent-orange px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Route className="w-4 h-4" />
            Centennial Celebration
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-route66-text-primary mb-6">
            100 Years of Adventure
          </h2>
          <p className="text-xl text-route66-text-secondary max-w-3xl mx-auto leading-relaxed">
            Join us in celebrating a century of America's most beloved highway
          </p>
        </div>

        {/* Desktop Three-Column Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
          {/* Left Column - Fun Facts */}
          <div className="lg:col-span-3">
            <Route66FunFacts />
          </div>
          
          {/* Center Column - Countdown */}
          <div className="lg:col-span-6">
            <Route66Countdown />
          </div>
          
          {/* Right Column - Trip Planning */}
          <div className="lg:col-span-3">
            <div className="p-8 rounded-2xl bg-route66-background border border-route66-border shadow-xl">
              <h3 className="text-2xl font-bold text-route66-text-primary mb-6 text-center">
                Plan Your Journey
              </h3>
              <div className="space-y-6 text-center">
                <p className="text-route66-text-secondary leading-relaxed">
                  Ready to hit the road? Use our comprehensive trip calculator to plan your perfect Route 66 adventure.
                </p>
                <Link to="/trip-calculator">
                  <Button className="w-full bg-route66-primary hover:bg-route66-primary-dark text-white border-0 font-semibold py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Start Planning
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Responsive Layout */}
        <div className="lg:hidden space-y-12">
          {/* Countdown First on Mobile */}
          <div>
            <Route66Countdown />
          </div>
          
          {/* Two-column grid for Fun Facts and Trip Planning on tablets */}
          <div className="grid md:grid-cols-2 gap-8">
            <Route66FunFacts />
            <div className="p-8 rounded-2xl bg-route66-background border border-route66-border shadow-xl">
              <h3 className="text-2xl font-bold text-route66-text-primary mb-6 text-center">
                Plan Your Journey
              </h3>
              <div className="space-y-6 text-center">
                <p className="text-route66-text-secondary leading-relaxed">
                  Ready to hit the road? Use our comprehensive trip calculator to plan your perfect Route 66 adventure.
                </p>
                <Link to="/trip-calculator">
                  <Button className="w-full bg-route66-primary hover:bg-route66-primary-dark text-white border-0 font-semibold py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Start Planning
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CentennialSection;
