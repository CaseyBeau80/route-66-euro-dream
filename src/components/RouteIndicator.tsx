import { useLocation } from "react-router-dom";
import { navigationItems } from "./NavigationBar/constants/navigationConfig";

const RouteIndicator = () => {
  const location = useLocation();
  
  const getCurrentRouteName = () => {
    const currentItem = navigationItems.find(item => item.href === location.pathname);
    return currentItem ? currentItem.name : "Page";
  };

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>Current:</span>
      <span className="font-medium text-foreground">{getCurrentRouteName()}</span>
    </div>
  );
};

export default RouteIndicator;