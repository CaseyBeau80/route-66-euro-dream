
import Route66Map from "../components/Route66Map";

const Index = () => {
  console.log("🎨 Index page: Rendering with FUN cartoon aesthetic");
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-200 to-blue-300 cartoon-texture">
      {/* Cartoon Route 66 Header */}
      <div className="relative h-96 overflow-hidden">
        {/* Cartoon sky background with clouds */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-blue-300 to-green-300">
          {/* Fluffy cartoon clouds */}
          <div className="absolute top-8 left-16 w-24 h-16 bg-white rounded-full opacity-80 cartoon-cloud"></div>
          <div className="absolute top-12 left-20 w-16 h-12 bg-white rounded-full opacity-80"></div>
          <div className="absolute top-6 right-20 w-28 h-18 bg-white rounded-full opacity-80 cartoon-cloud"></div>
          <div className="absolute top-10 right-24 w-20 h-14 bg-white rounded-full opacity-80"></div>
          <div className="absolute top-20 left-1/3 w-22 h-15 bg-white rounded-full opacity-80 cartoon-cloud"></div>
          
          {/* Cartoon sun */}
          <div className="absolute top-8 right-8 w-20 h-20 bg-yellow-400 rounded-full border-4 border-orange-400 cartoon-bounce">
            {/* Sun rays */}
            <div className="absolute -top-8 left-1/2 w-1 h-6 bg-yellow-400 transform -translate-x-1/2 rounded-full"></div>
            <div className="absolute -bottom-8 left-1/2 w-1 h-6 bg-yellow-400 transform -translate-x-1/2 rounded-full"></div>
            <div className="absolute -left-8 top-1/2 w-6 h-1 bg-yellow-400 transform -translate-y-1/2 rounded-full"></div>
            <div className="absolute -right-8 top-1/2 w-6 h-1 bg-yellow-400 transform -translate-y-1/2 rounded-full"></div>
          </div>
        </div>
        
        {/* Content overlay */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="w-full px-3 sm:px-6 text-center">
            {/* Cartoon Route 66 Shield */}
            <div className="flex justify-center mb-6">
              <div className="relative cartoon-bounce-slow">
                <div className="w-24 h-28 bg-red-500 rounded-2xl border-6 border-white shadow-cartoon transform hover:scale-110 transition-transform duration-300">
                  {/* Shield content */}
                  <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                    <div className="text-white text-sm font-bold font-cartoon tracking-wide">ROUTE</div>
                    <div className="text-white text-4xl font-black leading-none font-cartoon">66</div>
                  </div>
                  
                  {/* Cartoon sparkles */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                  <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
                </div>
              </div>
            </div>
            
            {/* Main cartoon heading */}
            <h1 className="font-cartoon text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight mb-4 animate-bounce-gentle text-purple-800 cartoon-text-shadow">
              ROUTE 66 ADVENTURE!
            </h1>
            
            {/* Fun cartoon badge */}
            <div className="mb-4">
              <div className="inline-block bg-orange-400 text-white px-8 py-4 rounded-full font-bold text-xl border-4 border-white shadow-cartoon transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                🚗 2,448 MILES OF FUN! 🌟
              </div>
            </div>
            
            {/* Cartoon tagline */}
            <p className="font-cartoon text-2xl md:text-3xl mb-6 text-blue-800 leading-relaxed max-w-3xl mx-auto cartoon-text-outline">
              From Chicago's Buildings to Santa Monica's Beach! 🏙️➡️🏖️
            </p>
            
            {/* Cartoon info bubbles */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div className="bg-green-400 text-white px-6 py-3 font-bold text-lg rounded-full border-4 border-white shadow-cartoon animate-float">
                <div className="font-cartoon">🎉 SINCE 1926!</div>
              </div>
              <div className="bg-pink-500 text-white px-6 py-3 font-bold text-lg rounded-full border-4 border-white shadow-cartoon animate-float" style={{ animationDelay: "0.5s" }}>
                <div className="font-cartoon">🗺️ 8 STATES</div>
              </div>
              <div className="bg-blue-500 text-white px-6 py-3 font-bold text-lg rounded-full border-4 border-white shadow-cartoon animate-float" style={{ animationDelay: "1s" }}>
                <div className="font-cartoon">✨ ENDLESS FUN!</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Cartoon road at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="h-4 bg-gradient-to-r from-yellow-400 via-white to-yellow-400 cartoon-road"></div>
          <div className="h-2 bg-gray-800"></div>
        </div>
      </div>

      {/* Enhanced Map Section with Cartoon Styling */}
      <div className="w-full px-2 sm:px-3 py-3">
        <div className="relative w-full">
          {/* Cartoon frame decoration */}
          <div className="absolute -inset-3 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-3xl opacity-80 cartoon-glow"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-yellow-300 via-green-300 to-blue-300 rounded-2xl opacity-60"></div>
          
          <div className="relative bg-white rounded-2xl p-3 border-6 border-purple-500 shadow-cartoon">
            {/* Cartoon map title */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-4 rounded-2xl mb-3 border-4 border-white">
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-red-600 font-bold text-sm">66</span>
                </div>
                <h2 className="font-cartoon text-xl font-bold tracking-wider">🗺️ INTERACTIVE MAP! 🗺️</h2>
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-red-600 font-bold text-sm">⭐</span>
                </div>
              </div>
            </div>
            
            <Route66Map />
            
            {/* Cartoon map legend */}
            <div className="mt-3 bg-yellow-100 rounded-2xl p-4 border-4 border-yellow-400">
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                  <span className="font-cartoon text-purple-800 font-bold">🏘️ Cool Towns</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-2 bg-orange-400 rounded-full border-2 border-white"></div>
                  <span className="font-cartoon text-purple-800 font-bold">🛣️ Route 66</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                  <span className="font-cartoon text-purple-800 font-bold">💎 Fun Spots</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cartoon Footer */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 text-white py-8 mt-6 relative overflow-hidden">
        {/* Cartoon pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 30% 70%, white 4px, transparent 4px),
              radial-gradient(circle at 70% 30%, yellow 3px, transparent 3px)
            `,
            backgroundSize: '50px 50px, 70px 70px'
          }}></div>
        </div>
        
        <div className="w-full px-6 text-center relative z-10">
          {/* Cartoon city bubbles */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-6">
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { city: 'CHICAGO', emoji: '🏙️' },
                { city: 'ST. LOUIS', emoji: '🌉' },
                { city: 'TULSA', emoji: '🛢️' },
                { city: 'AMARILLO', emoji: '🤠' },
                { city: 'ALBUQUERQUE', emoji: '🌵' },
                { city: 'FLAGSTAFF', emoji: '🏔️' },
                { city: 'SANTA MONICA', emoji: '🏖️' }
              ].map((location, index) => (
                <div key={location.city} className="bg-white text-purple-800 px-4 py-3 rounded-full border-4 border-yellow-400 cartoon-bubble transform hover:scale-110 transition-transform duration-300">
                  <div className="font-cartoon text-sm font-bold">{location.emoji} {location.city}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Cartoon divider */}
          <div className="border-t-6 border-yellow-400 pt-6 mb-4 cartoon-zigzag">
            <div className="flex justify-center mb-3">
              <div className="bg-yellow-400 text-purple-800 px-8 py-3 rounded-full font-bold border-4 border-white cartoon-bounce">
                <span className="font-cartoon text-lg">🎉 LET'S GO ON ROUTE 66! 🎉</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="font-cartoon text-yellow-300 text-xl font-bold">
              © 2024 Route 66 Fun Zone • Making Road Trips Awesome! 🚗💨
            </p>
            <p className="text-yellow-200 text-lg font-cartoon">
              "The most fun road in America!" 🌟
            </p>
            <div className="flex justify-center gap-4 text-base opacity-90">
              <span className="font-cartoon">🎂 Since 1926</span>
              <span>•</span>
              <span className="font-cartoon">📏 2,448 Miles</span>
              <span>•</span>
              <span className="font-cartoon">🗺️ 8 States</span>
              <span>•</span>
              <span className="font-cartoon">🎮 Endless Fun</span>
            </div>
          </div>
        </div>
        
        {/* Cartoon bottom stripe */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 cartoon-stripe"></div>
      </div>
    </div>
  );
};

export default Index;
