
import React from 'react';
import { Calendar } from 'lucide-react';

const PlannerFormHeader: React.FC = () => {
  return (
    <div className="flex items-center gap-2 text-[#3b82f6] font-semibold">
      <Calendar className="w-5 h-5" />
      <h2 className="text-xl">Plan Your Journey</h2>
    </div>
  );
};

export default PlannerFormHeader;
