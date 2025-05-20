
import React from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  currentZoom: number;
  minZoom: number;
  maxZoom: number;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({
  onZoomIn,
  onZoomOut,
  currentZoom,
  minZoom,
  maxZoom
}) => {
  return (
    <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1 bg-white/80 p-1 rounded-md shadow-md backdrop-blur-sm">
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomIn}
        disabled={currentZoom >= maxZoom}
        title="Zoom in"
        className="w-8 h-8"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomOut}
        disabled={currentZoom <= minZoom}
        title="Zoom out"
        className="w-8 h-8"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ZoomControls;
