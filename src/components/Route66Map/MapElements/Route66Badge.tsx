
import React from "react";

const Route66Badge = () => {
  return (
    <div className="absolute top-4 left-4 z-10">
      <div className="bg-white rounded-full p-1 shadow-md">
        <div className="bg-white border-2 border-black rounded-full p-2 flex flex-col items-center w-16 h-16">
          <div className="text-xs">ROUTE</div>
          <div className="text-xs">US</div>
          <div className="text-xl font-black">66</div>
        </div>
      </div>
    </div>
  );
};

export default Route66Badge;
