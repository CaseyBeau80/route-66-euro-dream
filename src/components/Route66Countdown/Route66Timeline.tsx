
import React from 'react';
import { Calendar, MapPin, Star, Trophy } from 'lucide-react';

const Route66Timeline: React.FC = () => {
  const milestones = [
    {
      year: "1926",
      event: "Route 66 Established",
      description: "Original highway system created",
      icon: <MapPin className="w-5 h-5" />,
      color: "from-red-500 to-red-700"
    },
    {
      year: "1930s",
      event: "Dust Bowl Migration",
      description: "Route became path to California",
      icon: <Star className="w-5 h-5" />,
      color: "from-yellow-500 to-yellow-700"
    },
    {
      year: "1946",
      event: "Song \"Route 66\"",
      description: "Bobby Troup's hit song released",
      icon: <Trophy className="w-5 h-5" />,
      color: "from-purple-500 to-purple-700"
    },
    {
      year: "1960s",
      event: "TV Show Era",
      description: "Route 66 TV series aired",
      icon: <Star className="w-5 h-5" />,
      color: "from-blue-500 to-blue-700"
    },
    {
      year: "1985",
      event: "Decommissioned",
      description: "Replaced by Interstate system",
      icon: <Calendar className="w-5 h-5" />,
      color: "from-gray-500 to-gray-700"
    },
    {
      year: "2026",
      event: "100th Anniversary",
      description: "Centennial celebration",
      icon: <Trophy className="w-5 h-5" />,
      color: "from-green-500 to-green-700"
    }
  ];

  return (
    <div className="p-8 rounded-2xl h-full bg-black/40 backdrop-blur-md border border-white/20 shadow-2xl">
      <h3 
        className="text-2xl font-bold mb-8 text-center text-white"
        style={{
          fontFamily: "'Russo One', 'Arial Black', sans-serif",
          textShadow: `
            2px 2px 0px #000000,
            4px 4px 6px rgba(0,0,0,0.8),
            0 0 15px rgba(255, 255, 255, 0.8)
          `
        }}
      >
        Historic Timeline
      </h3>
      
      {/* Timeline Container */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 via-white to-blue-500 rounded-full"></div>
        
        {/* Timeline Items */}
        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <div key={index} className="relative flex items-start gap-4 group">
              {/* Timeline Dot */}
              <div 
                className={`relative z-10 w-16 h-16 bg-gradient-to-br ${milestone.color} rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300 border-4 border-white`}
              >
                {milestone.icon}
              </div>
              
              {/* Content */}
              <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
                <div 
                  className="text-lg font-bold text-white mb-1"
                  style={{
                    fontFamily: "'Russo One', 'Arial Black', sans-serif",
                    textShadow: `
                      1px 1px 0px #000000,
                      2px 2px 4px rgba(0,0,0,0.8)
                    `
                  }}
                >
                  {milestone.year}
                </div>
                <div 
                  className="text-sm font-semibold text-white/90 mb-2"
                  style={{
                    textShadow: `
                      1px 1px 0px #000000,
                      2px 2px 4px rgba(0,0,0,0.6)
                    `
                  }}
                >
                  {milestone.event}
                </div>
                <div 
                  className="text-xs text-white/70"
                  style={{
                    textShadow: `
                      1px 1px 0px #000000,
                      2px 2px 4px rgba(0,0,0,0.6)
                    `
                  }}
                >
                  {milestone.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="mt-8 flex justify-center items-center gap-2">
        <div className="w-8 h-1 bg-gradient-to-r from-red-500 to-white rounded-full"></div>
        <div className="w-3 h-3 bg-white rounded-full border-2 border-white/30"></div>
        <div className="w-8 h-1 bg-gradient-to-l from-white to-blue-500 rounded-full"></div>
      </div>
    </div>
  );
};

export default Route66Timeline;
