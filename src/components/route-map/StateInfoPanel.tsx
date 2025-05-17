
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, X } from "lucide-react";
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
    <div className="absolute bottom-0 left-0 right-0 bg-white/95 p-6 backdrop-blur-md border-t-2 border-route66-blue/20 shadow-lg">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-route66-blue rounded-full flex items-center justify-center mr-3">
                <MapPin size={16} className="text-white" />
              </div>
              <h3 className="font-route66 text-2xl text-route66-red">
                {stateInfo.name}
              </h3>
            </div>
            
            <p className="text-route66-gray text-base mb-4 max-w-2xl">
              {stateInfo.description}
            </p>
            
            <div>
              <span className="text-sm font-medium text-route66-blue mb-2 block">{content.stateAttractions}</span>
              <ul className="text-sm flex flex-wrap gap-2">
                {stateInfo.attractions.map((attraction, idx) => (
                  <li key={idx} className="inline-flex items-center bg-route66-cream/70 px-3 py-2 rounded-full">
                    <MapPin size={14} className="mr-1 text-route66-red" />
                    {attraction}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <Button
            size="lg"
            className="bg-route66-blue text-white hover:bg-route66-blue/90 flex items-center gap-2"
          >
            {content.stateExplore}
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-3 right-3 text-route66-gray/60 hover:text-route66-gray hover:bg-gray-100 rounded-full"
        onClick={() => setSelectedState(null)}
      >
        <X size={18} />
      </Button>
    </div>
  );
};
