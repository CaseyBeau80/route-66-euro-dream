
import { tollRoadsContent } from "./content";
import { TollRoadsProps } from "./types";
import TollRoadInfoCard from "./TollRoadInfoCard";
import CostBreakdownCard from "./CostBreakdownCard";

const TollRoads = ({ language }: TollRoadsProps) => {
  const content = tollRoadsContent[language as keyof typeof tollRoadsContent] || tollRoadsContent.en;
  
  return (
    <section className="py-16 bg-gradient-to-br from-route66-cream to-route66-tan">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-route66 text-route66-red mb-4">{content.title}</h2>
          <p className="text-route66-gray max-w-2xl mx-auto text-lg">{content.subtitle}</p>
        </div>
        
        {/* Main Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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
