import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Heart, Map, Users } from 'lucide-react';
import MainLayout from '@/components/MainLayout';

const AboutPage = () => {
  return (
    <MainLayout>
      <Helmet>
        <title>About Us - Ramble Route 66</title>
        <meta name="description" content="Learn about Ramble Route 66 - your guide to America's Main Street. Discover our mission to preserve and share Route 66's rich history." />
        <link rel="canonical" href="https://www.ramble66.com/about" />
      </Helmet>
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-route66-primary text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">About Ramble Route 66</h1>
              <p className="text-xl text-white/90">
                Preserving and sharing the magic of America's Main Street
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  We're dedicated to helping travelers discover the authentic spirit of Route 66, 
                  from its iconic landmarks to its hidden gems and local stories.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-route66-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Map className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Comprehensive Guides</h3>
                  <p className="text-muted-foreground">
                    Detailed information about every mile of Route 66, from Chicago to Santa Monica.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-route66-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Authentic Stories</h3>
                  <p className="text-muted-foreground">
                    Real stories from the road, local legends, and the people who keep Route 66 alive.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-route66-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Community</h3>
                  <p className="text-muted-foreground">
                    Connecting Route 66 enthusiasts from around the world to share experiences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-10 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground mb-6">The Story Behind Ramble 66</h2>
                <div className="max-w-3xl mx-auto space-y-4 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    Ramble 66 was born out of a cherished memory — a road trip that stretched from the quiet hills of Southwest Missouri all the way to Northern California. Although not a kid but a young adult, I was packed into the backseat with my grandparents, headed west on Route 66 for my cousin's wedding. We didn't rush. We rambled.
                  </p>
                  <p>
                    That trip left a mark on me: the laughter at old diners, the songs on the radio, the feeling of the open road. Traveling with my grandparents was like time traveling itself — they had been there from the beginning of Route 66, growing up during the Great Depression and serving in World War II. Through their eyes, I saw the road not just as pavement and roadside attractions, but as a living piece of American history.
                  </p>
                  <p>
                    At one unforgettable stop at the Grand Canyon, I wandered off and got separated from them. My grandpa, calm and wise as ever, taught me a simple rule when he found me: when you're lost, stay put. I never forgot it — or the squirrel that kept me company until I was found.
                  </p>
                  <p>
                    We crossed the big farms of Southern California, sampling every fruit and nut we could get our hands on. It was more than a road trip. It was connection. It was heritage. It was the kind of journey you don't just remember — you carry with you.
                  </p>
                  <p>
                    Ramble 66 was built to help others create those same kinds of memories. It's a guide, a tribute, and an invitation: to slow down, explore the road, and rediscover the magic of the American journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-route66-text-primary mb-4">Get in Touch</h2>
              <p className="text-lg text-route66-text-secondary mb-6">
                Have questions, suggestions, or want to share your Route 66 story? 
                We'd love to hear from you!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="mailto:info@ramble66.com"
                  className="inline-flex items-center gap-2 bg-route66-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-route66-primary-dark transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  info@ramble66.com
                </a>
                
                <span className="text-route66-text-muted">or</span>
                
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 border-2 border-route66-primary text-route66-primary px-6 py-3 rounded-lg font-semibold hover:bg-route66-primary hover:text-white transition-colors"
                >
                  Visit Contact Page
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  );
};

export default AboutPage;