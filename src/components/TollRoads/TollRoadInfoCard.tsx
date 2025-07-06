import { Card, CardContent } from "@/components/ui/card";
import { TollRoadSection } from "./types";
type TollRoadInfoCardProps = {
  section: TollRoadSection;
};
const TollRoadInfoCard = ({
  section
}: TollRoadInfoCardProps) => {
  return <Card className="bg-white/90 border-2 border-route66-primary/20 shadow-lg hover:shadow-xl transition-shadow">
      
    </Card>;
};
export default TollRoadInfoCard;