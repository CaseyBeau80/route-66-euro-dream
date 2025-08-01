
import { CategoryData } from '../types';
import { ListingCarousel } from './ListingCarousel';

interface CategorySectionProps {
  categoryKey: string;
  categoryData: CategoryData;
}

export const CategorySection = ({ categoryKey, categoryData }: CategorySectionProps) => {
  return (
    <div className="mb-16 bg-white p-8 rounded-xl shadow-2xl border-4 border-route66-primary">
      <div className="flex items-center gap-3 mb-8">
        <div className={`w-12 h-12 bg-route66-primary rounded-lg flex items-center justify-center text-white text-2xl shadow-xl border-4 border-route66-primary-dark`}>
          {categoryData.icon}
        </div>
        <div>
          <h2 className="text-3xl font-route66 text-route66-primary font-bold">{categoryData.title}</h2>
          <p className="text-route66-text-secondary font-semibold">Discover amazing places along Route 66</p>
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
