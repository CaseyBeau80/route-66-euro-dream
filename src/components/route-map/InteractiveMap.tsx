
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
      <svg className="w-full h-full max-w-4xl mx-auto" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
        {/* Background grid */}
        <defs>
          <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#f0f0f0" strokeWidth="0.5" />
          </pattern>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <rect width="80" height="80" fill="url(#smallGrid)" />
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#e0e0e0" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Route 66 line */}
        <path 
          d="M380,100 C390,140 375,190 360,210 C345,230 350,260 380,280 C400,290 390,320 375,340 C360,360 380,400 410,420 C430,435 420,470 380,490 C350,510 320,520 250,520" 
          stroke="#D92121" 
          strokeWidth="8" 
          fill="none" 
          strokeDasharray="12,12" 
          strokeLinecap="round"
        />
        
        {/* State shapes */}
        <TooltipProvider>
          {Object.entries(route66States).map(([stateId, state]) => {
            // Scale the path coordinates for the larger viewBox
            const scaledPath = state.path.replace(/\d+(\.\d+)?/g, (match) => {
              return String(Number(match) * 2);
            });
            
            // Scale the position coordinates
            const scaledX = state.position.x * 2;
            const scaledY = state.position.y * 2;
            
            return (
              <Tooltip key={stateId}>
                <TooltipTrigger asChild>
                  <g
                    onClick={() => handleStateClick(stateId)}
                    onMouseEnter={() => setHoveredState(stateId)}
                    onMouseLeave={() => setHoveredState(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <path 
                      d={scaledPath}
                      fill={
                        selectedState === stateId
                          ? '#D92121' // Selected state
                          : hoveredState === stateId 
                            ? `${state.color}DD` // Hovered state (with transparency)
                            : `${state.color}AA` // Normal state (with more transparency)
                      }
                      stroke="#FFFFFF" 
                      strokeWidth="3"
                    />
                    <text 
                      x={scaledX} 
                      y={scaledY} 
                      textAnchor="middle" 
                      fill={selectedState === stateId ? "#FFFFFF" : "#333333"} 
                      fontSize="16" 
                      fontWeight={selectedState === stateId ? "bold" : "normal"}
                      className="select-none pointer-events-none"
                    >
                      {state.name}
                    </text>
                  </g>
                </TooltipTrigger>
                <TooltipContent className="bg-white px-3 py-2 shadow-lg border-2">
                  <div className="text-center">
                    <p className="font-semibold">{state.name}</p>
                    <p className="text-xs text-gray-500">Click for details</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
        
        {/* Cities markers */}
        <circle cx="380" cy="100" r="6" fill="#D92121" /> {/* Chicago */}
        <circle cx="250" cy="520" r="6" fill="#D92121" /> {/* Santa Monica */}
        
        {/* City labels */}
        <text x="380" y="85" textAnchor="middle" fill="#333" fontSize="14" fontWeight="bold">Chicago</text>
        <text x="250" y="545" textAnchor="middle" fill="#333" fontSize="14" fontWeight="bold">Santa Monica</text>
        
        {/* Route 66 Shield Logo */}
        <g transform="translate(480, 290)">
          <circle cx="0" cy="0" r="30" fill="white" stroke="#D92121" strokeWidth="2" />
          <circle cx="0" cy="0" r="25" fill="#D92121" />
          <text x="0" y="5" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" fontFamily="Arial">66</text>
        </g>
      </svg>
    </div>
  );
};
