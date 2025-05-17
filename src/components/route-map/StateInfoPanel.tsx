
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { StateInfo } from "@/types/StateInfo";

type StateInfoPanelProps = {
  selectedState: string | null;
  setSelectedState: (stateId: string | null) => void;
  stateInfo: StateInfo;
  content: {
    stateExplore: string;
    stateAttractions: string;
  };
};

export const StateInfoPanel = ({ 
  selectedState, 
  setSelectedState, 
  stateInfo, 
  content 
}: StateInfoPanelProps) => {
  if (!selectedState) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-4 backdrop-blur-sm border-t border-route66-gray/10">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-route66 text-xl text-route66-red">
            {stateInfo.name}
          </h3>
          <p className="text-route66-gray text-sm mb-2">
            {stateInfo.description}
          </p>
          <div>
            <span className="text-xs font-medium text-route66-gray/80">{content.stateAttractions}</span>
            <ul className="text-sm flex flex-wrap gap-2 mt-1">
              {stateInfo.attractions.map((attraction, idx) => (
                <li key={idx} className="inline-flex items-center bg-route66-cream/50 px-2 py-1 rounded">
                  <MapPin size={12} className="mr-1 text-route66-red" />
                  {attraction}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Button
          size="sm"
          className="bg-route66-red text-white hover:bg-route66-red/90"
        >
          {content.stateExplore}
        </Button>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        className="absolute top-2 right-2 text-route66-gray/60 hover:text-route66-gray"
        onClick={() => setSelectedState(null)}
      >
        &times;
      </Button>
    </div>
  );
};
