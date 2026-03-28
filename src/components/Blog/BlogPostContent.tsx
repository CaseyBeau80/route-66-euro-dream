import React, { useMemo } from 'react';
import { ArrowLeft, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AuthorBadge from './AuthorBadge';
import YouTubeEmbed from '../YouTubeEmbed';
import SharePost from './SharePost';

const ROUTE66_STATES: Record<string, string> = {
  IL: 'Illinois', MO: 'Missouri', KS: 'Kansas', OK: 'Oklahoma',
  TX: 'Texas', NM: 'New Mexico', AZ: 'Arizona', CA: 'California',
};

const StateTag = ({ abbr }: { abbr: string }) => (
  <div className="bg-route66-rust/10 border border-route66-rust/30 text-route66-rust rounded-md px-2 py-1 text-center shrink-0">
    <div className="text-xs font-bold leading-tight">{abbr}</div>
    <div className="text-[9px] leading-tight">{ROUTE66_STATES[abbr]}</div>
  </div>
);

const parseStates = (text: string): string[] => {
  const matches = text.match(/\b(IL|MO|KS|OK|TX|NM|AZ|CA)\b/g) || [];
  const unique = [...new Set(matches)];
  const order = ['IL', 'MO', 'KS', 'OK', 'TX', 'NM', 'AZ', 'CA'];
  return order.filter(s => unique.includes(s));
};

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

// Split content into event blocks separated by --- for digest-style posts
const splitEventBlocks = (content: string): { isDigest: boolean; blocks: string[] } => {
  const parts = content.split(/\n---\n/);
  // Consider it a digest if there are 3+ blocks separated by ---
  if (parts.length >= 3) {
    return { isDigest: true, blocks: parts.map(b => b.trim()).filter(Boolean) };
  }
  return { isDigest: false, blocks: [content] };
};

// Extract YouTube URLs from text and render them separately
const extractAndRenderYouTube = (text: string): { cleanText: string; videos: string[] } => {
  const youtubeRegex = /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})\S*/g;
  const videos: string[] = [];
  const cleanText = text.replace(youtubeRegex, (match) => {
    const id = extractYouTubeId(match);
    if (id) videos.push(id);
    return '';
  }).trim();
  return { cleanText, videos };
};

const MarkdownBlock: React.FC<{ content: string; isEventCard?: boolean }> = ({ content, isEventCard }) => {
  const { cleanText, videos } = useMemo(() => extractAndRenderYouTube(content), [content]);
  const states = useMemo(() => isEventCard ? parseStates(content) : [], [content, isEventCard]);

  // Check for "Worth Watching:" pattern
  const worthWatchingMatch = cleanText.match(/worth watching:\s*/i);

  const proseAndVideos = (
    <>
      <div className="prose max-w-none font-lora text-[18px] leading-[1.75]
        prose-headings:font-playfair prose-headings:text-route66-brown prose-headings:tracking-tight
        prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-8 prose-h2:mb-4
        prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-6 prose-h3:mb-3
        prose-h4:text-lg prose-h4:md:text-xl prose-h4:mt-5 prose-h4:mb-2
        prose-p:text-route66-brown/80 prose-p:leading-relaxed prose-p:mb-6
        prose-a:text-route66-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline
        prose-strong:text-route66-brown prose-strong:font-bold
        prose-em:text-route66-brown/70
        prose-hr:border-route66-sand/50
        prose-img:rounded-lg prose-img:shadow-md
        prose-blockquote:border-none prose-blockquote:bg-transparent prose-blockquote:p-0 prose-blockquote:m-0
        prose-li:text-route66-brown/80
      ">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ href, children }) => {
              if (!href) return <>{children}</>;
              const isInternal = href.startsWith('/') || href.startsWith('#');
              if (isInternal) {
                return <Link to={href} className="text-route66-primary font-medium hover:underline">{children}</Link>;
              }
              return (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-route66-primary font-medium hover:underline">
                  {children}
                </a>
              );
            },
            img: ({ src, alt }) => {
              const parts = (alt || '').split('|');
              const imgAlt = parts[0];
              const caption = parts[1];
              return (
                <figure className="my-8 max-w-2xl mx-auto">
                  <img src={src} alt={imgAlt} className="rounded-lg shadow-md w-full" loading="lazy" />
                  {caption && (
                    <figcaption className="text-sm italic text-route66-brown/60 text-center mt-2">
                      {caption}
                    </figcaption>
                  )}
                </figure>
              );
            },
            blockquote: ({ children }) => (
              <blockquote className="my-8 pl-6 border-l-2 border-route66-rust/60 not-prose">
                <div className="flex items-start gap-3">
                  <span className="text-route66-rust/70 text-3xl leading-none font-serif select-none shrink-0 -mt-1">"</span>
                  <div className="font-lora text-[1.25rem] italic leading-relaxed text-route66-brown/80">
                    {children}
                  </div>
                </div>
              </blockquote>
            ),
          }}
        >
          {worthWatchingMatch ? cleanText.replace(/worth watching:\s*/i, '') : cleanText}
        </ReactMarkdown>
      </div>

      {videos.map((videoId, idx) => (
        <div key={idx} className="my-8 w-full max-w-[800px] mx-auto">
          {worthWatchingMatch && idx === 0 && (
            <div className="text-lg font-semibold text-route66-primary mb-4 flex items-center gap-2 font-playfair">
              <Play className="h-5 w-5" />
              Worth Watching
            </div>
          )}
          <YouTubeEmbed videoId={videoId} title="Route 66 Video" />
        </div>
      ))}
    </>
  );

  return (
    <div className={isEventCard 
      ? 'bg-route66-cream/40 border-l-4 border-route66-rust rounded-r-lg p-5 md:p-6 my-6' 
      : ''
    }>
      {isEventCard && states.length > 0 ? (
        <div className="flex flex-row gap-3">
          <div className="shrink-0 flex flex-col items-center gap-1">
            {states.map(abbr => <StateTag key={abbr} abbr={abbr} />)}
          </div>
          <div className="min-w-0 flex-1">
            {proseAndVideos}
          </div>
        </div>
      ) : (
        proseAndVideos
      )}
    </div>
  );
};

const BlogPostContent: React.FC<BlogPostContentProps> = ({
  title, content, publishedAt, authorName, featuredImageUrl, tags
}) => {
  const { isDigest, blocks } = useMemo(() => splitEventBlocks(content), [content]);

  const readTime = useMemo(() => {
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [content]);

  return (
    <article className="bg-[#FAFAF7] rounded-xl shadow-md overflow-hidden">
      {/* Featured Image */}
      {featuredImageUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img src={featuredImageUrl} alt={title} className="w-full h-full object-cover" />
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
        <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-route66-brown mb-6 tracking-tight">
          {title}
        </h1>
        
        {/* Date and Read Time */}
        <div className="flex items-center gap-3 text-route66-brown/50 text-sm mb-4">
          <span>{format(new Date(publishedAt), 'MMMM d, yyyy')}</span>
          <span>·</span>
          <span>🕐 {readTime} min read</span>
        </div>

        {/* Author */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-route66-sand/50">
          <div className="flex items-center gap-3 bg-route66-primary/10 px-4 py-2 rounded-full border border-route66-primary/30">
            <AuthorBadge authorName={authorName} size="lg" />
          </div>
        </div>
        
        {/* Share */}
        <SharePost title={title} url={typeof window !== 'undefined' ? window.location.href : ''} />
        
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-route66-cream text-route66-brown/60 
                text-sm rounded font-medium uppercase tracking-wider">
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Content */}
        <div className="max-w-[680px] mx-auto">
          {isDigest ? (
            <div className="space-y-2">
              {blocks.map((block, idx) => (
                <MarkdownBlock key={idx} content={block} isEventCard />
              ))}
            </div>
          ) : (
            <MarkdownBlock content={content} />
          )}
        
          {/* Big Bo Author Note */}
          <div className="mt-10 p-5 bg-route66-cream/50 rounded-xl border border-route66-sand/50">
          <p className="text-route66-brown/80 italic leading-relaxed">
            <span className="font-semibold text-route66-brown not-italic">Big Bo Ramble here</span> — 
            planning weekly posts with the freshest Route 66 news and tips. Got ideas or photos? 
            Drop them on the{' '}
            <Link to="/#social" className="text-route66-primary font-medium hover:underline">Photo Wall</Link>
            {' '}and let me know!
            </p>
          </div>

          {/* Author Card */}
          <div className="mt-8 flex items-start gap-4 border-l-4 border-route66-rust bg-route66-cream/40 p-5 rounded-r-sm">
            <img
              src="/lovable-uploads/56c17d61-50a4-49c7-a00f-e49e4806a4b3.png"
              alt="Big Bo Ramble"
              className="h-16 w-16 rounded-full border-2 border-route66-rust/40 object-cover shrink-0"
            />
            <div>
              <span className="font-playfair font-bold text-lg text-route66-brown">Big Bo Ramble</span>
              <p className="mt-1 font-lora text-[15px] leading-relaxed text-route66-brown/70 italic">
                Born with road dust in his boots and a Route 66 atlas on the dash. Big Bo's been chasing neon signs and small-town diners since before GPS ruined the adventure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogPostContent;
