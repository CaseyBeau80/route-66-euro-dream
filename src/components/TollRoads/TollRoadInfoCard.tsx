
import { Card, CardContent } from "@/components/ui/card";
import { TollRoadSection } from "./types";

type TollRoadInfoCardProps = {
  section: TollRoadSection;
};

const TollRoadInfoCard = ({ section }: TollRoadInfoCardProps) => {
  return (
    <Card className="border-2 border-blue-500 shadow-lg h-full bg-white hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1 p-3 bg-blue-500 rounded-lg shadow-md">
            <div className="text-white text-xl">
              {section.icon}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 font-route66 uppercase">{section.title}</h3>
            <p className="text-gray-700 leading-relaxed text-base">{section.content}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TollRoadInfoCard;
