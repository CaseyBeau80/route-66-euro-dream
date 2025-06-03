
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { EstimatedCosts } from "./types";

type CostBreakdownCardProps = {
  estimatedCosts: EstimatedCosts;
};

const CostBreakdownCard = ({ estimatedCosts }: CostBreakdownCardProps) => {
  return (
    <Card className="border-4 border-route66-red bg-white shadow-2xl hover:shadow-3xl transition-all duration-300">
      <CardContent className="p-10">
        <div className="text-center mb-8">
          <h3 className="text-4xl font-route66 text-route66-red mb-6 font-bold">{estimatedCosts.title}</h3>
          <p className="text-gray-900 max-w-3xl mx-auto text-xl font-semibold leading-relaxed">{estimatedCosts.description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {estimatedCosts.details.map((detail, index) => (
            <div key={index} className="bg-route66-red p-6 rounded-xl shadow-xl border-4 border-route66-vintage-brown hover:bg-route66-orange transition-colors duration-300">
              <p className="text-base font-bold text-white text-center leading-relaxed">{detail}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-6 bg-route66-orange rounded-xl border-4 border-route66-red shadow-lg">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-white flex-shrink-0 mt-1" />
            <p className="text-base text-white font-semibold leading-relaxed">
              <strong>Note:</strong> Toll costs can vary based on time of day, vehicle size, and payment method. Always check current rates before traveling.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostBreakdownCard;
