
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import FunFactsHeader from './components/FunFactsHeader';
import NewspaperClipping from './components/NewspaperClipping';
import { DailyFactsService } from './services/DailyFactsService';

const FunFactsOfTheDay: React.FC = () => {
  const dailyFacts = DailyFactsService.getTodaysFacts();

  return (
    <section className="py-12 bg-gradient-to-br from-amber-25 via-yellow-25 to-cream-50 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 via-transparent to-yellow-100/20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f59e0b%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <FunFactsHeader currentDate={dailyFacts.date} />
        
        {/* Carousel Container */}
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-amber-200 shadow-xl">
          <CardContent className="p-6">
            <Carousel 
              opts={{
                align: "start",
                loop: true,
                skipSnaps: false,
                dragFree: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {dailyFacts.facts.slice(0, 2).map((fact, index) => ( // Reduced to 2 facts for DOM optimization
                  <CarouselItem 
                    key={fact.id} 
                    className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5"
                  >
                    <NewspaperClipping
                      fact={fact}
                      index={index}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 bg-amber-100 border-amber-300 hover:bg-amber-200 text-amber-800" />
              <CarouselNext className="right-2 bg-amber-100 border-amber-300 hover:bg-amber-200 text-amber-800" />
            </Carousel>
            
            {/* Footer note */}
            <div className="mt-6 pt-4 border-t border-amber-200/50 text-center">
              <p className="text-sm text-gray-600 font-courier-prime">
                ✨ Fresh facts every day from America's Mother Road ✨
              </p>
              <p className="text-xs text-gray-500 mt-1 font-special-elite">
                Come back tomorrow for five new discoveries!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FunFactsOfTheDay;
