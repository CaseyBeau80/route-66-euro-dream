
import { tollRoadsContent } from "./content";
import { TollRoadsProps } from "./types";
import TollRoadInfoCard from "./TollRoadInfoCard";
import CostBreakdownCard from "./CostBreakdownCard";
import TollRoadLinksCard from "./TollRoadLinksCard";

const TollRoads = ({ language }: TollRoadsProps) => {
  const content = tollRoadsContent[language as keyof typeof tollRoadsContent] || tollRoadsContent.en;
  
  return (
    <section className="py-8 bg-route66-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 bg-route66-background-alt p-6 rounded-xl shadow-lg border-2 border-route66-primary">
          <h2 className="text-3xl font-route66 text-route66-primary mb-3 font-bold">{content.title}</h2>
          <p className="text-route66-text-secondary max-w-2xl mx-auto text-lg font-medium">{content.subtitle}</p>
        </div>
        
        {/* Main Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {content.sections.map((section, index) => (
            <TollRoadInfoCard key={index} section={section} />
          ))}
        </div>
        
        {/* Cost Breakdown Card */}
        <div className="mb-8">
          <CostBreakdownCard estimatedCosts={content.estimatedCosts} />
        </div>
        
        {/* Toll Road Links Card */}
        <TollRoadLinksCard tollRoadLinks={content.tollRoadLinks} />
      </div>
    </section>
  );
};

export default TollRoads;
