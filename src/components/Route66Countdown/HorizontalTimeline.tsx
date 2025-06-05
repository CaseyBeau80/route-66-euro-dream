
import React from 'react';
import { Calendar, MapPin, Star, Trophy, Music, Tv } from 'lucide-react';

const HorizontalTimeline: React.FC = () => {
  const milestones = [
    {
      year: "1926",
      event: "Route 66 Established",
      description: "Original highway system created connecting Chicago to Santa Monica",
      icon: <MapPin className="w-6 h-6" />,
      color: "from-red-500 to-red-700",
      bgColor: "bg-red-500"
    },
    {
      year: "1930s",
      event: "Dust Bowl Migration",
      description: "Route became the path to California for thousands seeking new opportunities",
      icon: <Star className="w-6 h-6" />,
      color: "from-yellow-500 to-yellow-700",
      bgColor: "bg-yellow-500"
    },
    {
      year: "1946",
      event: "Song \"Route 66\"",
      description: "Bobby Troup's hit song made the highway famous worldwide",
      icon: <Music className="w-6 h-6" />,
      color: "from-purple-500 to-purple-700",
      bgColor: "bg-purple-500"
    },
    {
      year: "1960s",
      event: "TV Show Era",
      description: "Route 66 TV series brought the highway into American homes",
      icon: <Tv className="w-6 h-6" />,
      color: "from-blue-500 to-blue-700",
      bgColor: "bg-blue-500"
    },
    {
      year: "1985",
      event: "Decommissioned",
      description: "Replaced by Interstate system, but the legend lived on",
      icon: <Calendar className="w-6 h-6" />,
      color: "from-gray-500 to-gray-700",
      bgColor: "bg-gray-500"
    },
    {
      year: "2026",
      event: "100th Anniversary",
      description: "Centennial celebration of America's Mother Road",
      icon: <Trophy className="w-6 h-6" />,
      color: "from-green-500 to-green-700",
      bgColor: "bg-green-500"
    }
  ];

  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-8">
      <h3 
        className="text-3xl font-bold mb-12 text-center text-white"
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
      <div className="relative overflow-x-auto">
        {/* Horizontal Line */}
        <div className="absolute top-20 left-8 right-8 h-1 bg-gradient-to-r from-red-500 via-white to-blue-500 rounded-full"></div>
        
        {/* Timeline Items Container */}
        <div className="flex justify-between items-start min-w-full px-4">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex flex-col items-center group relative min-w-0 flex-1">
              {/* Timeline Dot */}
              <div 
                className={`relative z-10 w-16 h-16 ${milestone.bgColor} rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all duration-300 border-4 border-white mb-6`}
              >
                {milestone.icon}
              </div>
              
              {/* Card */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-2 shadow-xl max-w-48 min-h-[140px] flex flex-col">
                <div 
                  className="text-lg font-bold text-white mb-2 text-center"
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
                  className="text-sm font-semibold text-white/90 mb-2 text-center"
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
                  className="text-xs text-white/70 text-center flex-grow flex items-center justify-center"
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
              
              {/* Connector line for mobile/tablet */}
              {index < milestones.length - 1 && (
                <div className="absolute top-20 left-full w-full h-1 bg-gradient-to-r from-white to-transparent lg:hidden"></div>
              )}
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

export default HorizontalTimeline;
