
import { ArrowRight } from "lucide-react";

type PopularArticlesSectionProps = {
  title: string;
  articles: string[];
};

const PopularArticlesSection = ({ title, articles }: PopularArticlesSectionProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-bold text-route66-blue mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
        {articles.map((article, index) => (
          <a 
            key={index} 
            href="#" 
            className="text-route66-gray hover:text-route66-red transition-colors flex items-center group"
          >
            <ArrowRight 
              size={14} 
              className="mr-2 text-route66-red opacity-0 group-hover:opacity-100 transition-opacity" 
            />
            {article}
          </a>
        ))}
      </div>
    </div>
  );
};

export default PopularArticlesSection;
