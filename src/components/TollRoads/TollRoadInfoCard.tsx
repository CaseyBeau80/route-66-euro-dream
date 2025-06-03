
import { Card, CardContent } from "@/components/ui/card";
import { TollRoadSection } from "./types";

type TollRoadInfoCardProps = {
  section: TollRoadSection;
};

const TollRoadInfoCard = ({ section }: TollRoadInfoCardProps) => {
  return (
    <Card className="border-4 border-route66-red shadow-2xl h-full bg-white hover:shadow-3xl transition-all duration-300 hover:border-route66-orange">
      <CardContent className="p-8">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0 mt-1 p-4 bg-route66-red rounded-xl border-3 border-route66-vintage-brown shadow-lg">
            <div className="text-white text-2xl">
              {section.icon}
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-route66">{section.title}</h3>
            <p className="text-gray-800 leading-relaxed font-semibold text-lg">{section.content}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TollRoadInfoCard;
