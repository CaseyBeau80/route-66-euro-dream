
import TollRoads from "./TollRoads";
import { TravelResourcesProps } from "./TravelResources/types";

const TravelResources = ({ language }: TravelResourcesProps) => {
  console.log("🚗 TravelResources: Rendering toll roads only with language:", language);
  
  return (
    <>
      {/* Only show Toll Roads section - hiding international travelers section for launch */}
      <TollRoads language={language} />
    </>
  );
};

export default TravelResources;
