
import React from "react";

/**
 * Creates decorative elements for the DOM-based map
 */
const MapDecorationDOM = () => {
  // Create title component
  const createTitle = () => {
    const title = document.createElement('div');
    title.className = 'absolute top-2 right-4 bg-white px-4 py-1 rounded-full shadow-md z-10';
    title.innerHTML = '<h3 class="text-lg font-bold">HISTORIC ROUTE 66</h3>';
    return title;
  };

  // Create Route 66 badge
  const createBadge = () => {
    const badge = document.createElement('div');
    badge.className = 'absolute top-4 left-4 z-10';
    badge.innerHTML = `
      <div class="bg-white rounded-full p-1 shadow-md">
        <div class="bg-white border-2 border-black rounded-full p-2 flex flex-col items-center w-16 h-16">
          <div class="text-xs">ROUTE</div>
          <div class="text-xs">US</div>
          <div class="text-xl font-black">66</div>
        </div>
      </div>
    `;
    return badge;
  };

  return {
    createTitle,
    createBadge
  };
};

export default MapDecorationDOM;
