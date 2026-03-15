import React from 'react';

interface BlogHeroProps {
  title?: string;
  subtitle?: string;
}

const BlogHero: React.FC<BlogHeroProps> = ({ 
  title = "Route 66 Blog",
  subtitle = "Stories, tips, and adventures from the Mother Road"
}) => {
  return (
    <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/images/blog-hero-highway.jpg" 
          alt="Route 66 highway stretching into the sunset"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55" />
      </div>
      
      <div className="relative z-10 text-center px-4">
        <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light tracking-wide">
          {subtitle}
        </p>
      </div>
    </section>
  );
};

export default BlogHero;
