
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { X, MapPin, ExternalLink, Calendar, Users, Monitor } from 'lucide-react';
import { DriveInData } from './hooks/useDriveInsData';

interface DriveInOverlayProps {
  driveIn: DriveInData;
  map: google.maps.Map;
  onClose: () => void;
  onWebsiteClick: (website: string) => void;
}

const DriveInOverlay: React.FC<DriveInOverlayProps> = ({
  driveIn,
  onClose,
  onWebsiteClick
}) => {
  const isActive = driveIn.status === 'active' || driveIn.status === 'open';
  const statusColor = isActive ? 'text-green-600' : 'text-red-600';
  const statusBg = isActive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-lg w-full border-4 border-amber-600 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors z-10"
        >
          <X className="h-4 w-4" />
        </button>

        <CardContent className="p-6">
          <div className="text-center">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-yellow-200 px-4 py-3 rounded-lg shadow-lg mb-4 border-2 border-yellow-400">
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl animate-pulse">🎬</span>
                <span className="font-bold text-lg uppercase tracking-widest">Drive-In Theater</span>
                <span className="text-3xl animate-pulse">🍿</span>
              </div>
            </div>

            {/* Theater name */}
            <h2 className="font-black text-2xl text-amber-900 leading-tight uppercase tracking-wide mb-4">
              {driveIn.name}
            </h2>

            {/* Location */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-amber-800" />
              <span className="bg-amber-800 text-yellow-100 px-4 py-2 rounded-full text-lg font-bold uppercase tracking-wide shadow-lg border border-yellow-400">
                {driveIn.city_name}, {driveIn.state}
              </span>
            </div>

            {/* Status */}
            <div className={`inline-block px-6 py-3 rounded-full text-lg font-bold mb-6 border-2 ${statusBg} ${statusColor}`}>
              {isActive ? '🟢 CURRENTLY OPEN' : '🔴 CURRENTLY CLOSED'}
            </div>

            {/* Theater details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {driveIn.year_opened && (
                <div className="bg-yellow-100 border-2 border-amber-600 rounded-lg p-3 text-center">
                  <Calendar className="h-6 w-6 text-amber-700 mx-auto mb-2" />
                  <div className="text-sm font-bold text-amber-900">OPENED</div>
                  <div className="text-lg font-black text-amber-900">{driveIn.year_opened}</div>
                </div>
              )}
              {driveIn.capacity_cars && (
                <div className="bg-yellow-100 border-2 border-amber-600 rounded-lg p-3 text-center">
                  <Users className="h-6 w-6 text-amber-700 mx-auto mb-2" />
                  <div className="text-sm font-bold text-amber-900">CAPACITY</div>
                  <div className="text-lg font-black text-amber-900">{driveIn.capacity_cars} cars</div>
                </div>
              )}
              {driveIn.screens_count && (
                <div className="bg-yellow-100 border-2 border-amber-600 rounded-lg p-3 text-center">
                  <Monitor className="h-6 w-6 text-amber-700 mx-auto mb-2" />
                  <div className="text-sm font-bold text-amber-900">SCREENS</div>
                  <div className="text-lg font-black text-amber-900">{driveIn.screens_count}</div>
                </div>
              )}
            </div>

            {/* Description */}
            {driveIn.description && (
              <div className="bg-gradient-to-br from-yellow-100 to-amber-50 border-2 border-dashed border-amber-600 rounded-lg p-4 mb-6 shadow-inner">
                <p className="text-base text-amber-900 leading-relaxed font-medium">
                  {driveIn.description}
                </p>
              </div>
            )}

            {/* Website button */}
            {driveIn.website && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onWebsiteClick(driveIn.website!);
                }}
                className="bg-gradient-to-r from-red-600 to-red-700 text-yellow-200 px-8 py-4 rounded-lg text-lg font-bold uppercase tracking-wide shadow-lg border-2 border-yellow-400 hover:from-red-700 hover:to-red-800 hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 w-full"
              >
                <ExternalLink className="h-5 w-5" />
                Visit Theater Website
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriveInOverlay;
