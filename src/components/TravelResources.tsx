
import TollRoads from "./TollRoads";
import { TravelResourcesProps } from "./TravelResources/types";
import { useResourceContent } from "./TravelResources/hooks/useResourceContent";
import ResourceHeader from "./TravelResources/ResourceHeader";
import ResourceCategoryCard from "./TravelResources/ResourceCategoryCard";
import PopularArticlesSection from "./TravelResources/PopularArticlesSection";

const TravelResources = () => {
  console.log("🚗 TravelResources: Rendering with English only");
  
  const content = useResourceContent("en"); // Always use English
  
  return (
    <>
      <section id="resources" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <ResourceHeader 
            title={content.title} 
            subtitle={content.subtitle} 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {content.categories.map((category, index) => (
              <ResourceCategoryCard 
                key={index}
                category={category} 
                index={index} 
              />
            ))}
          </div>
          
          <PopularArticlesSection 
            title={content.popularArticles}
            articles={content.articles}
          />
        </div>
      </section>
      
      {/* Add Toll Roads section */}
      <TollRoads />
    </>
  );
};

export default TravelResources;
