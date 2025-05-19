
import React from "react";
import { Route66Town } from "@/types/route66";

interface TownsListProps {
  towns: Route66Town[];
}

const TownsList = ({ towns }: TownsListProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold mb-3">Route 66 Towns & Attractions</h3>
      
      {towns.length === 0 ? (
        <p className="text-gray-500 italic">No towns to display</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {towns.map((town, index) => (
            <div key={index} className="flex items-center p-2 rounded-md hover:bg-gray-50">
              <div className="h-2 w-2 rounded-full bg-red-600 mr-2"></div>
              <span>{town.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TownsList;
