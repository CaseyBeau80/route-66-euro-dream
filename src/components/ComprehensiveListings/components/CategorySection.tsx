
import { CategoryData } from '../types';
import { ListingCarousel } from './ListingCarousel';

interface CategorySectionProps {
  categoryKey: string;
  categoryData: CategoryData;
}

export const CategorySection = ({ categoryKey, categoryData }: CategorySectionProps) => {
  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <div className={`w-12 h-12 bg-route66-red rounded-lg flex items-center justify-center text-white text-2xl shadow-lg border-2 border-route66-vintage-brown`}>
          {categoryData.icon}
        </div>
        <div>
          <h2 className="text-3xl font-route66 text-route66-red">{categoryData.title}</h2>
          <p className="text-gray-900 font-semibold">Discover amazing places along Route 66</p>
        </div>
      </div>

      <ListingCarousel 
        items={categoryData.items}
        loading={categoryData.loading}
        categoryTitle={categoryData.title}
      />
    </div>
  );
};
