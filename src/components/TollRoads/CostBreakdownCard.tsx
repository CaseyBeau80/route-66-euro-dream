
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { EstimatedCosts } from "./types";

type CostBreakdownCardProps = {
  estimatedCosts: EstimatedCosts;
};

const CostBreakdownCard = ({ estimatedCosts }: CostBreakdownCardProps) => {
  return (
    <Card className="border-2 border-route66-primary bg-white shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-10">
        <div className="text-center mb-8">
          <h3 className="text-4xl font-route66 text-route66-primary mb-6 font-bold">{estimatedCosts.title}</h3>
          <p className="text-route66-text-secondary max-w-3xl mx-auto text-xl font-semibold leading-relaxed">{estimatedCosts.description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {estimatedCosts.details.map((detail, index) => (
            <div key={index} className="bg-route66-primary p-6 rounded-xl shadow-lg border-2 border-route66-primary-dark hover:bg-route66-primary-dark transition-colors duration-300">
              <p className="text-base font-bold text-white text-center leading-relaxed">{detail}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-6 bg-route66-accent-gold rounded-xl border-2 border-route66-primary shadow-lg">
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
