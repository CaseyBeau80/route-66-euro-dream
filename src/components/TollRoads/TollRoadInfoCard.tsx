
import { Card, CardContent } from "@/components/ui/card";
import { TollRoadSection } from "./types";

type TollRoadInfoCardProps = {
  section: TollRoadSection;
};

const TollRoadInfoCard = ({ section }: TollRoadInfoCardProps) => {
  return (
    <Card className="border-2 border-route66-red/20 shadow-lg h-full bg-white hover:shadow-xl transition-all duration-300 hover:border-route66-red">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1 p-3 bg-route66-red/10 rounded-lg border border-route66-red/20">
            {section.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-route66-blue mb-3">{section.title}</h3>
            <p className="text-gray-700 leading-relaxed font-medium">{section.content}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TollRoadInfoCard;
