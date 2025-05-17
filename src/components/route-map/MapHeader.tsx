
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

type MapHeaderProps = {
  content: {
    title: string;
    subtitle: string;
  };
};

export const MapHeader = ({ content }: MapHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h2 className="text-3xl font-route66 text-route66-red mb-2">{content.title}</h2>
        <p className="text-route66-gray">{content.subtitle}</p>
      </div>
      
      <div className="mt-4 md:mt-0 flex items-center">
        <Button variant="outline" size="sm" className="flex items-center text-route66-gray border-route66-gray/30 hover:bg-route66-gray/5">
          <Filter size={16} className="mr-2" />
          Filters
        </Button>
      </div>
    </div>
  );
};
