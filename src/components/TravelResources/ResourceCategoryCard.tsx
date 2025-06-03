
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ResourceCategory } from "./types";

type ResourceCategoryCardProps = {
  category: ResourceCategory;
  index: number;
};

const ResourceCategoryCard = ({ category, index }: ResourceCategoryCardProps) => {
  return (
    <Card key={index} className="border-4 border-route66-red shadow-2xl h-full bg-white hover:shadow-3xl transition-all duration-300 hover:border-route66-orange">
      <CardContent className="p-6 flex flex-col h-full">
        <h3 className="text-xl font-bold text-gray-900 mb-3 font-route66">{category.title}</h3>
        <p className="text-gray-800 mb-6 flex-grow text-base leading-relaxed font-semibold">{category.description}</p>
        <Button 
          variant="link" 
          className="p-0 text-route66-red hover:text-route66-orange flex items-center justify-start font-bold text-base"
        >
          {category.link}
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResourceCategoryCard;
