import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Share2, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import route66Shield from '@/assets/route66-shield.png';

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

const ImagePlaceholder = ({ className }: { className?: string }) => (
  <div className={`bg-route66-cream flex items-center justify-center ${className || ''}`}>
    <img src={route66Shield} alt="Route 66" className="w-16 h-auto opacity-60" />
  </div>
);

const BlogCard: React.FC<BlogCardProps> = ({
  slug, title, excerpt, featuredImageUrl, publishedAt, authorName, tags, featured
}) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
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

  const showImage = featuredImageUrl && !imgError;

  // ── Featured card (vertical, large) ──
  if (featured) {
    return (
      <article className="group rounded-sm overflow-hidden bg-white shadow-sm 
        hover:shadow-xl transition-all duration-500 border-2 border-route66-sand/20
        hover:border-l-4 hover:border-l-route66-rust lg:flex">
        <Link to={`/blog/${slug}`} className="block relative overflow-hidden lg:w-3/5">
          <div className="aspect-[16/9] overflow-hidden">
            {showImage ? (
              <img
                src={featuredImageUrl}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                onError={() => setImgError(true)}
              />
            ) : (
              <ImagePlaceholder className="w-full h-full" />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
            <h3 className="font-playfair font-bold text-white leading-tight text-2xl md:text-3xl lg:text-4xl">
              {title}
            </h3>
          </div>
        </Link>
        <div className="p-5 lg:w-2/5 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-sm text-route66-brown/50 mb-3">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>{format(new Date(publishedAt), 'MMMM d, yyyy')}</span>
              <span>·</span>
              <span className="font-medium">{authorName}</span>
            </div>
            <p className="text-route66-brown/60 leading-relaxed mb-4 line-clamp-3">
              {excerpt}
            </p>
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-route66-sand/40 text-route66-brown/60 
                    text-xs rounded-full font-medium uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-route66-sand/20">
            <Link
              to={`/blog/${slug}`}
              className="text-sm font-semibold text-route66-primary hover:text-route66-rust 
                transition-colors uppercase tracking-wider font-special-elite"
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
  }

  // ── Non-featured card (horizontal) ──
  return (
    <article className="group rounded-sm overflow-hidden bg-white shadow-sm 
      hover:shadow-xl transition-all duration-500 border-2 border-route66-sand/20
      hover:border-l-4 hover:border-l-route66-rust flex flex-row">
      {/* Fixed-width image */}
      <Link to={`/blog/${slug}`} className="block w-48 shrink-0 min-h-[9rem] overflow-hidden">
        {showImage ? (
          <img
            src={featuredImageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <ImagePlaceholder className="w-full h-full" />
        )}
      </Link>

      {/* Content area */}
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div>
          {/* Metadata */}
          <div className="flex items-center gap-1.5 text-sm text-route66-brown/50 mb-2">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>{format(new Date(publishedAt), 'MMMM d, yyyy')}</span>
            <span>·</span>
            <span className="font-medium">{authorName}</span>
          </div>

          {/* Title */}
          <Link to={`/blog/${slug}`}>
            <h3 className="font-playfair text-lg font-semibold text-route66-brown leading-tight line-clamp-2 
              group-hover:text-route66-primary transition-colors mb-2">
              {title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="text-sm text-route66-brown/60 leading-relaxed line-clamp-2 mb-2">
            {excerpt}
          </p>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-route66-sand/40 text-route66-brown/60 
                  text-xs rounded-full font-medium uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-route66-sand/20">
          <Link
            to={`/blog/${slug}`}
            className="text-sm font-semibold text-route66-primary hover:text-route66-rust 
              transition-colors uppercase tracking-wider font-special-elite"
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
