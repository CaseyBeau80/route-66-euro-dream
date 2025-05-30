
import Route66Map from "../components/Route66Map";

const Index = () => {
  console.log("🏠 Index page: Rendering with Route66Map");
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-red-600 text-white py-8">
        <div className="container max-w-[1400px] mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">Route 66 Explorer</h1>
          <p className="text-xl">Discover the historic highway and its hidden gems</p>
        </div>
      </div>

      {/* Map Section */}
      <div className="container max-w-[1400px] mx-auto px-4 py-8">
        <Route66Map />
      </div>

      {/* Footer Section */}
      <div className="bg-gray-800 text-white py-8 mt-16">
        <div className="container max-w-[1400px] mx-auto px-4 text-center">
          <p>&copy; 2024 Route 66 Explorer. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
