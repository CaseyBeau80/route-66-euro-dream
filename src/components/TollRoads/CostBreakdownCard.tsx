import { Card, CardContent } from "@/components/ui/card";
import { Check, DollarSign } from "lucide-react";
import { EstimatedCosts } from "./types";

type CostBreakdownCardProps = {
  estimatedCosts: EstimatedCosts;
};

const CostBreakdownCard = ({ estimatedCosts }: CostBreakdownCardProps) => {
  return (
    <Card className="border-2 border-emerald-400 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        {/* Header */}
        <div className="text-center mb-5">
          <h3 className="text-2xl font-route66 text-route66-primary mb-2 font-bold uppercase">
            {estimatedCosts.title}
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed max-w-2xl mx-auto">
            {estimatedCosts.description}
          </p>
        </div>
        
        {/* FREE Route Highlight */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-xl mb-5 text-center shadow-md">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Check className="h-6 w-6" />
            <span className="text-xl font-route66 font-bold uppercase">Historic Route 66</span>
          </div>
          <p className="text-2xl font-bold">FREE</p>
          <p className="text-emerald-100 text-sm mt-1">Follow original alignments for zero toll costs</p>
        </div>
        
        {/* Optional Toll Costs */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3 text-center">
            If You Take Modern Interstates (Optional)
          </h4>
          <div className="space-y-2">
            {estimatedCosts.details.map((detail, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-gray-700">{detail.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">{detail.cost}</span>
                  {detail.avoidable && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      Avoidable
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Avoidance Tip */}
        <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200 text-center">
          <p className="text-blue-800 font-medium text-sm">
            🛣️ <strong>Pro Tip:</strong> {estimatedCosts.avoidanceTip}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostBreakdownCard;
