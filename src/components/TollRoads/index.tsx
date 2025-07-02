import { tollRoadsContent } from "./content";
import { TollRoadsProps } from "./types";
import TollRoadInfoCard from "./TollRoadInfoCard";
import CostBreakdownCard from "./CostBreakdownCard";
import TollRoadLinksCard from "./TollRoadLinksCard";
const TollRoads = ({
  language
}: TollRoadsProps) => {
  const content = tollRoadsContent[language as keyof typeof tollRoadsContent] || tollRoadsContent.en;
  return <section className="py-4 bg-route66-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-4 bg-white p-2 rounded-xl shadow-2xl border-4 border-route66-primary">
          <h2 className="text-4xl font-route66 text-route66-primary font-bold">{content.title}</h2>
        </div>
        
        {/* Main Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {content.sections.map((section, index) => <TollRoadInfoCard key={index} section={section} />)}
        </div>
        
        {/* Cost Breakdown Card */}
        <div className="mb-4">
          <CostBreakdownCard estimatedCosts={content.estimatedCosts} />
        </div>
        
        {/* Toll Road Links Card */}
        <TollRoadLinksCard tollRoadLinks={content.tollRoadLinks} />
      </div>
    </section>;
};
export default TollRoads;