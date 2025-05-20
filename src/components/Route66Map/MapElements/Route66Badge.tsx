
import React from "react";

const Route66Badge = () => {
  return (
    <div className="bg-white rounded-md p-1 shadow-md">
      <div className="bg-white border-2 border-black rounded-md p-2 flex flex-col items-center justify-center w-16 h-16">
        <div className="text-[10px] font-bold">US</div>
        <div className="text-xl font-black leading-none">66</div>
        <div className="border-t border-black w-full mt-1 pt-1">
          <div className="text-[8px] font-bold text-center">HISTORIC</div>
        </div>
      </div>
    </div>
  );
};

export default Route66Badge;
