
import { tollRoadsContent } from "./content";
import { TollRoadsProps } from "./types";
import TollRoadInfoCard from "./TollRoadInfoCard";
import CostBreakdownCard from "./CostBreakdownCard";

const TollRoads = ({ language }: TollRoadsProps) => {
  const content = tollRoadsContent[language as keyof typeof tollRoadsContent] || tollRoadsContent.en;
  
  return (
    <section className="py-16 bg-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 bg-white p-8 rounded-xl shadow-2xl border-4 border-route66-red">
          <h2 className="text-4xl font-route66 text-route66-red mb-4 font-bold">{content.title}</h2>
          <p className="text-gray-900 max-w-2xl mx-auto text-xl font-semibold">{content.subtitle}</p>
        </div>
        
        {/* Main Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
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
