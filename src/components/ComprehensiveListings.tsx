
import { useListingsData } from './ComprehensiveListings/hooks/useListingsData';
import { CategorySection } from './ComprehensiveListings/components/CategorySection';

const ComprehensiveListings = () => {
  const { categories } = useListingsData();

  return (
    <section className="py-16 bg-route66-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 bg-white p-8 rounded-xl shadow-lg border-3 border-route66-red">
          <h1 className="text-4xl font-route66 text-route66-red mb-4 font-bold">Discover Route 66</h1>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto font-semibold">
            Explore the complete collection of destinations, attractions, and hidden gems along America's most famous highway
          </p>
        </div>

        {Object.entries(categories).map(([key, data]) => (
          <CategorySection key={key} categoryKey={key} categoryData={data} />
        ))}
      </div>
    </section>
  );
};

export default ComprehensiveListings;
