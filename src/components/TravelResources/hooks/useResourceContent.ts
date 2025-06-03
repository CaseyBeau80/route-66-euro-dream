
import { resourcesContent } from "../content";
import { ResourceContent } from "../types";

export const useResourceContent = (language: string): ResourceContent => {
  console.log("🚗 useResourceContent: Getting content for language:", language);
  
  const content = resourcesContent[language as keyof typeof resourcesContent] || resourcesContent.en;
  
  console.log("🚗 useResourceContent: Content loaded:", content.title);
  
  return content;
};
