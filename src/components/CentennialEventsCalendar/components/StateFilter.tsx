import React from 'react';
import { Badge } from '@/components/ui/badge';
import { EventState, stateMetadata, centennialEvents } from '@/data/centennialEventsData';

interface StateFilterProps {
  selectedState: EventState | 'all';
  onStateChange: (state: EventState | 'all') => void;
}

const StateFilter: React.FC<StateFilterProps> = ({ selectedState, onStateChange }) => {
  // Get event counts
  const getCount = (state: EventState | 'all'): number => {
    if (state === 'all') return centennialEvents.length;
    return centennialEvents.filter(e => e.state === state).length;
  };

  // States in Route 66 order (Chicago to Santa Monica)
  const stateOrder: (EventState | 'all')[] = [
    'all', 'national', 'IL', 'MO', 'KS', 'OK', 'TX', 'NM', 'AZ', 'CA'
  ];

  // State display info with colors (cool blue/gray palette - ALL STATES EQUAL)
  const stateStyles: Record<EventState | 'all', { bg: string; activeBg: string; text: string }> = {
    'all': { bg: 'bg-slate-100', activeBg: 'bg-slate-700', text: 'text-slate-700' },
    'national': { bg: 'bg-indigo-100', activeBg: 'bg-indigo-600', text: 'text-indigo-700' },
    'IL': { bg: 'bg-blue-100', activeBg: 'bg-blue-500', text: 'text-blue-700' },
    'MO': { bg: 'bg-slate-100', activeBg: 'bg-slate-500', text: 'text-slate-700' },
    'KS': { bg: 'bg-sky-100', activeBg: 'bg-sky-500', text: 'text-sky-700' },
    'OK': { bg: 'bg-blue-100', activeBg: 'bg-[#1B60A3]', text: 'text-[#1B60A3]' },
    'TX': { bg: 'bg-slate-100', activeBg: 'bg-slate-600', text: 'text-slate-700' },
    'NM': { bg: 'bg-cyan-100', activeBg: 'bg-cyan-500', text: 'text-cyan-700' },
    'AZ': { bg: 'bg-indigo-100', activeBg: 'bg-indigo-500', text: 'text-indigo-700' },
    'CA': { bg: 'bg-sky-100', activeBg: 'bg-sky-400', text: 'text-sky-700' }
  };

  const getLabel = (state: EventState | 'all'): string => {
    if (state === 'all') return 'All';
    if (state === 'national') return '🌎 National';
    return stateMetadata[state].name;
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {stateOrder.map((state) => {
        const isActive = selectedState === state;
        const styles = stateStyles[state];
        const count = getCount(state);
        
        return (
          <button
            key={state}
            onClick={() => onStateChange(state)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
              transition-all duration-200 border-2
              ${isActive 
                ? `${styles.activeBg} text-white border-transparent shadow-md` 
                : `${styles.bg} ${styles.text} border-transparent hover:border-slate-300`
              }
            `}
            aria-pressed={isActive}
            aria-label={`Filter by ${getLabel(state)}, ${count} events`}
          >
            <span>{getLabel(state)}</span>
            <Badge 
              variant="secondary" 
              className={`
                text-xs px-1.5 py-0 min-w-[1.5rem] justify-center
                ${isActive ? 'bg-white/20 text-white' : 'bg-white/50'}
              `}
            >
              {count}
            </Badge>
          </button>
        );
      })}
    </div>
  );
};

export default StateFilter;
