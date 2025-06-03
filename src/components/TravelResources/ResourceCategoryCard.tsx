
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
    <Card key={index} className="border-0 shadow-sm h-full bg-white hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6 flex flex-col h-full">
        <h3 className="text-lg font-bold text-route66-blue mb-3">{category.title}</h3>
        <p className="text-route66-gray mb-6 flex-grow">{category.description}</p>
        <Button 
          variant="link" 
          className="p-0 text-route66-red hover:text-route66-red/80 flex items-center justify-start"
        >
          {category.link}
          <ArrowRight size={14} className="ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResourceCategoryCard;
