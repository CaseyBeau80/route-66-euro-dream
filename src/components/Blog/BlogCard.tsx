import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Share2, Check } from 'lucide-react';
import AuthorBadge from './AuthorBadge';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  featuredImageUrl?: string;
  publishedAt: string;
  authorName: string;
  tags?: string[];
}

const BlogCard: React.FC<BlogCardProps> = ({
  slug, title, excerpt, featuredImageUrl, publishedAt, authorName, tags
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const postUrl = `${window.location.origin}/blog/${slug}`;
    
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share this post with your friends.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = postUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share this post with your friends.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden 
      hover:shadow-xl transition-all duration-300 group border border-route66-sand/30">
      {/* Featured Image */}
      <Link to={`/blog/${slug}`}>
        <div className="aspect-video overflow-hidden bg-route66-cream">
          <img 
            src={featuredImageUrl || '/placeholder.svg'} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </Link>
      
      {/* Content */}
      <div className="p-6">
        {/* Meta: Date + Author */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-route66-brown/60 text-sm">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(publishedAt), 'MMM d, yyyy')}</span>
          </div>
          <AuthorBadge authorName={authorName} size="sm" />
        </div>
        
        {/* Title */}
        <Link to={`/blog/${slug}`}>
          <h3 className="text-xl font-bold text-route66-brown mb-3 
            group-hover:text-route66-primary transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
        
        {/* Excerpt */}
        <p className="text-route66-brown/70 line-clamp-3 mb-4">
          {excerpt}
        </p>
        
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-1 bg-route66-primary/10 
                text-route66-primary text-xs rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Footer: Read More + Share */}
        <div className="flex items-center justify-between">
          <Link 
            to={`/blog/${slug}`}
            className="inline-flex items-center gap-1 text-route66-primary 
              font-semibold hover:gap-2 transition-all group-hover:underline"
          >
            Read More <ArrowRight className="h-4 w-4" />
          </Link>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleShare}
                  className="p-2 text-route66-brown/40 hover:text-route66-primary 
                    hover:bg-route66-primary/10 rounded-full transition-colors"
                  aria-label="Copy link to share"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-route66-primary" />
                  ) : (
                    <Share2 className="h-4 w-4" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share this post</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
