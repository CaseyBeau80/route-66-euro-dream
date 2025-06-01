
const RouteFooterSection = () => {
  console.log("🎨 RouteFooterSection: Rendering vintage travel poster footer");
  
  return (
    <div className="bg-gradient-to-r from-route66-navy via-route66-vintage-blue to-route66-navy text-white py-8 mt-6 relative overflow-hidden travel-poster-edge">
      {/* Vintage pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 30% 70%, white 3px, transparent 3px),
            radial-gradient(circle at 70% 30%, rgba(244,208,63,0.8) 2px, transparent 2px)
          `,
          backgroundSize: '40px 40px, 60px 60px'
        }}></div>
      </div>
      
      <div className="w-full px-6 text-center relative z-10">
        {/* Vintage city route markers */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-6">
          <div className="flex flex-wrap justify-center gap-2">
            {[{
              city: 'CHICAGO',
              state: 'IL'
            }, {
              city: 'ST. LOUIS',
              state: 'MO'
            }, {
              city: 'TULSA',
              state: 'OK'
            }, {
              city: 'AMARILLO',
              state: 'TX'
            }, {
              city: 'ALBUQUERQUE',
              state: 'NM'
            }, {
              city: 'FLAGSTAFF',
              state: 'AZ'
            }, {
              city: 'SANTA MONICA',
              state: 'CA'
            }].map((location, index) => (
              <div key={location.city} className="vintage-postcard px-3 py-2 text-route66-vintage-brown transform hover:rotate-1 transition-transform">
                <div className="font-americana text-xs font-bold">{location.city}</div>
                <div className="font-travel text-xs opacity-80">{location.state}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Vintage divider */}
        <div className="border-t-4 border-route66-vintage-yellow pt-6 mb-4">
          <div className="flex justify-center mb-3">
            <div className="bg-route66-vintage-yellow text-route66-navy px-6 py-2 rounded-full font-bold stamp-effect">
              <span className="font-americana">GET YOUR KICKS ON ROUTE 66!</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <p className="font-vintage text-route66-cream text-lg font-bold">
            © 2024 Route 66 Explorer • Preserving America's Highway Heritage
          </p>
          <p className="text-route66-tan text-sm handwritten-style">
            "The road that built America, mile by mile, story by story"
          </p>
          <div className="flex justify-center gap-4 text-xs opacity-80">
            <span className="font-travel">Est. 1926</span>
            <span>•</span>
            <span className="font-travel">2,448 Miles</span>
            <span>•</span>
            <span className="font-travel">8 States</span>
            <span>•</span>
            <span className="font-travel">Endless Adventure</span>
          </div>
        </div>
      </div>
      
      {/* Bottom vintage stripe */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-route66-vintage-red via-route66-vintage-yellow to-route66-vintage-red"></div>
    </div>
  );
};

export default RouteFooterSection;
