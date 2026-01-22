import React from 'react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface MapFilterItemProps {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onToggle: () => void;
}

const MapFilterItem: React.FC<MapFilterItemProps> = ({
  icon,
  label,
  checked,
  onToggle
}) => {
  return (
    <div 
      className={cn(
        "flex items-center justify-between py-2 px-1 rounded-md transition-all duration-200",
        checked ? "opacity-100" : "opacity-50"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-6 h-6 flex items-center justify-center transition-all",
          !checked && "grayscale"
        )}>
          {icon}
        </div>
        <span className={cn(
          "text-sm font-medium transition-colors",
          checked ? "text-gray-800" : "text-gray-500"
        )}>
          {label}
        </span>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-[#1B60A3]"
      />
    </div>
  );
};

export default MapFilterItem;
