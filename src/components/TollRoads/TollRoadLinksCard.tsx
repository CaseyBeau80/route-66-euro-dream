
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { TollRoadLinks } from "./types";

type TollRoadLinksCardProps = {
  tollRoadLinks: TollRoadLinks;
};

const TollRoadLinksCard = ({ tollRoadLinks }: TollRoadLinksCardProps) => {
  return (
    <Card className="border-4 border-route66-red bg-white shadow-2xl hover:shadow-3xl transition-all duration-300">
      <CardContent className="p-10">
        <div className="text-center mb-8">
          <h3 className="text-4xl font-route66 text-route66-red mb-4 font-bold">{tollRoadLinks.title}</h3>
          <p className="text-gray-900 max-w-3xl mx-auto text-xl font-semibold leading-relaxed">{tollRoadLinks.subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tollRoadLinks.links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-route66-cream p-6 rounded-xl border-4 border-route66-vintage-brown hover:border-route66-orange hover:bg-white transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <ExternalLink className="h-6 w-6 text-route66-red group-hover:text-route66-orange transition-colors duration-300" />
                </div>
                <div>
                  <h4 className="text-xl font-route66 text-route66-red group-hover:text-route66-orange mb-2 transition-colors duration-300">
                    {link.name}
                  </h4>
                  <p className="text-gray-800 font-travel leading-relaxed">
                    {link.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
        
        <div className="mt-8 p-6 bg-route66-vintage-yellow rounded-xl border-4 border-route66-red shadow-lg">
          <p className="text-base text-route66-navy font-semibold leading-relaxed text-center">
            💡 <strong>Pro Tip:</strong> Check these official websites for the most current toll rates, payment options, and any construction updates that might affect your Route 66 journey.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TollRoadLinksCard;
