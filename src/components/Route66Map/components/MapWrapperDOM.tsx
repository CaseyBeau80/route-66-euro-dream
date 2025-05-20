
import React from "react";

interface MapWrapperProps {
  baseWidth: number;
  baseHeight: number;
  updateViewBox: (currentZoom: number) => void;
}

/**
 * Creates the SVG wrapper and handles view box management for DOM-based map
 */
const MapWrapperDOM = ({ 
  baseWidth,
  baseHeight,
  updateViewBox
}: MapWrapperProps) => {
  // Create the map wrapper
  const createMapWrapper = () => {
    const mapWrapper = document.createElement('div');
    mapWrapper.className = 'relative w-full h-full';
    return mapWrapper;
  };

  // Create map background
  const createMapBackground = () => {
    const mapBg = document.createElement('div');
    mapBg.className = 'absolute inset-0 rounded-xl bg-[#f8f8f8] overflow-hidden';
    return mapBg;
  };

  // Create SVG element with proper viewBox
  const createMapSvg = () => {
    const mapSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    mapSvg.setAttribute('viewBox', `0 0 ${baseWidth} ${baseHeight}`);
    mapSvg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    mapSvg.setAttribute('class', 'absolute inset-0 w-full h-full transition-all duration-300 ease-in-out');
    return mapSvg;
  };

  return {
    createMapWrapper,
    createMapBackground,
    createMapSvg
  };
};

export default MapWrapperDOM;
