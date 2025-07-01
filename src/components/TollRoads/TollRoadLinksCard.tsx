
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { TollRoadLinks } from "./types";

type TollRoadLinksCardProps = {
  tollRoadLinks: TollRoadLinks;
};

const TollRoadLinksCard = ({ tollRoadLinks }: TollRoadLinksCardProps) => {
  return (
    <Card className="border-2 border-blue-500 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <h3 className="text-3xl font-route66 text-blue-500 mb-3 font-bold uppercase">{tollRoadLinks.title}</h3>
          <p className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed">{tollRoadLinks.subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tollRoadLinks.links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-gray-50 p-5 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-white transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <ExternalLink className="h-5 w-5 text-blue-500 group-hover:text-blue-600 transition-colors duration-300" />
                </div>
                <div>
                  <h4 className="text-lg font-route66 text-blue-500 group-hover:text-blue-600 mb-2 transition-colors duration-300 uppercase font-bold">
                    {link.name}
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {link.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200 shadow-sm">
          <p className="text-sm text-gray-700 leading-relaxed text-center">
            💡 <strong>Pro Tip:</strong> Check these official websites for the most current toll rates, payment options, and any construction updates that might affect your Route 66 journey.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TollRoadLinksCard;
