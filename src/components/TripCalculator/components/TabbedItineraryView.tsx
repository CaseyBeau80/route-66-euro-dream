
import React, { useState } from 'react';
import { Calendar, MapPin, Cloud } from 'lucide-react';
import { format } from 'date-fns';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { useStableSegments } from '../hooks/useStableSegments';
import DaySegmentCard from './DaySegmentCard';
import CollapsibleWeatherCard from './weather/CollapsibleWeatherCard';
import ErrorBoundary from './ErrorBoundary';

interface TabbedItineraryViewProps {
  segments: DailySegment[];
  tripStartDate?: Date;
  tripId?: string;
  totalDays: number;
}

type TabType = 'route' | 'weather';

const TabbedItineraryView: React.FC<TabbedItineraryViewProps> = ({
  segments,
  tripStartDate,
  tripId,
  totalDays
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('route');
  
  // Debug: Log incoming segments before stabilization
  console.log('🔍 TabbedItineraryView - RAW INCOMING SEGMENTS:', {
    segmentsCount: segments?.length || 0,
    totalDays,
    rawSegments: segments?.map(s => ({ day: s.day, endCity: s.endCity, startCity: s.startCity })) || []
  });
  
  const stableSegments = useStableSegments(segments);
  
  // Debug: Log segments after stabilization
  console.log('🔍 TabbedItineraryView - AFTER STABILIZATION:', {
    originalCount: segments?.length || 0,
    stableCount: stableSegments.length,
    stableSegments: stableSegments.map(s => ({ day: s.day, endCity: s.endCity, startCity: s.startCity }))
  });
  
  // Debug: Check for missing days
  const expectedDays = Array.from({ length: totalDays }, (_, i) => i + 1);
  const actualDays = stableSegments.map(s => s.day).sort((a, b) => a - b);
  const missingDays = expectedDays.filter(day => !actualDays.includes(day));
  
  if (missingDays.length > 0) {
    console.error('❌ MISSING DAYS DETECTED:', {
      expectedDays,
      actualDays,
      missingDays,
      totalDays,
      segmentsCount: stableSegments.length
    });
  }
  
  console.log('📱 TabbedItineraryView render:', {
    segmentsCount: stableSegments.length,
    activeTab,
    tripStartDate: tripStartDate ? format(tripStartDate, 'yyyy-MM-dd') : 'Not set',
    totalDays,
    segmentDetails: stableSegments.map(s => ({ day: s.day, endCity: s.endCity })),
    expectedDays,
    actualDays,
    missingDays
  });

  if (!stableSegments || stableSegments.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-md">
        <div className="text-center p-8 bg-route66-background-alt rounded-lg border border-route66-border">
          <MapPin className="h-12 w-12 text-route66-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-route66-text-primary mb-2">
            No Itinerary Available
          </h3>
          <p className="text-route66-text-secondary">
            There was an issue generating your trip itinerary. Please try recalculating your trip.
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'route' as TabType,
      label: 'Route & Stops',
      icon: MapPin,
      description: 'Daily route and recommended stops'
    },
    {
      id: 'weather' as TabType,
      label: 'Weather Forecast',
      icon: Cloud,
      description: 'Weather conditions for each day'
    }
  ];

  return (
    <ErrorBoundary context="TabbedItineraryView">
      <div className="rounded-xl bg-white p-6 shadow-md">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-6 w-6 text-route66-primary" />
            <h3 className="text-xl font-bold text-route66-text-primary">
              Daily Itinerary
            </h3>
          </div>
          <p className="text-sm text-route66-text-secondary ml-9">
            Complete overview of your {totalDays}-day Route 66 adventure ({stableSegments.length} segments loaded)
            {missingDays.length > 0 && (
              <span className="text-red-600 font-medium"> - Missing days: {missingDays.join(', ')}</span>
            )}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <div className="flex space-x-0">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 relative
                      ${isActive 
                        ? 'border-route66-primary text-route66-primary bg-route66-accent-light/10' 
                        : 'border-transparent text-route66-text-secondary hover:text-route66-text-primary hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.id === 'route' ? 'Route' : 'Weather'}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content with Sliding Animation */}
        <div className="relative overflow-hidden min-h-[400px]">
          {/* Route & Stops Content */}
          <div className={`
            absolute inset-0 transition-all duration-500 ease-in-out
            ${activeTab === 'route' 
              ? 'translate-x-0 opacity-100' 
              : '-translate-x-full opacity-0 pointer-events-none'
            }
          `}>
            <div className="space-y-4">
              <div className="mb-3">
                <h4 className="text-sm font-medium text-route66-text-secondary uppercase tracking-wider">
                  Route & Recommended Stops
                </h4>
              </div>
              
              {stableSegments.map((segment, index) => {
                console.log(`🗺️ Rendering route segment ${index + 1}:`, { day: segment.day, endCity: segment.endCity });
                return (
                  <ErrorBoundary key={`route-segment-${segment.day}-${segment.endCity}-${index}`} context={`RouteTab-Segment-${index}`}>
                    <DaySegmentCard 
                      segment={segment}
                      tripStartDate={tripStartDate}
                      cardIndex={index}
                      tripId={tripId}
                      sectionKey="route-tab"
                    />
                  </ErrorBoundary>
                );
              })}
            </div>
          </div>

          {/* Weather Forecast Content */}
          <div className={`
            absolute inset-0 transition-all duration-500 ease-in-out
            ${activeTab === 'weather' 
              ? 'translate-x-0 opacity-100' 
              : 'translate-x-full opacity-0 pointer-events-none'
            }
          `}>
            <div className="space-y-4">
              <div className="mb-3">
                <h4 className="text-sm font-medium text-route66-text-secondary uppercase tracking-wider">
                  Daily Weather Forecast
                </h4>
              </div>

              {!tripStartDate ? (
                <div className="bg-gray-50 rounded-lg p-6 text-center min-h-[200px] flex flex-col justify-center">
                  <Cloud className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h5 className="text-lg font-semibold text-gray-600 mb-2">
                    Weather Forecast
                  </h5>
                  <p className="text-gray-500 text-sm">
                    Set a trip start date to see weather forecasts for your journey
                  </p>
                </div>
              ) : (
                stableSegments.map((segment, index) => {
                  console.log(`🌤️ Rendering weather segment ${index + 1}:`, { day: segment.day, endCity: segment.endCity });
                  return (
                    <ErrorBoundary key={`weather-segment-${segment.day}-${segment.endCity}-${index}`} context={`WeatherTab-Segment-${index}`}>
                      <CollapsibleWeatherCard
                        segment={segment}
                        tripStartDate={tripStartDate}
                        cardIndex={index}
                        tripId={tripId}
                        sectionKey="weather-tab"
                        defaultExpanded={index === 0} // First card expanded by default
                      />
                    </ErrorBoundary>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default TabbedItineraryView;
