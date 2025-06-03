
import { ArrowRight } from "lucide-react";

type PopularArticlesSectionProps = {
  title: string;
  articles: string[];
};

const PopularArticlesSection = ({ title, articles }: PopularArticlesSectionProps) => {
  return (
    <div className="bg-gray-50 p-8 rounded-xl shadow-lg border-2 border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        {articles.map((article, index) => (
          <a 
            key={index} 
            href="#" 
            className="text-gray-700 hover:text-route66-red transition-colors flex items-center group font-medium"
          >
            <ArrowRight 
              size={16} 
              className="mr-3 text-route66-red opacity-0 group-hover:opacity-100 transition-opacity" 
            />
            {article}
          </a>
        ))}
      </div>
    </div>
  );
};

export default PopularArticlesSection;
