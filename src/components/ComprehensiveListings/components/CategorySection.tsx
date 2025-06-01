
import { CategoryData } from '../types';
import { ListingCard } from './ListingCard';
import { LoadingCard } from './LoadingCard';

interface CategorySectionProps {
  categoryKey: string;
  categoryData: CategoryData;
}

export const CategorySection = ({ categoryKey, categoryData }: CategorySectionProps) => {
  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <div className={`w-12 h-12 ${categoryData.color} rounded-lg flex items-center justify-center text-white text-2xl shadow-lg`}>
          {categoryData.icon}
        </div>
        <div>
          <h2 className="text-3xl font-route66 text-route66-red">{categoryData.title}</h2>
          <p className="text-route66-gray">Discover amazing places along Route 66</p>
        </div>
      </div>

      {categoryData.loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <LoadingCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryData.items.map((item) => (
            <ListingCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {!categoryData.loading && categoryData.items.length === 0 && (
        <div className="text-center py-12 text-route66-gray/60">
          <p className="text-lg">No {categoryData.title.toLowerCase()} found at the moment.</p>
          <p className="text-sm">Check back soon for new additions!</p>
        </div>
      )}
    </div>
  );
};
