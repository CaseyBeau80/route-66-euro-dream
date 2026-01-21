import React from 'react';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import AuthorBadge from './AuthorBadge';

interface BlogPostContentProps {
  title: string;
  content: string;
  publishedAt: string;
  authorName: string;
  featuredImageUrl?: string;
  tags?: string[];
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({
  title, content, publishedAt, authorName, featuredImageUrl, tags
}) => {
  // Simple markdown-like rendering
  const renderContent = (text: string) => {
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('# ')) {
        return (
          <h2 key={idx} className="text-2xl md:text-3xl font-bold text-route66-brown mt-8 mb-4">
            {trimmed.slice(2)}
          </h2>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h3 key={idx} className="text-xl md:text-2xl font-bold text-route66-brown mt-6 mb-3">
            {trimmed.slice(3)}
          </h3>
        );
      }
      if (trimmed === '') return null;
      
      // Handle bold text with **
      const parts = trimmed.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-route66-brown">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      
      return (
        <p key={idx} className="mb-4 leading-relaxed text-route66-brown/80">
          {formattedLine}
        </p>
      );
    });
  };

  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Featured Image */}
      {featuredImageUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={featuredImageUrl} 
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6 md:p-8 lg:p-10">
        {/* Back to Blog */}
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-route66-rust hover:text-route66-orange 
            transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
        
        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-route66-brown mb-6 font-display">
          {title}
        </h1>
        
        {/* Author and Date Section */}
        <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-route66-sand/50">
          {/* Author Badge with Mascot */}
          <div className="flex items-center gap-3 bg-route66-orange/10 
            px-4 py-2 rounded-full border border-route66-orange/30">
            <AuthorBadge authorName={authorName} size="lg" />
          </div>
          
          {/* Publish Date */}
          <div className="flex items-center gap-2 text-route66-brown/60">
            <Calendar className="h-5 w-5" />
            <span className="font-medium">
              {format(new Date(publishedAt), 'MMMM d, yyyy')}
            </span>
          </div>
        </div>
        
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-route66-rust/10 
                text-route66-rust text-sm rounded-full font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {renderContent(content)}
        </div>
      </div>
    </article>
  );
};

export default BlogPostContent;
