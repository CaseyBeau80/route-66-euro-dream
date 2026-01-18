import { tollRoadsContent } from "./content";
import TollRoadInfoCard from "./TollRoadInfoCard";
import CostBreakdownCard from "./CostBreakdownCard";
import { Route } from "lucide-react";

const TollRoads = () => {
  const content = tollRoadsContent.en;
  
  return (
    <section className="py-6 bg-blue-900">
      <div className="container mx-auto px-4">
        {/* Header with Retro Route 66 Styling */}
        <div className="flex items-center justify-center mb-5 bg-white p-3 rounded-xl shadow-2xl border-4 border-route66-primary">
          <Route className="h-8 w-8 text-route66-primary mr-3" />
          <h2 className="text-2xl md:text-3xl font-route66 text-route66-primary font-bold text-center">
            {content.title}
          </h2>
        </div>
        
        {/* Intro Callout Box */}
        <div className="mb-6 p-5 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border-2 border-emerald-300 shadow-md">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🛣️</span>
            <div>
              <h3 className="font-route66 text-emerald-700 font-bold uppercase text-lg mb-2">
                Good News: Historic Route 66 is Mostly Toll-Free!
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                {content.introText}
              </p>
            </div>
          </div>
        </div>
        
        {/* Main Information Cards - 3 Focused Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {content.sections.map((section, index) => (
            <TollRoadInfoCard key={index} section={section} />
          ))}
        </div>
        
        {/* Cost Breakdown Card */}
        <CostBreakdownCard estimatedCosts={content.estimatedCosts} />
      </div>
    </section>
  );
};

export default TollRoads;
