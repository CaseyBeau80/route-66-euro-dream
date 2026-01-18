import React, { useState, Suspense } from 'react';
import { Calendar, MapPin, Filter, Star, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CentennialEvent, dataSourceInfo } from '@/data/centennialEventsData';
import { useEventFilters } from './hooks/useEventFilters';
import EventCard from './components/EventCard';
import EventModal from './components/EventModal';
import StateFilter from './components/StateFilter';
import FeaturedEvents from './components/FeaturedEvents';
import MonthlyView from './components/MonthlyView';
import LocalHighlights from './components/LocalHighlights';

const CentennialEventsCalendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CentennialEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('local');

  const {
    filteredEvents,
    selectedState,
    selectedMonth,
    setSelectedState,
    setSelectedMonth,
    setFilterType,
    highlightedEvents,
    localEvents
  } = useEventFilters();

  const handleEventClick = (event: CentennialEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case 'all':
        setFilterType('all');
        break;
      case 'local':
        setFilterType('local');
        break;
      case 'state':
        setFilterType('state');
        break;
      case 'month':
        setFilterType('month');
        break;
    }
  };

  return (
    <section 
      className="py-12 sm:py-16 bg-gradient-to-br from-orange-50 via-amber-50/50 to-slate-50"
      aria-labelledby="events-calendar-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Calendar className="h-4 w-4" />
            <span>2026 Centennial Events</span>
          </div>
          
          <h2 
            id="events-calendar-heading"
            className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3"
          >
            Route 66 Turns 100! 🎉
          </h2>
          
          <p className="text-slate-600 max-w-2xl mx-auto mb-4">
            Year-long celebrations across all 8 states! Plan ahead for parades, festivals, 
            car shows, and more along the Mother Road.
          </p>

          {/* Pro tip callout */}
          <div className="inline-block bg-amber-100 border border-amber-200 rounded-lg px-4 py-2 text-sm text-amber-800">
            <strong>💡 Plan ahead!</strong> Book accommodations early for major events like the 
            April 30 National Kickoff and June Road Fest.
          </div>
        </div>

        {/* Featured Events Carousel */}
        <div className="mb-8">
          <FeaturedEvents 
            events={highlightedEvents} 
            onEventClick={handleEventClick}
          />
        </div>

        {/* Tabs for filtering */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full justify-start mb-6 flex-wrap gap-1 h-auto p-1 bg-slate-100/80">
            <TabsTrigger 
              value="local" 
              className="flex items-center gap-1.5 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              <MapPin className="h-3.5 w-3.5" />
              Oklahoma (Local)
              <Badge variant="secondary" className="ml-1 text-xs">
                {localEvents.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5" />
              All Events
            </TabsTrigger>
            <TabsTrigger value="state" className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5" />
              By State
            </TabsTrigger>
            <TabsTrigger value="month" className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              By Month
            </TabsTrigger>
          </TabsList>

          {/* Local/Oklahoma Tab */}
          <TabsContent value="local" className="mt-0">
            <LocalHighlights onEventClick={handleEventClick} />
          </TabsContent>

          {/* All Events Tab */}
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onClick={handleEventClick}
                />
              ))}
            </div>
          </TabsContent>

          {/* By State Tab */}
          <TabsContent value="state" className="mt-0 space-y-6">
            <StateFilter 
              selectedState={selectedState} 
              onStateChange={setSelectedState}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onClick={handleEventClick}
                />
              ))}
            </div>
          </TabsContent>

          {/* By Month Tab */}
          <TabsContent value="month" className="mt-0 space-y-6">
            <MonthlyView 
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onClick={handleEventClick}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Data source footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            Event data sourced from{' '}
            <a 
              href={dataSourceInfo.officialSite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-600 inline-flex items-center gap-1"
            >
              {dataSourceInfo.source}
              <ExternalLink className="h-3 w-3" />
            </a>
            {' '}• Last updated: {dataSourceInfo.lastUpdated}
          </p>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal 
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default CentennialEventsCalendar;
