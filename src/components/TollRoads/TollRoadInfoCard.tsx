import { Card, CardContent } from "@/components/ui/card";
import { TollRoadSection } from "./types";
import { Check, AlertTriangle } from "lucide-react";

type TollRoadInfoCardProps = {
  section: TollRoadSection;
};

const TollRoadInfoCard = ({ section }: TollRoadInfoCardProps) => {
  const isAvoidable = section.tollStatus === 'avoidable';
  const isFree = section.tollStatus === 'free';
  
  const borderColor = isAvoidable 
    ? 'border-amber-400 hover:border-amber-500' 
    : 'border-emerald-400 hover:border-emerald-500';
  
  const statusBgColor = isAvoidable 
    ? 'bg-amber-100 text-amber-800' 
    : 'bg-emerald-100 text-emerald-800';
  
  const statusIcon = isAvoidable 
    ? <AlertTriangle className="h-4 w-4" /> 
    : <Check className="h-4 w-4" />;
  
  const statusText = isAvoidable ? '💲 Avoidable Toll' : '🛣️ Toll-Free';

  return (
    <Card className={`bg-white border-3 ${borderColor} shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden`}>
      {/* State Badge */}
      <div className="absolute top-3 right-3 bg-route66-primary text-white px-3 py-1 rounded-full font-route66 text-sm font-bold">
        {section.stateAbbr}
      </div>
      
      <CardContent className="p-5 pt-4">
        {/* Status Badge */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 ${statusBgColor}`}>
          {statusIcon}
          <span>{statusText}</span>
        </div>
        
        {/* Title with Icon */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`p-2 rounded-lg ${isAvoidable ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
            {section.icon}
          </div>
          <h3 className="text-lg font-route66 text-route66-text-primary font-bold uppercase">
            {section.title}
          </h3>
        </div>
        
        {/* Content */}
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          {section.content}
        </p>
        
        {/* Transponder Info Box */}
        <div className={`p-3 rounded-lg border-2 mb-3 ${isAvoidable ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
          <p className="text-xs font-semibold text-gray-800">
            📡 Transponder: <span className={isAvoidable ? 'text-amber-700' : 'text-emerald-700'}>{section.transponderInfo}</span>
          </p>
        </div>
        
        {/* Avoidance Tip */}
        {section.avoidanceTip && (
          <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-sm">💡</span>
            <p className="text-xs text-blue-800 font-medium">{section.avoidanceTip}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TollRoadInfoCard;
