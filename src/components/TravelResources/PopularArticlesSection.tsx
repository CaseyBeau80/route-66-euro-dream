
import { ArrowRight } from "lucide-react";

type PopularArticlesSectionProps = {
  title: string;
  articles: string[];
};

const PopularArticlesSection = ({ title, articles }: PopularArticlesSectionProps) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl border-4 border-route66-red">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 font-route66">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        {articles.map((article, index) => (
          <a 
            key={index} 
            href="#" 
            className="text-gray-800 hover:text-route66-red transition-colors flex items-center group font-semibold text-base leading-relaxed"
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
