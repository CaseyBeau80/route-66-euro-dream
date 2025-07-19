
import { useLocation, useNavigate } from "react-router-dom";
import { smoothScrollToSection } from "@/utils/smoothScroll";

export const useNavigationHelper = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigateToSection = (sectionId: string, targetPath: string = "/") => {
    if (location.pathname === targetPath) {
      // Same page - smooth scroll to section
      smoothScrollToSection(sectionId);
    } else {
      // Different page - navigate first, then scroll after a delay
      navigate(targetPath);
      setTimeout(() => {
        smoothScrollToSection(sectionId);
      }, 100);
    }
  };

  return { navigateToSection };
};
