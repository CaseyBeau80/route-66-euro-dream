import { tollRoadsContent } from "./content";
import TollRoadInfoCard from "./TollRoadInfoCard";
import CostBreakdownCard from "./CostBreakdownCard";
import TollRoadLinksCard from "./TollRoadLinksCard";
import ChatBubble from "@/components/ui/chat-bubble";
import { CreditCard } from "lucide-react";
const TollRoads = () => {
  const content = tollRoadsContent.en; // Always use English
  return <section className="py-4 bg-blue-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-4 bg-white p-2 rounded-xl shadow-2xl border-4 border-route66-primary">
          <h2 className="text-4xl font-route66 text-route66-primary font-bold">{content.title}</h2>
        </div>
        
        {/* Main Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {content.sections.map((section, index) => <TollRoadInfoCard key={index} section={section} />)}
        </div>
        
        {/* Helpful Tips Chat Bubble */}
        <div className="mb-6">
          <ChatBubble 
            title="💡 Cashless Toll Tips" 
            icon={<CreditCard className="h-5 w-5" />}
          >
            <div className="space-y-3">
              <p>
                <strong>Most Route 66 toll roads are now cashless!</strong> Here's what you need to know:
              </p>
              
              <div className="bg-white/50 p-4 rounded-lg border border-route66-primary/20">
                <p className="font-medium text-route66-text-primary mb-2">
                  When you drive through a cashless toll, the system uses license plate recognition cameras to snap a photo of your car's plate. Then:
                </p>
                <div className="ml-4">
                  <p className="flex items-start">
                    <span className="mr-2">📨</span>
                    <span><strong>If it's your car:</strong> A bill is mailed to the registered owner's address (usually within 30–45 days).</span>
                  </p>
                </div>
              </div>
              
              <ul className="space-y-2 ml-4">
                <li className="flex items-start">
                  <span className="text-route66-primary mr-2">•</span>
                  <span><strong>Payment methods:</strong> License plate billing, E-ZPass, or mobile apps</span>
                </li>
                <li className="flex items-start">
                  <span className="text-route66-primary mr-2">•</span>
                  <span><strong>Rental cars:</strong> Check if your rental company handles tolls automatically</span>
                </li>
                <li className="flex items-start">
                  <span className="text-route66-primary mr-2">•</span>
                  <span><strong>Avoid violations:</strong> Sign up for toll transponders or apps before your trip</span>
                </li>
                <li className="flex items-start">
                  <span className="text-route66-primary mr-2">•</span>
                  <span><strong>Multiple states:</strong> Different states use different systems - plan accordingly!</span>
                </li>
              </ul>
            </div>
          </ChatBubble>
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