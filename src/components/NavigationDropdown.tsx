import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Check } from "lucide-react";
import { navigationItems } from "./NavigationBar/constants/navigationConfig";

const NavigationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const getCurrentRoute = () => {
    const currentItem = navigationItems.find(item => item.href === location.pathname);
    return currentItem || { name: "Page", href: location.pathname, icon: () => null };
  };

  const handleRouteSelect = (href: string) => {
    navigate(href);
    setIsOpen(false);
  };

  const currentRoute = getCurrentRoute();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[160px] justify-between"
      >
        <div className="flex items-center gap-2">
          <currentRoute.icon size={16} />
          <span className="font-medium">{currentRoute.name}</span>
        </div>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-20">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === location.pathname;
              
              return (
                <button
                  key={item.href}
                  onClick={() => handleRouteSelect(item.href)}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <Icon size={16} />
                  <span className="font-medium">{item.name}</span>
                  {isActive && <Check size={16} className="ml-auto text-blue-600" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default NavigationDropdown;