import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Share2, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  featuredImageUrl?: string;
  publishedAt: string;
  authorName: string;
  tags?: string[];
  featured?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({
  slug, title, excerpt, featuredImageUrl, publishedAt, authorName, tags, featured
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
      toast({ title: "Link copied!", description: "Share this post with your friends." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = postUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      toast({ title: "Link copied!", description: "Share this post with your friends." });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className={`group rounded-lg overflow-hidden bg-white shadow-sm 
      hover:shadow-xl transition-all duration-500 border border-route66-sand/20
      hover:border-l-4 hover:border-l-route66-rust ${featured ? 'lg:flex' : ''}`}>
      {/* Image with overlay */}
      <Link to={`/blog/${slug}`} className={`block relative overflow-hidden ${featured ? 'lg:w-3/5' : ''}`}>
        <div className={`${featured ? 'aspect-[16/9]' : 'aspect-[3/2]'} overflow-hidden`}>
          <img 
            src={featuredImageUrl || '/placeholder.svg'} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        </div>
        {/* Dark gradient overlay at bottom of image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {/* Title overlaid on image */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
          <h3 className={`font-playfair font-bold text-white leading-tight 
            ${featured ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-lg md:text-xl'}`}>
            {title}
          </h3>
        </div>
      </Link>
      
      {/* Content block below image */}
      <div className={`p-5 ${featured ? 'lg:w-2/5 lg:flex lg:flex-col lg:justify-center' : ''}`}>
        {/* Date & Author */}
        <div className="flex items-center gap-3 text-sm text-route66-brown/50 mb-3">
          <Calendar className="h-3.5 w-3.5" />
          <span>{format(new Date(publishedAt), 'MMMM d, yyyy')}</span>
          <span className="text-route66-sand">·</span>
          <span className="font-medium text-route66-brown/70">{authorName}</span>
        </div>

        {/* Excerpt - only on featured or always visible */}
        {featured && (
          <p className="text-route66-brown/60 leading-relaxed mb-4 line-clamp-3">
            {excerpt}
          </p>
        )}
        
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2.5 py-0.5 bg-route66-cream text-route66-brown/60 
                text-xs rounded font-medium uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-route66-sand/20">
          <Link 
            to={`/blog/${slug}`}
            className="text-sm font-semibold text-route66-primary hover:text-route66-rust 
              transition-colors uppercase tracking-wider"
          >
            Read Story →
          </Link>
          <button
            onClick={handleShare}
            className="p-2 text-route66-brown/30 hover:text-route66-primary 
              hover:bg-route66-primary/5 rounded-full transition-colors"
            aria-label="Copy link to share"
          >
            {copied ? <Check className="h-4 w-4 text-route66-primary" /> : <Share2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
