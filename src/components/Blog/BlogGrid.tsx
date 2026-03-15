import React from 'react';
import BlogCard from './BlogCard';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featured_image_url?: string;
  published_at: string;
  author_name: string;
  tags?: string[];
}

interface BlogGridProps {
  posts: BlogPost[];
  isLoading?: boolean;
}

const BlogGridSkeleton = () => (
  <div className="space-y-8">
    {/* Featured skeleton */}
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-[16/9] bg-route66-sand/20" />
      <div className="p-6 space-y-3">
        <div className="h-4 w-32 bg-route66-sand/20 rounded" />
        <div className="h-6 w-2/3 bg-route66-sand/20 rounded" />
      </div>
    </div>
    {/* Grid skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
          <div className="aspect-[3/2] bg-route66-sand/20" />
          <div className="p-5 space-y-3">
            <div className="h-3 w-24 bg-route66-sand/20 rounded" />
            <div className="flex gap-2">
              <div className="h-5 w-14 bg-route66-sand/20 rounded" />
              <div className="h-5 w-14 bg-route66-sand/20 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const BlogGrid: React.FC<BlogGridProps> = ({ posts, isLoading }) => {
  if (isLoading) return <BlogGridSkeleton />;

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-route66-brown/60 text-lg">No blog posts found.</p>
      </div>
    );
  }

  const [featuredPost, ...restPosts] = posts;

  return (
    <div className="space-y-8">
      {/* Featured post - full width */}
      <BlogCard
        key={featuredPost.id}
        slug={featuredPost.slug}
        title={featuredPost.title}
        excerpt={featuredPost.excerpt}
        featuredImageUrl={featuredPost.featured_image_url}
        publishedAt={featuredPost.published_at}
        authorName={featuredPost.author_name}
        tags={featuredPost.tags}
        featured
      />

      {/* Remaining posts - 3 column grid */}
      {restPosts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restPosts.map((post) => (
            <BlogCard
              key={post.id}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              featuredImageUrl={post.featured_image_url}
              publishedAt={post.published_at}
              authorName={post.author_name}
              tags={post.tags}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogGrid;
