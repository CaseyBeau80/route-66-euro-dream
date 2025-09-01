
import { useListingsData } from './ComprehensiveListings/hooks/useListingsData';
import { CategorySection } from './ComprehensiveListings/components/CategorySection';

const ComprehensiveListings = () => {
  const { categories } = useListingsData();

  return (
    <section className="py-16 bg-route66-background-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 bg-route66-background p-8 rounded-xl shadow-2xl border-4 border-route66-primary">
          <h1 className="text-4xl font-route66 text-route66-primary mb-4 font-bold">Discover Route 66</h1>
          <p className="text-xl text-route66-text-secondary max-w-3xl mx-auto font-semibold">
            Explore the complete collection of destinations, attractions, and hidden gems along America's most famous highway
          </p>
        </div>

        {Object.entries(categories).slice(0, 2).map(([key, data]) => ( // Limit to 2 categories for FID optimization
          <CategorySection key={key} categoryKey={key} categoryData={data} />
        ))}
      </div>
    </section>
  );
};

export default ComprehensiveListings;
