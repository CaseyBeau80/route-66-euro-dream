
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { EstimatedCosts } from "./types";

type CostBreakdownCardProps = {
  estimatedCosts: EstimatedCosts;
};

const CostBreakdownCard = ({ estimatedCosts }: CostBreakdownCardProps) => {
  return (
    <Card className="border-4 border-route66-red bg-gradient-to-br from-white to-route66-cream shadow-xl">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-route66 text-route66-red mb-4">{estimatedCosts.title}</h3>
          <p className="text-route66-gray max-w-3xl mx-auto text-lg">{estimatedCosts.description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {estimatedCosts.details.map((detail, index) => (
            <div key={index} className="bg-route66-vintage-yellow p-4 rounded-lg shadow-md border-2 border-route66-red">
              <p className="text-sm font-bold text-route66-blue text-center">{detail}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-amber-100 border-2 border-amber-400 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 font-medium">
              <strong>Note:</strong> Toll costs can vary based on time of day, vehicle size, and payment method. Always check current rates before traveling.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostBreakdownCard;
