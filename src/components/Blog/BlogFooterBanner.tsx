import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogFooterBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-route66-primary/10 via-route66-primary/5 to-route66-primary/10 
      border-t border-b border-route66-primary/20 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-route66-primary" />
            <span className="text-route66-brown font-medium">
              Weekly Route 66 updates — fresh every week from Tulsa.
            </span>
          </div>
          <Link 
            to="/contact"
            className="inline-flex items-center gap-1 text-route66-primary font-semibold 
              hover:text-route66-primary-dark transition-colors group"
          >
            Subscribe for the latest!
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogFooterBanner;
