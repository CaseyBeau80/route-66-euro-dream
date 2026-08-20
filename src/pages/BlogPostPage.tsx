import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import MainLayout from '@/components/MainLayout';
import BlogPostContent from '@/components/Blog/BlogPostContent';
import BlogSidebar from '@/components/Blog/BlogSidebar';
import BlogFooterBanner from '@/components/Blog/BlogFooterBanner';
import { useBlogPost } from '@/components/Blog/hooks/useBlogPost';
import { useScrollDepthEvent } from '@/hooks/useEngagementTracking';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { post, isLoading, error, notFound, relatedPosts, refetch } = useBlogPost(slug || '');
  const canonicalUrl = `https://ramble66.com/blog/${slug}`;

  // Engagement signal: only once the reader scrolls past half the post.
  useScrollDepthEvent('blog_read', !!post, 0.5, { slug });

  if (isLoading) {
    return (
      <MainLayout>
        <Helmet>
          <link rel="canonical" href={canonicalUrl} />
        </Helmet>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="aspect-video bg-route66-sand/30 rounded-xl" />
              <div className="h-8 bg-route66-sand/30 rounded w-3/4" />
              <div className="h-4 bg-route66-sand/30 rounded w-1/2" />
              <div className="space-y-3">
                <div className="h-4 bg-route66-sand/30 rounded" />
                <div className="h-4 bg-route66-sand/30 rounded" />
                <div className="h-4 bg-route66-sand/30 rounded w-5/6" />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Definitive: no such published post. Dead end — noindex, self-referencing canonical.
  if (notFound) {
    return (
      <MainLayout>
        <Helmet>
          <title>Post Not Found | Ramble66 - Route 66 Adventures</title>
          <meta name="robots" content="noindex" />
          <link rel="canonical" href={canonicalUrl} />
        </Helmet>
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="font-playfair text-3xl text-route66-text mb-4">Post Not Found</h1>
            <p className="font-libre text-route66-text mb-6">
              We couldn't find that story. It may have moved or never existed.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 bg-route66-primary hover:bg-route66-primary-hover text-white font-special-elite px-6 py-3 rounded-sm border-2 border-route66-border transition-colors"
            >
              Back to the Blog
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Transient failure: the post is real, we just couldn't load it. Never noindex, never redirect.
  if (error || !post) {
    return (
      <MainLayout>
        <Helmet>
          <title>Couldn't Load This Post | Ramble66 - Route 66 Adventures</title>
          <link rel="canonical" href={canonicalUrl} />
        </Helmet>
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="font-playfair text-3xl text-route66-text mb-4">Couldn't Load This Post</h1>
            <p className="font-libre text-route66-text mb-6">
              Something went sideways on the road. Give it another try in a moment.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={refetch}
                className="inline-flex items-center gap-2 bg-route66-primary hover:bg-route66-primary-hover text-white font-special-elite px-6 py-3 rounded-sm border-2 border-route66-border transition-colors"
              >
                Try Again
              </button>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 font-special-elite px-6 py-3 rounded-sm border-2 border-route66-border text-route66-text transition-colors"
              >
                Back to the Blog
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }


  // JSON-LD structured data with Big Bo Ramble as author
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featured_image_url,
    "datePublished": post.published_at,
    "dateModified": post.updated_at,
    "author": {
      "@type": "Person",
      "name": "Big Bo Ramble",
      "image": "https://ramble66.com/lovable-uploads/56c17d61-50a4-49c7-a00f-e49e4806a4b3.png"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Ramble 66",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ramble66.com/icons/ramble66-icon.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://ramble66.com/blog/${post.slug}`
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ramble66.com/" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://ramble66.com/blog" },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://ramble66.com/blog/${post.slug}` }
    ]
  };

  return (
    <MainLayout>
      <Helmet>
        <title>{post.title} | Ramble66 - Route 66 Adventures</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={post.tags?.join(', ')} />
        <link rel="canonical" href={`https://ramble66.com/blog/${post.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${post.title} | Ramble66 - Route 66 Adventures`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://ramble66.com/blog/${post.slug}`} />
        {post.featured_image_url && (
          <meta property="og:image" content={post.featured_image_url} />
        )}
        <meta property="article:published_time" content={post.published_at} />
        <meta property="article:author" content="Big Bo Ramble" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${post.title} | Ramble66 - Route 66 Adventures`} />
        <meta name="twitter:description" content={post.excerpt} />
        {post.featured_image_url && (
          <meta name="twitter:image" content={post.featured_image_url} />
        )}
        
        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbJsonLd)}
        </script>
      </Helmet>

      <section className="py-8 md:py-12 bg-route66-cream/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <BlogPostContent
                title={post.title}
                content={post.content}
                publishedAt={post.published_at}
                authorName={post.author_name}
                featuredImageUrl={post.featured_image_url || undefined}
                tags={post.tags}
              />
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <BlogSidebar relatedPosts={relatedPosts} />
            </div>
          </div>
        </div>
      </section>
      
      <BlogFooterBanner />
    </MainLayout>
  );
};

export default BlogPostPage;
