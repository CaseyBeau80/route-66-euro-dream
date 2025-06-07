
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-3 group">
      <div className="relative">
        <img 
          src="https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?auto=format&fit=crop&w=40&h=40&q=80" 
          alt="Route 66 logo" 
          className="w-10 h-10 rounded-full object-cover transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
        />
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-route66-primary/20 to-route66-primary-light/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <span className="font-route66 text-2xl text-route66-primary group-hover:text-route66-primary-dark transition-colors duration-300">
        ROUTE 66
      </span>
    </Link>
  );
};

export default Logo;
