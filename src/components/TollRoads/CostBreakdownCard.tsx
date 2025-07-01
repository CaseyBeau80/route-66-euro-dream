import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { EstimatedCosts } from "./types";
type CostBreakdownCardProps = {
  estimatedCosts: EstimatedCosts;
};
const CostBreakdownCard = ({
  estimatedCosts
}: CostBreakdownCardProps) => {
  return <Card className="border-4 border-route66-red bg-white shadow-2xl hover:shadow-3xl transition-all duration-300">
      
    </Card>;
};
export default CostBreakdownCard;