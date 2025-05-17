
import { 
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Route66StatesType } from "@/types/StateInfo";

type InteractiveMapProps = {
  route66States: Route66StatesType;
  selectedState: string | null;
  hoveredState: string | null;
  handleStateClick: (stateId: string) => void;
  setHoveredState: (stateId: string | null) => void;
};

export const InteractiveMap = ({ 
  route66States, 
  selectedState, 
  hoveredState,
  handleStateClick,
  setHoveredState 
}: InteractiveMapProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg className="w-full h-full max-w-3xl" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
        {/* Route 66 line */}
        <path 
          d="M175,130 C180,160 170,190 160,200 C150,210 155,230 175,240 C185,245 180,260 170,270 C160,285 170,310 185,320 C195,330 190,360 175,380 C160,400 140,410 110,410" 
          stroke="#D92121" 
          strokeWidth="6" 
          fill="none" 
          strokeDasharray="10,10" 
          strokeLinecap="round"
        />
        
        {/* State shapes */}
        <TooltipProvider>
          {Object.entries(route66States).map(([stateId, state]) => (
            <Tooltip key={stateId}>
              <TooltipTrigger asChild>
                <g
                  onClick={() => handleStateClick(stateId)}
                  onMouseEnter={() => setHoveredState(stateId)}
                  onMouseLeave={() => setHoveredState(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <path 
                    d={state.path} 
                    fill={
                      selectedState === stateId
                        ? '#D92121' // Selected state
                        : hoveredState === stateId 
                          ? `${state.color}CC` // Hovered state (with transparency)
                          : `${state.color}88` // Normal state (with more transparency)
                    }
                    stroke="#FFF" 
                    strokeWidth="2"
                  />
                  <text 
                    x={state.position.x} 
                    y={state.position.y} 
                    textAnchor="middle" 
                    fill={selectedState === stateId ? "#FFF" : "#333"} 
                    fontSize="12" 
                    fontWeight={selectedState === stateId ? "bold" : "normal"}
                  >
                    {state.name}
                  </text>
                </g>
              </TooltipTrigger>
              <TooltipContent>{state.name}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
        
        {/* Cities markers */}
        <circle cx="175" cy="130" r="4" fill="#D92121" /> {/* Chicago */}
        <circle cx="110" cy="410" r="4" fill="#D92121" /> {/* Santa Monica */}
        
        {/* City labels */}
        <text x="175" y="120" textAnchor="middle" fill="#333" fontSize="10">Chicago</text>
        <text x="110" y="425" textAnchor="middle" fill="#333" fontSize="10">Santa Monica</text>
      </svg>
    </div>
  );
};
