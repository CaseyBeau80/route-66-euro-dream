import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import MapFiltersPanel from './MapFiltersPanel';
import MapFiltersButton from './MapFiltersButton';

const MapFiltersControl: React.FC = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  // Desktop: Show floating panel on left side
  if (!isMobile) {
    return (
      <div className="absolute top-4 left-4 z-[1001]">
        <MapFiltersPanel />
      </div>
    );
  }

  // Mobile: Show button that opens bottom sheet
  return (
    <>
      <div className="absolute bottom-24 left-4 z-[1001]">
        <MapFiltersButton onClick={() => setIsOpen(true)} />
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent 
          side="bottom" 
          className="bg-white/98 backdrop-blur-sm border-t border-gray-200 rounded-t-2xl max-h-[70vh]"
        >
          <SheetHeader className="pb-2">
            <SheetTitle className="text-left flex items-center gap-2 text-gray-800">
              🗺️ Map Layers
            </SheetTitle>
          </SheetHeader>
          <div className="pt-2">
            <MapFiltersPanel showCloseButton={false} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MapFiltersControl;
