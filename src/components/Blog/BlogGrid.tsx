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
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
        <div className="aspect-video bg-route66-sand/30" />
        <div className="p-6 space-y-3">
          <div className="flex justify-between">
            <div className="h-4 w-24 bg-route66-sand/30 rounded" />
            <div className="h-6 w-6 bg-route66-sand/30 rounded-full" />
          </div>
          <div className="h-6 w-3/4 bg-route66-sand/30 rounded" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-route66-sand/30 rounded" />
            <div className="h-4 w-2/3 bg-route66-sand/30 rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const BlogGrid: React.FC<BlogGridProps> = ({ posts, isLoading }) => {
  if (isLoading) {
    return <BlogGridSkeleton />;
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-route66-brown/60 text-lg">No blog posts found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
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
  );
};

export default BlogGrid;
