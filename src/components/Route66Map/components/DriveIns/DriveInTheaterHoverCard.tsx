
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, ExternalLink, Calendar, Users, Monitor } from 'lucide-react';
import { DriveInData } from './hooks/useDriveInsData';

interface DriveInTheaterHoverCardProps {
  driveIn: DriveInData;
  onWebsiteClick: (website: string) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const DriveInTheaterHoverCard: React.FC<DriveInTheaterHoverCardProps> = ({ 
  driveIn, 
  onWebsiteClick,
  onMouseEnter,
  onMouseLeave 
}) => {
  const isActive = driveIn.status === 'active' || driveIn.status === 'open';
  const statusColor = isActive ? 'text-green-600' : 'text-red-600';
  const statusBg = isActive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';

  return (
    <Card 
      className="w-87 border-4 border-amber-600 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 shadow-2xl overflow-hidden relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Enhanced film strip decorations */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-amber-800 via-yellow-600 to-amber-800"></div>
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-amber-800 via-yellow-600 to-amber-800"></div>
      
      <div className="absolute left-0 top-0 bottom-0 w-5 bg-amber-800">
        <div className="flex flex-col justify-around h-full py-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-3 h-1 bg-yellow-100 rounded-sm mx-auto"></div>
          ))}
        </div>
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-5 bg-amber-800">
        <div className="flex flex-col justify-around h-full py-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-3 h-1 bg-yellow-100 rounded-sm mx-auto"></div>
          ))}
        </div>
      </div>

      <CardContent className="p-6 pl-10 pr-12">
        <div className="text-center">
          {/* Header with status */}
          <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-yellow-200 px-4 py-3 rounded-lg shadow-lg mb-4 border-2 border-yellow-400">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl animate-pulse">🎬</span>
              <span className="font-bold text-sm uppercase tracking-widest">Drive-In Theater</span>
              <span className="text-2xl animate-pulse">🍿</span>
            </div>
          </div>
          
          {/* Theater name */}
          <h3 className="font-black text-xl text-amber-900 leading-tight uppercase tracking-wide mb-3">
            {driveIn.name}
          </h3>
          
          {/* Location */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="h-4 w-4 text-amber-800" />
            <span className="bg-amber-800 text-yellow-100 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg border border-yellow-400">
              {driveIn.city_name}, {driveIn.state}
            </span>
          </div>

          {/* Status indicator */}
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold mb-4 border-2 ${statusBg} ${statusColor}`}>
            {isActive ? '🟢 CURRENTLY OPEN' : '🔴 CURRENTLY CLOSED'}
          </div>
          
          {/* Theater details */}
          <div className="grid grid-cols-1 gap-2 mb-4 text-xs">
            {driveIn.year_opened && (
              <div className="flex items-center justify-center gap-2">
                <Calendar className="h-3 w-3 text-amber-700" />
                <span className="text-amber-900">Opened: {driveIn.year_opened}</span>
              </div>
            )}
            {driveIn.capacity_cars && (
              <div className="flex items-center justify-center gap-2">
                <Users className="h-3 w-3 text-amber-700" />
                <span className="text-amber-900">Capacity: {driveIn.capacity_cars} cars</span>
              </div>
            )}
            {driveIn.screens_count && (
              <div className="flex items-center justify-center gap-2">
                <Monitor className="h-3 w-3 text-amber-700" />
                <span className="text-amber-900">{driveIn.screens_count} screen{driveIn.screens_count > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
          
          {/* Description */}
          {driveIn.description && (
            <div className="bg-gradient-to-br from-yellow-100 to-amber-50 border-2 border-dashed border-amber-600 rounded-lg p-4 mb-4 shadow-inner">
              <p className="text-sm text-amber-900 leading-relaxed font-medium">
                {driveIn.description.length > 120 
                  ? `${driveIn.description.substring(0, 120)}...` 
                  : driveIn.description
                }
              </p>
            </div>
          )}
          
          {/* Website button */}
          {driveIn.website && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`🌐 Clicking drive-in website for ${driveIn.name}: ${driveIn.website}`);
                onWebsiteClick(driveIn.website!);
              }}
              className="bg-gradient-to-r from-red-600 to-red-700 text-yellow-200 px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wide shadow-lg border-2 border-yellow-400 hover:from-red-700 hover:to-red-800 hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 w-full pointer-events-auto"
            >
              <ExternalLink className="h-4 w-4" />
              Visit Theater Website
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DriveInTheaterHoverCard;
