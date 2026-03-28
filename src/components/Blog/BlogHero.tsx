import React from 'react';
import blogShield from '@/assets/blog-route66-shield.png';

interface BlogHeroProps {
  title?: string;
  subtitle?: string;
}

const BlogHero: React.FC<BlogHeroProps> = ({ 
  title = "The Ramble 66 Blog",
  subtitle = "Stories, tips, and adventures from the Mother Road"
}) => {
  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-route66-asphalt py-16 md:py-20">
      <div className="relative z-10 text-center px-4 flex flex-col items-center">
        <img 
          src={blogShield} 
          alt="Route 66 shield"
          className="w-40 md:w-52 lg:w-60 mb-6"
          width={512}
          height={512}
        />
        <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tight">
          {title}
        </h1>
        <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto font-light tracking-wide">
          {subtitle}
        </p>
      </div>
    </section>
  );
};

export default BlogHero;
