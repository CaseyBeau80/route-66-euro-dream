import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import MainLayout from '@/components/MainLayout';
import BlogPostContent from '@/components/Blog/BlogPostContent';
import BlogSidebar from '@/components/Blog/BlogSidebar';
import { useBlogPost } from '@/components/Blog/hooks/useBlogPost';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { post, isLoading, error, relatedPosts } = useBlogPost(slug || '');

  if (isLoading) {
    return (
      <MainLayout>
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

  if (error || !post) {
    return <Navigate to="/blog" replace />;
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
      "image": "https://ramble66.lovable.app/lovable-uploads/56c17d61-50a4-49c7-a00f-e49e4806a4b3.png"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Ramble 66",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ramble66.lovable.app/icons/ramble66-icon.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://ramble66.lovable.app/blog/${post.slug}`
    }
  };

  return (
    <MainLayout>
      <Helmet>
        <title>{post.title} | Ramble66 - Route 66 Adventures</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={post.tags?.join(', ')} />
        <link rel="canonical" href={`https://ramble66.lovable.app/blog/${post.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://ramble66.lovable.app/blog/${post.slug}`} />
        {post.featured_image_url && (
          <meta property="og:image" content={post.featured_image_url} />
        )}
        <meta property="article:published_time" content={post.published_at} />
        <meta property="article:author" content="Big Bo Ramble" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        {post.featured_image_url && (
          <meta name="twitter:image" content={post.featured_image_url} />
        )}
        
        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
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
    </MainLayout>
  );
};

export default BlogPostPage;
