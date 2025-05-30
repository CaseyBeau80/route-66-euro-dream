
import Route66Map from "../components/Route66Map";

const Index = () => {
  console.log("🏠 Index page: Loading Route66Map with Google Maps only");
  
  return (
    <div className="container max-w-[1400px] mx-auto px-4">
      <Route66Map />
    </div>
  );
};

export default Index;
