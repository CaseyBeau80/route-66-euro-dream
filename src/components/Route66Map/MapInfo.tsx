
import { Route, SignpostBig, MapPin } from "lucide-react";

interface MapInfoProps {
  selectedState: boolean;
}

const MapInfo = ({ selectedState }: MapInfoProps) => {
  return (
    <div className="text-center mt-6 space-y-2">
      <div className="flex items-center justify-center gap-2">
        <Route className="h-5 w-5 text-red-600" />
        <h3 className="text-lg font-medium">The Mother Road</h3>
        <SignpostBig className="h-5 w-5 text-red-600" />
      </div>
      <p className="text-gray-600">
        Historic Route 66 spans 2,448 miles from Chicago to Santa Monica,
        passing through Illinois, Missouri, Kansas, Oklahoma, Texas, New Mexico, Arizona, and California.
        {selectedState && <span className="font-semibold"> Click on states to see specific stops.</span>}
      </p>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-600"></div>
          <span className="text-xs">Route 66</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-red-600" />
          <span className="text-xs">Major Stops</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-route66-blue"></div>
          <span className="text-xs">Selected State</span>
        </div>
      </div>
    </div>
  );
};

export default MapInfo;
