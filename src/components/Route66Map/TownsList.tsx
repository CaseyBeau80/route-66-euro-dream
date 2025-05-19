
import { Route66Town } from "@/types/route66";
import { Globe } from "lucide-react";

interface TownsListProps {
  towns: Route66Town[];
  className?: string;
}

const TownsList = ({ towns, className = "" }: TownsListProps) => {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 bg-white/90 p-3 rounded-lg text-sm shadow-md ${className}`}>
      {towns.map((town, index) => (
        <div key={index} className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-red-600 flex-shrink-0" />
          <span className="truncate font-medium">{town.name}</span>
        </div>
      ))}
    </div>
  );
};

export default TownsList;
