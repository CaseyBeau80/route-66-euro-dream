
import { useListingsData } from './ComprehensiveListings/hooks/useListingsData';
import { CategorySection } from './ComprehensiveListings/components/CategorySection';

const ComprehensiveListings = () => {
  const { categories } = useListingsData();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-route66 text-route66-red mb-4">Discover Route 66</h1>
          <p className="text-xl text-route66-gray max-w-3xl mx-auto">
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
