
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Utensils, Music, History as HistoryIcon } from "lucide-react";

type MapCategoriesProps = {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  content: {
    categories: {
      lodging: string;
      food: string;
      music: string;
      history: string;
    };
  };
};

export const MapCategories = ({ activeCategory, setActiveCategory, content }: MapCategoriesProps) => {
  return (
    <div className="flex flex-wrap space-x-2 mb-6 overflow-x-auto pb-2">
      <Button
        variant={activeCategory === 'all' ? "default" : "ghost"}
        className={activeCategory === 'all' ? "bg-route66-red text-white hover:bg-route66-red/90" : "text-route66-gray"}
        onClick={() => setActiveCategory('all')}
      >
        <MapPin size={16} className="mr-2" />
        All
      </Button>
      <Button
        variant={activeCategory === 'lodging' ? "default" : "ghost"}
        className={activeCategory === 'lodging' ? "bg-route66-red text-white hover:bg-route66-red/90" : "text-route66-gray"}
        onClick={() => setActiveCategory('lodging')}
      >
        <Bed size={16} className="mr-2" />
        {content.categories.lodging}
      </Button>
      <Button
        variant={activeCategory === 'food' ? "default" : "ghost"}
        className={activeCategory === 'food' ? "bg-route66-red text-white hover:bg-route66-red/90" : "text-route66-gray"}
        onClick={() => setActiveCategory('food')}
      >
        <Utensils size={16} className="mr-2" />
        {content.categories.food}
      </Button>
      <Button
        variant={activeCategory === 'music' ? "default" : "ghost"}
        className={activeCategory === 'music' ? "bg-route66-red text-white hover:bg-route66-red/90" : "text-route66-gray"}
        onClick={() => setActiveCategory('music')}
      >
        <Music size={16} className="mr-2" />
        {content.categories.music}
      </Button>
      <Button
        variant={activeCategory === 'history' ? "default" : "ghost"}
        className={activeCategory === 'history' ? "bg-route66-red text-white hover:bg-route66-red/90" : "text-route66-gray"}
        onClick={() => setActiveCategory('history')}
      >
        <HistoryIcon size={16} className="mr-2" />
        {content.categories.history}
      </Button>
    </div>
  );
};
