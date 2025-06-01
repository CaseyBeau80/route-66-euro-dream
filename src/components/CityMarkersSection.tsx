
const CityMarkersSection = () => {
  console.log("🏙️ CityMarkersSection: Rendering vintage city route markers");
  
  const cities = [
    { city: 'CHICAGO', state: 'IL' },
    { city: 'ST. LOUIS', state: 'MO' },
    { city: 'TULSA', state: 'OK' },
    { city: 'AMARILLO', state: 'TX' },
    { city: 'ALBUQUERQUE', state: 'NM' },
    { city: 'FLAGSTAFF', state: 'AZ' },
    { city: 'SANTA MONICA', state: 'CA' }
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-6">
      <div className="flex flex-wrap justify-center gap-2">
        {cities.map((location, index) => (
          <div key={location.city} className="vintage-postcard px-3 py-2 text-route66-vintage-brown transform hover:rotate-1 transition-transform">
            <div className="font-americana text-xs font-bold">{location.city}</div>
            <div className="font-travel text-xs opacity-80">{location.state}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CityMarkersSection;
