
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Check, AlertTriangle } from "lucide-react";
import { TollRoadLinks } from "./types";

type TollRoadLinksCardProps = {
  tollRoadLinks: TollRoadLinks;
};

const TollRoadLinksCard = ({ tollRoadLinks }: TollRoadLinksCardProps) => {
  return (
    <Card className="border-2 border-blue-500 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="text-center mb-5">
          <h3 className="text-2xl font-route66 text-blue-500 mb-2 font-bold uppercase">{tollRoadLinks.title}</h3>
          <p className="text-gray-700 max-w-3xl mx-auto text-sm leading-relaxed">{tollRoadLinks.subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {tollRoadLinks.links.map((link, index) => {
            const isAvoidable = link.tollStatus === 'avoidable';
            const borderColor = isAvoidable 
              ? 'border-amber-300 hover:border-amber-400' 
              : 'border-emerald-300 hover:border-emerald-400';
            const statusBg = isAvoidable 
              ? 'bg-amber-100 text-amber-800' 
              : 'bg-emerald-100 text-emerald-800';
            const statusIcon = isAvoidable 
              ? <AlertTriangle className="h-3 w-3" /> 
              : <Check className="h-3 w-3" />;
            const statusText = isAvoidable ? 'Avoidable' : 'Toll-Free Route';
            
            return (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group block bg-gray-50 p-4 rounded-xl border-2 ${borderColor} hover:bg-white transition-all duration-300 hover:shadow-md`}
              >
                {/* State Badge & Status */}
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-route66-primary text-white px-2.5 py-0.5 rounded-full font-route66 text-xs font-bold">
                    {link.stateAbbr}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${statusBg}`}>
                    {statusIcon}
                    <span>{statusText}</span>
                  </span>
                </div>
                
                {/* Link Name */}
                <div className="flex items-start gap-2 mb-2">
                  <ExternalLink className="h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors duration-300 mt-0.5 flex-shrink-0" />
                  <h4 className="text-sm font-route66 text-blue-500 group-hover:text-blue-600 transition-colors duration-300 uppercase font-bold">
                    {link.name}
                  </h4>
                </div>
                
                {/* Description */}
                <p className="text-gray-700 leading-relaxed text-xs mb-3">
                  {link.description}
                </p>
                
                {/* Transponder Badge */}
                <div className={`p-2 rounded-lg text-xs ${isAvoidable ? 'bg-amber-50 border border-amber-200' : 'bg-emerald-50 border border-emerald-200'}`}>
                  <span className="font-medium text-gray-700">📡 {link.transponderInfo}</span>
                </div>
              </a>
            );
          })}
        </div>
        
        {/* Enhanced Pro Tip */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-300 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🛣️</span>
            <div>
              <h4 className="font-route66 text-blue-600 font-bold uppercase text-sm mb-1">Pro Tip for Your 2026 Trip</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {tollRoadLinks.proTip}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TollRoadLinksCard;
