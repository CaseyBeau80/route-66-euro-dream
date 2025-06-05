
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import FunFactsHeader from './components/FunFactsHeader';
import NewspaperClipping from './components/NewspaperClipping';
import { DailyFactsService } from './services/DailyFactsService';

const FunFactsOfTheDay: React.FC = () => {
  const dailyFacts = DailyFactsService.getTodaysFacts();

  return (
    <section className="py-16 bg-gradient-to-br from-amber-25 via-yellow-25 to-cream-50 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 via-transparent to-yellow-100/20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f59e0b%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <FunFactsHeader currentDate={dailyFacts.date} />
        
        {/* Facts grid */}
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-amber-200 shadow-xl">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {dailyFacts.facts.map((fact, index) => (
                <NewspaperClipping
                  key={fact.id}
                  fact={fact}
                  index={index}
                />
              ))}
            </div>
            
            {/* Footer note */}
            <div className="mt-8 pt-6 border-t border-amber-200/50 text-center">
              <p className="text-sm text-gray-600 font-courier-prime">
                ✨ Fresh facts every day from America's Mother Road ✨
              </p>
              <p className="text-xs text-gray-500 mt-2 font-special-elite">
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
