import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RelatedPost {
  slug: string;
  title: string;
  featured_image_url?: string;
}

interface BlogSidebarProps {
  relatedPosts?: RelatedPost[];
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({ relatedPosts = [] }) => {
  return (
    <aside className="space-y-6">
      {/* Photo Wall CTA - Links to /#social */}
      <div className="bg-gradient-to-br from-route66-orange-700 to-route66-orange 
        rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Camera className="h-8 w-8" />
          <h3 className="text-xl font-bold">Share Your Journey!</h3>
        </div>
        <p className="text-white/90 mb-4">
          Upload your Route 66 photos to our community Photo Wall and inspire fellow road trippers!
        </p>
        <Link to="/#social">
          <Button 
            className="w-full bg-white hover:bg-route66-cream 
              text-route66-rust font-semibold gap-2"
          >
            <Camera className="h-4 w-4" />
            Upload Photo
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      
      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-route66-sand/30">
          <h3 className="text-lg font-bold text-route66-brown mb-4">
            Related Posts
          </h3>
          <div className="space-y-4">
            {relatedPosts.slice(0, 3).map((post) => (
              <Link 
                key={post.slug} 
                to={`/blog/${post.slug}`}
                className="flex gap-3 group"
              >
                <img 
                  src={post.featured_image_url || '/placeholder.svg'}
                  alt={post.title}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  loading="lazy"
                />
                <h4 className="text-sm font-medium text-route66-brown/80 
                  group-hover:text-route66-rust transition-colors line-clamp-2">
                  {post.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Newsletter CTA */}
      <div className="bg-route66-cream rounded-xl p-6 border border-route66-sand/30">
        <h3 className="text-lg font-bold text-route66-brown mb-2">
          Stay Updated
        </h3>
        <p className="text-route66-brown/70 text-sm mb-4">
          Get the latest Route 66 news and travel tips delivered to your inbox.
        </p>
        <Link to="/contact">
          <Button variant="outline" className="w-full border-route66-rust text-route66-rust hover:bg-route66-rust hover:text-white">
            Subscribe
          </Button>
        </Link>
      </div>
    </aside>
  );
};

export default BlogSidebar;
