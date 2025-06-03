
import { Card, CardContent } from "@/components/ui/card";
import { TollRoadSection } from "./types";

type TollRoadInfoCardProps = {
  section: TollRoadSection;
};

const TollRoadInfoCard = ({ section }: TollRoadInfoCardProps) => {
  return (
    <Card className="border-2 border-route66-vintage-yellow/30 shadow-lg h-full bg-white hover:shadow-xl transition-all duration-300 hover:border-route66-vintage-yellow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1 p-2 bg-route66-cream rounded-lg">
            {section.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-route66-blue mb-3">{section.title}</h3>
            <p className="text-route66-gray leading-relaxed">{section.content}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TollRoadInfoCard;
