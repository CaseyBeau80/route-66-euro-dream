import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import SocialMetaTags from "@/components/shared/SocialMetaTags";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.log('NotFound component rendering for path:', location.pathname);
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <SocialMetaTags 
        path="/"
        title="Page Not Found – Ramble 66"
        description="The page you're looking for doesn't exist. Return to Ramble 66 to plan your Route 66 trip."
      />
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
