import React from 'react';
import { Calendar, ArrowLeft, ExternalLink, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import AuthorBadge from './AuthorBadge';
import YouTubeEmbed from '../YouTubeEmbed';
import SharePost from './SharePost';
// Extract YouTube video ID from various URL formats
const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};
interface BlogPostContentProps {
  title: string;
  content: string;
  publishedAt: string;
  authorName: string;
  featuredImageUrl?: string;
  tags?: string[];
}

// Auto-link map for specific phrases (no Azusa - now uses inline markdown link)
const AUTO_LINKS: Record<string, string> = {
  "Route 66 Capital Cruise": "https://www.capitalofroute66.com",
  "AAA Route 66 Road Fest": "https://route66roadfest.com",
  "ROUTE Magazine Centennial Sweepstakes": "https://www.routemagazine.us/centennialsweepstakes",
  "Route 66 Centennial Monument Project": "https://route66centennial.org/commemorate-programs-projects/centennial-monument-project"
};

const BlogPostContent: React.FC<BlogPostContentProps> = ({
  title, content, publishedAt, authorName, featuredImageUrl, tags
}) => {
  // Process inline elements (markdown links, auto-links, bold)
  const processInlineElements = (text: string, keyPrefix: string): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    
    // Collect all link matches (markdown links first, then auto-links)
    const linkMatches: { start: number; end: number; text: string; url: string; isMarkdown: boolean }[] = [];
    
    // 1. Find markdown links [text](url)
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = markdownLinkRegex.exec(text)) !== null) {
      linkMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[1],
        url: match[2],
        isMarkdown: true
      });
    }
    
    // 2. Find auto-link phrases (only if not overlapping with markdown links)
    Object.entries(AUTO_LINKS).forEach(([phrase, url]) => {
      let index = text.indexOf(phrase);
      while (index !== -1) {
        // Check if this overlaps with any markdown link
        const overlaps = linkMatches.some(m => 
          m.isMarkdown && index >= m.start && index < m.end
        );
        if (!overlaps) {
          linkMatches.push({ start: index, end: index + phrase.length, text: phrase, url, isMarkdown: false });
        }
        index = text.indexOf(phrase, index + phrase.length);
      }
    });
    
    // 3. Check for "Photo Wall" internal link
    const photoWallIndex = text.indexOf("Photo Wall");
    if (photoWallIndex !== -1) {
      const overlaps = linkMatches.some(m => 
        m.isMarkdown && photoWallIndex >= m.start && photoWallIndex < m.end
      );
      if (!overlaps) {
        linkMatches.push({ 
          start: photoWallIndex, 
          end: photoWallIndex + "Photo Wall".length, 
          text: "Photo Wall", 
          url: "/#social",
          isMarkdown: false
        });
      }
    }
    
    // Sort matches by position
    linkMatches.sort((a, b) => a.start - b.start);
    
    // Build elements array
    linkMatches.forEach((linkMatch, idx) => {
      // Add text before this match
      if (linkMatch.start > lastIndex) {
        const beforeText = text.slice(lastIndex, linkMatch.start);
        elements.push(...processTextWithBold(beforeText, `${keyPrefix}-pre-${idx}`));
      }
      
      // Add the link
      if (linkMatch.url.startsWith('/') || linkMatch.url.startsWith('#')) {
        // Internal link
        elements.push(
          <Link 
            key={`${keyPrefix}-link-${idx}`}
            to={linkMatch.url}
            className="text-route66-primary font-medium hover:underline"
          >
            {linkMatch.text}
          </Link>
        );
      } else {
        // External link
        elements.push(
          <a 
            key={`${keyPrefix}-link-${idx}`}
            href={linkMatch.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-route66-primary hover:underline inline-flex items-center gap-1"
          >
            {linkMatch.text}
            <ExternalLink className="h-3 w-3" />
          </a>
        );
      }
      
      lastIndex = linkMatch.end;
    });
    
    // Add remaining text
    if (lastIndex < text.length) {
      elements.push(...processTextWithBold(text.slice(lastIndex), `${keyPrefix}-end`));
    }
    
    return elements.length > 0 ? elements : processTextWithBold(text, keyPrefix);
  };
  
  // Process bold text with **
  const processTextWithBold = (text: string, keyPrefix: string): React.ReactNode[] => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={`${keyPrefix}-bold-${i}`} className="text-route66-brown">{part.slice(2, -2)}</strong>;
      }
      return part;
    }).filter(part => part !== '');
  };

  // Enhanced markdown-like rendering
  const renderContent = (text: string) => {
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      
      // Handle ### headings (subsections)
      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-lg md:text-xl font-semibold text-route66-brown mt-5 mb-2">
            {trimmed.slice(4)}
          </h4>
        );
      }
      
      // Handle ## headings (main sections)
      if (trimmed.startsWith('## ')) {
        return (
          <h3 key={idx} className="text-xl md:text-2xl font-bold text-route66-brown mt-6 mb-3">
            {trimmed.slice(3)}
          </h3>
        );
      }
      
      // Handle # headings
      if (trimmed.startsWith('# ')) {
        return (
          <h2 key={idx} className="text-2xl md:text-3xl font-bold text-route66-brown mt-8 mb-4">
            {trimmed.slice(2)}
          </h2>
        );
      }
      
      // Handle inline images ![alt](url) or ![alt](url "caption")
      const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)"]+)(?:\s+"([^"]*)")?\)$/);
      if (imageMatch) {
        const [, alt, src, caption] = imageMatch;
        return (
          <figure key={idx} className="my-8 max-w-2xl mx-auto">
            <img 
              src={src} 
              alt={alt} 
              className="rounded-lg shadow-md w-full"
              loading="lazy"
            />
            {caption && (
              <figcaption className="text-sm italic text-route66-brown/60 text-center mt-2">
                {caption}
              </figcaption>
            )}
          </figure>
        );
      }
      
      // Empty lines
      if (trimmed === '') return null;
      
      // Handle "Worth Watching:" sections with YouTube - special featured rendering
      if (trimmed.toLowerCase().startsWith('worth watching:')) {
        const youtubeUrlInLine = trimmed.match(/(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        
        if (youtubeUrlInLine && youtubeUrlInLine[4] && youtubeUrlInLine[4].length === 11) {
          const videoId = youtubeUrlInLine[4];
          return (
            <div key={idx} className="my-10 w-full max-w-[800px] mx-auto">
              <div className="text-lg font-semibold text-route66-primary mb-4 flex items-center gap-2">
                <Play className="h-5 w-5" />
                Worth Watching
              </div>
              <YouTubeEmbed 
                videoId={videoId} 
                title="Worth Watching - Route 66 Video"
              />
            </div>
          );
        } else {
          // Fallback: Show as regular paragraph with the link
          return (
            <p key={idx} className="mb-4 leading-relaxed text-route66-brown/80">
              {processInlineElements(trimmed, `p-${idx}`)}
            </p>
          );
        }
      }
      
      // Handle standalone YouTube URLs (line is just a URL)
      const youtubeId = extractYouTubeId(trimmed);
      if (youtubeId && /^(https?:\/\/)?(www\.)?youtu/.test(trimmed)) {
        return (
          <div key={idx} className="my-8 w-full max-w-[800px] mx-auto">
            <YouTubeEmbed videoId={youtubeId} title="Route 66 Video" />
          </div>
        );
      }
      
      // Check if paragraph contains a YouTube URL (inline) - extract and render separately
      const youtubeUrlMatch = trimmed.match(/(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (youtubeUrlMatch) {
        const inlineYoutubeId = youtubeUrlMatch[4];
        
        // Validate the extracted ID
        if (inlineYoutubeId && inlineYoutubeId.length === 11) {
          const textWithoutUrl = trimmed.replace(youtubeUrlMatch[0], '').trim();
          
          return (
            <React.Fragment key={idx}>
              {textWithoutUrl && (
                <p className="mb-4 leading-relaxed text-route66-brown/80">
                  {processInlineElements(textWithoutUrl, `p-${idx}`)}
                </p>
              )}
              <div className="my-8 w-full max-w-[800px] mx-auto">
                <YouTubeEmbed videoId={inlineYoutubeId} title="Route 66 Video" />
              </div>
            </React.Fragment>
          );
        } else {
          // Fallback: ID extraction failed, show as clickable link
          return (
            <p key={idx} className="mb-4 leading-relaxed text-route66-brown/80">
              {processInlineElements(trimmed, `p-${idx}`)}
            </p>
          );
        }
      }
      
      // Process paragraphs with inline elements
      return (
        <p key={idx} className="mb-4 leading-relaxed text-route66-brown/80">
          {processInlineElements(trimmed, `p-${idx}`)}
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
          className="inline-flex items-center gap-2 text-route66-primary hover:text-route66-primary/70 
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
        <div className="flex flex-wrap items-center gap-4 mb-4 pb-4 border-b border-route66-sand/50">
          {/* Author Badge with Mascot */}
          <div className="flex items-center gap-3 bg-route66-primary/10 
            px-4 py-2 rounded-full border border-route66-primary/30">
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
        
        {/* Share Section */}
        <SharePost 
          title={title} 
          url={typeof window !== 'undefined' ? window.location.href : ''}
        />
        
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-route66-primary/10 
                text-route66-primary text-sm rounded-full font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {renderContent(content)}
        </div>
        
        {/* Big Bo Author Note */}
        <div className="mt-10 p-5 bg-route66-cream/50 rounded-xl border border-route66-sand/50">
          <p className="text-route66-brown/80 italic leading-relaxed">
            <span className="font-semibold text-route66-brown not-italic">Big Bo Ramble here</span> — 
            planning weekly posts with the freshest Route 66 news and tips. Got ideas or photos? 
            Drop them on the{' '}
            <Link to="/#social" className="text-route66-primary font-medium hover:underline">
              Photo Wall
            </Link>
            {' '}and let me know!
          </p>
        </div>
      </div>
    </article>
  );
};

export default BlogPostContent;
