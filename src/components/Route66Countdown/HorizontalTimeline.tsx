import React from 'react';
import { Calendar, MapPin, Star, Trophy, Music, Tv } from 'lucide-react';

// Custom Motorcycle Icon Component
const MotorcycleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.44 9.03L15.41 5H11v2h3.59l2 2H5c-2.8 0-5 2.2-5 5s2.2 5 5 5c2.46 0 4.45-1.69 4.9-4h1.65l.95-.95c.54-.54.54-1.42 0-1.96L9.95 9.59l1.41-1.41 2.12 2.12c.54.54 1.42.54 1.96 0L17.9 7.84l1.41 1.41c.54.54 1.42.54 1.96 0 .54-.54.54-1.42 0-1.96L19.44 9.03zM5 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
    <circle cx="5" cy="12" r="1.5" fill="currentColor"/>
    <path d="M19 9c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
    <circle cx="19" cy="13" r="1" fill="currentColor"/>
  </svg>
);

const HorizontalTimeline: React.FC = () => {
  const milestones = [
    {
      year: "1926",
      event: "Route 66 Established",
      description: "Original highway system created connecting Chicago to Santa Monica",
      icon: <MapPin className="w-6 h-6" />,
      color: "from-red-600 to-red-800",
      bgColor: "bg-red-600"
    },
    {
      year: "1930s",
      event: "Dust Bowl Migration",
      description: "Route became the path to California for thousands seeking new opportunities",
      icon: <Star className="w-6 h-6" />,
      color: "from-blue-600 to-blue-800",
      bgColor: "bg-blue-600"
    },
    {
      year: "1946",
      event: "Song \"Route 66\"",
      description: "Bobby Troup's hit song made the highway famous worldwide",
      icon: <Music className="w-6 h-6" />,
      color: "from-red-600 to-red-800",
      bgColor: "bg-red-600"
    },
    {
      year: "1960s",
      event: "TV Show Era",
      description: "Route 66 TV series brought the highway into American homes",
      icon: <Tv className="w-6 h-6" />,
      color: "from-blue-600 to-blue-800",
      bgColor: "bg-blue-600"
    },
    {
      year: "1985",
      event: "Decommissioned",
      description: "Replaced by Interstate system, but the legend lived on",
      icon: <Calendar className="w-6 h-6" />,
      color: "from-gray-600 to-gray-800",
      bgColor: "bg-gray-600"
    },
    {
      year: "2026",
      event: "100th Anniversary",
      description: "Centennial celebration of America's Mother Road",
      icon: <Trophy className="w-6 h-6" />,
      color: "from-yellow-500 to-yellow-700",
      bgColor: "bg-yellow-500"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-cream-100 border-4 border-red-600 shadow-2xl rounded-lg p-8 relative overflow-hidden">
      {/* Vintage paper texture overlay */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(139, 69, 19, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(160, 82, 45, 0.1) 0%, transparent 50%),
              linear-gradient(45deg, transparent 49%, rgba(139, 69, 19, 0.05) 50%, transparent 51%)
            `,
            backgroundSize: '100px 100px, 80px 80px, 20px 20px'
          }}
        />
      </div>

      {/* Header with motorcycle icon */}
      <div className="relative z-10 flex items-center justify-center gap-4 mb-12">
        <MotorcycleIcon className="w-8 h-8 text-red-600" />
        <h3 
          className="text-4xl font-bold text-center text-red-600"
          style={{
            fontFamily: "'Russo One', 'Arial Black', sans-serif",
            textShadow: `
              2px 2px 0px #ffffff,
              4px 4px 0px #1e3a8a,
              6px 6px 8px rgba(0,0,0,0.3)
            `
          }}
        >
          ROUTE 66 TIMELINE
        </h3>
        <MotorcycleIcon className="w-8 h-8 text-blue-600" />
      </div>
      
      {/* Timeline Container */}
      <div className="relative overflow-x-auto">
        {/* Horizontal Highway Line */}
        <div className="absolute top-20 left-8 right-8 h-2 bg-gradient-to-r from-red-600 via-white to-blue-600 rounded-full border-2 border-gray-800 shadow-lg"></div>
        
        {/* Road stripes */}
        <div className="absolute top-[84px] left-8 right-8 h-0.5 bg-yellow-400 rounded-full"></div>
        
        {/* Timeline Items Container */}
        <div className="flex justify-between items-start min-w-full px-4">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex flex-col items-center group relative min-w-0 flex-1">
              {/* Highway Shield Timeline Dot */}
              <div 
                className={`relative z-10 w-16 h-16 ${milestone.bgColor} rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-all duration-300 border-4 border-white mb-6`}
                style={{
                  boxShadow: `
                    0 0 0 2px #374151,
                    0 8px 16px rgba(0,0,0,0.3),
                    inset 0 2px 4px rgba(255,255,255,0.2)
                  `
                }}
              >
                {milestone.icon}
              </div>
              
              {/* Vintage Postcard Card */}
              <div className="bg-gradient-to-br from-cream-100 via-yellow-50 to-amber-50 border-4 border-red-600 rounded-lg p-4 hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-2 max-w-48 min-h-[160px] flex flex-col relative">
                {/* Vintage postcard corners */}
                <div className="absolute top-1 left-1 w-3 h-3 border-l-2 border-t-2 border-red-600"></div>
                <div className="absolute top-1 right-1 w-3 h-3 border-r-2 border-t-2 border-red-600"></div>
                <div className="absolute bottom-1 left-1 w-3 h-3 border-l-2 border-b-2 border-red-600"></div>
                <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-red-600"></div>
                
                {/* Year with vintage styling */}
                <div 
                  className="text-xl font-bold text-red-600 mb-2 text-center"
                  style={{
                    fontFamily: "'Russo One', 'Arial Black', sans-serif",
                    textShadow: `
                      1px 1px 0px #ffffff,
                      2px 2px 2px rgba(0,0,0,0.3)
                    `
                  }}
                >
                  {milestone.year}
                </div>
                
                {/* Event title */}
                <div 
                  className="text-sm font-bold text-blue-600 mb-2 text-center"
                  style={{
                    fontFamily: "'Russo One', 'Arial Black', sans-serif",
                    textShadow: `
                      1px 1px 0px #ffffff,
                      2px 2px 2px rgba(0,0,0,0.2)
                    `
                  }}
                >
                  {milestone.event}
                </div>
                
                {/* Description */}
                <div 
                  className="text-xs text-gray-700 text-center flex-grow flex items-center justify-center leading-relaxed"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    textShadow: `1px 1px 1px rgba(255,255,255,0.8)`
                  }}
                >
                  {milestone.description}
                </div>
                
                {/* Vintage postmark stamp */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Route 66 Highway Shield Decorative Elements */}
      <div className="mt-8 flex justify-center items-center gap-4">
        <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold border-2 border-white shadow-lg">
          66
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-1 bg-red-600 rounded-full"></div>
          <div className="w-4 h-4 bg-white rounded-full border-2 border-red-600"></div>
          <div className="w-8 h-1 bg-white rounded-full"></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white"></div>
          <div className="w-8 h-1 bg-blue-600 rounded-full"></div>
        </div>
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold border-2 border-white shadow-lg">
          US
        </div>
      </div>
    </div>
  );
};

export default HorizontalTimeline;
