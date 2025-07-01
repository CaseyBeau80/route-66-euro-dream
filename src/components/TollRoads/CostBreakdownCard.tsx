import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { EstimatedCosts } from "./types";

type CostBreakdownCardProps = {
  estimatedCosts: EstimatedCosts;
};

const CostBreakdownCard = ({ estimatedCosts }: CostBreakdownCardProps) => {
  return (
    <Card className="border-2 border-red-500 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="text-center">
          <h3 className="text-2xl font-route66 text-red-500 mb-4 font-bold uppercase">{estimatedCosts.title}</h3>
          <p className="text-gray-700 mb-6">{estimatedCosts.description}</p>
          <div className="space-y-3">
            {estimatedCosts.details.map((detail, index) => (
              <div key={index} className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="text-base text-gray-700">{detail}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostBreakdownCard;