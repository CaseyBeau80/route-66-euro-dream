import React from 'react';
import blogLogo from '@/assets/blog-logo.png';

interface BlogHeroProps {
  title?: string;
  subtitle?: string;
}

const BlogHero: React.FC<BlogHeroProps> = () => {
  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-route66-cream py-12 md:py-16">
      <div className="relative z-10 text-center px-4">
        <img 
          src={blogLogo} 
          alt="The Ramble 66 Blog - Route 66"
          className="max-w-lg md:max-w-2xl lg:max-w-3xl w-full mx-auto"
          width={1366}
          height={910}
        />
      </div>
    </section>
  );
};

export default BlogHero;
