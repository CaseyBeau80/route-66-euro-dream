import { Card, CardContent } from "@/components/ui/card";
import { TollRoadSection } from "./types";
type TollRoadInfoCardProps = {
  section: TollRoadSection;
};
const TollRoadInfoCard = ({
  section
}: TollRoadInfoCardProps) => {
  return (
    <Card className="bg-white/90 border-2 border-route66-primary/20 shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-route66-primary/10 rounded-full flex items-center justify-center">
            {section.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-route66-text-primary mb-3">
              {section.title}
            </h3>
            <p className="text-route66-text-secondary leading-relaxed">
              {section.content}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default TollRoadInfoCard;