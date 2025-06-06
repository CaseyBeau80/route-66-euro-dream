
import React from 'react';
import { MapPin, Cloud } from 'lucide-react';

export type TabType = 'route' | 'weather';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  const tabs: Tab[] = [
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
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <div className="flex space-x-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
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
  );
};

export default TabNavigation;
