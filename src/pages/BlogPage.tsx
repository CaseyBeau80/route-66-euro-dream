import React from 'react';
import { Helmet } from 'react-helmet-async';
import MainLayout from '@/components/MainLayout';
import BlogHero from '@/components/Blog/BlogHero';
import BlogGrid from '@/components/Blog/BlogGrid';
import BlogSidebar from '@/components/Blog/BlogSidebar';
import BlogFooterBanner from '@/components/Blog/BlogFooterBanner';
import { useBlogPosts } from '@/components/Blog/hooks/useBlogPosts';

const BlogPage: React.FC = () => {
  const { posts, isLoading, error } = useBlogPosts();

  return (
    <MainLayout>
      <Helmet>
        <title>Route 66 Blog & News | Ramble 66</title>
        <meta 
          name="description" 
          content="Route 66 Blog & News: Centennial updates, local stories, and what's happening along the Mother Road. Get inspired for your Route 66 adventure." 
        />
        <meta name="keywords" content="Route 66 blog, Route 66 news, Mother Road stories, road trip tips, Route 66 travel guide, centennial updates" />
        <link rel="canonical" href="https://ramble66.com/blog" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Route 66 Blog & News | Ramble 66" />
        <meta property="og:description" content="Route 66 Blog & News: Centennial updates, local stories, and what's happening along the Mother Road." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ramble66.com/blog" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Route 66 Blog & News | Ramble 66" />
        <meta name="twitter:description" content="Route 66 Blog & News: Centennial updates, local stories, and what's happening along the Mother Road." />
      </Helmet>

      <BlogHero />

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {error ? (
                <div className="text-center py-12">
                  <p className="text-route66-primary">{error}</p>
                </div>
              ) : (
                <BlogGrid posts={posts} isLoading={isLoading} />
              )}
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <BlogSidebar relatedPosts={posts.slice(0, 3)} />
            </div>
          </div>
        </div>
      </section>
      
      <BlogFooterBanner />
    </MainLayout>
  );
};

export default BlogPage;
