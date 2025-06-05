
import React from 'react';

const CountdownHeader: React.FC = () => {
  return (
    <div className="text-center mb-8 relative z-10">
      <h1 
        className="text-5xl md:text-7xl font-black leading-none tracking-wider mb-4"
        style={{
          fontFamily: "'Black Ops One', 'Impact', sans-serif",
          color: '#dc2626',
          textShadow: `
            3px 3px 0px #FFFFFF,
            6px 6px 0px #7f1d1d,
            9px 9px 10px rgba(0,0,0,0.5),
            0 0 20px rgba(220, 38, 38, 0.8),
            0 0 40px rgba(127, 29, 29, 0.6)
          `,
          letterSpacing: '0.15em',
          animation: 'neon-glow 2s ease-in-out infinite alternate'
        }}
      >
        ROUTE 66
      </h1>
      <h2 
        className="text-2xl md:text-3xl font-bold tracking-widest"
        style={{
          fontFamily: "'Russo One', 'Arial Black', sans-serif",
          color: '#7f1d1d',
          textShadow: '2px 2px 4px rgba(0,0,0,0.6), 0 0 10px rgba(127, 29, 29, 0.4)',
          letterSpacing: '0.2em'
        }}
      >
        CENTENNIAL COUNTDOWN
      </h2>
    </div>
  );
};

export default CountdownHeader;
