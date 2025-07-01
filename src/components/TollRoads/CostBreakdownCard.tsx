import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { EstimatedCosts } from "./types";
type CostBreakdownCardProps = {
  estimatedCosts: EstimatedCosts;
};
const CostBreakdownCard = ({
  estimatedCosts
}: CostBreakdownCardProps) => {
  return <Card className="border-2 border-red-500 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
      
    </Card>;
};
export default CostBreakdownCard;