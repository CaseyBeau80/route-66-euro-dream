
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { EstimatedCosts } from "./types";

type CostBreakdownCardProps = {
  estimatedCosts: EstimatedCosts;
};

const CostBreakdownCard = ({ estimatedCosts }: CostBreakdownCardProps) => {
  return (
    <Card className="border-4 border-route66-red bg-white shadow-2xl">
      <CardContent className="p-10">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-route66 text-route66-red mb-6 font-bold">{estimatedCosts.title}</h3>
          <p className="text-gray-800 max-w-3xl mx-auto text-xl font-semibold">{estimatedCosts.description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {estimatedCosts.details.map((detail, index) => (
            <div key={index} className="bg-route66-vintage-yellow p-6 rounded-xl shadow-lg border-3 border-route66-red">
              <p className="text-base font-bold text-gray-900 text-center">{detail}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-6 bg-amber-50 border-3 border-amber-500 rounded-xl">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
            <p className="text-base text-amber-900 font-semibold">
              <strong>Note:</strong> Toll costs can vary based on time of day, vehicle size, and payment method. Always check current rates before traveling.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostBreakdownCard;
