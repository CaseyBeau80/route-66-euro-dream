
export type TravelResourcesProps = {
  language: string;
};

export type ResourceCategory = {
  title: string;
  description: string;
  link: string;
};

export type ResourceContent = {
  title: string;
  subtitle: string;
  categories: ResourceCategory[];
  popularArticles: string;
  articles: string[];
};

export type ResourcesContentMap = {
  [key: string]: ResourceContent;
};
