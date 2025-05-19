
import { route66Towns } from "@/types/route66";
import { Route66Town } from "@/types/route66";

interface TownsListProps {
  towns: Route66Town[];
}

const TownsList = ({ towns }: TownsListProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
      {towns.map((town, index) => (
        <div key={index} className="flex items-center gap-1">
          <span className="text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
              <path d="M2 12h20"/>
            </svg>
          </span>
          <span>{town.name}</span>
        </div>
      ))}
    </div>
  );
};

export default TownsList;
