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
        <div className="text-center mb-4 bg-route66-background-alt p-4 rounded-xl shadow-lg border-2 border-blue-500">
          <h2 className="text-2xl font-route66 text-blue-500 mb-2 font-bold">{content.title}</h2>
          
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