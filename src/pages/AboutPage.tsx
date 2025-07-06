import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Heart, Map, Users } from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Us - Ramble Route 66</title>
        <meta name="description" content="Learn about Ramble Route 66 - your guide to America's Mother Road. Discover our mission to preserve and share Route 66's rich history." />
        <link rel="canonical" href="https://www.ramble66.com/about" />
      </Helmet>
      
      <NavigationBar />
      
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-route66-red text-white py-16">
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
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  We're dedicated to helping travelers discover the authentic spirit of Route 66, 
                  from its iconic landmarks to its hidden gems and local stories.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="text-center">
                  <div className="w-16 h-16 bg-route66-red rounded-full flex items-center justify-center mx-auto mb-4">
                    <Map className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Comprehensive Guides</h3>
                  <p className="text-gray-600">
                    Detailed information about every mile of Route 66, from Chicago to Santa Monica.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-route66-red rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Authentic Stories</h3>
                  <p className="text-gray-600">
                    Real stories from the road, local legends, and the people who keep Route 66 alive.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-route66-red rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Community</h3>
                  <p className="text-gray-600">
                    Connecting Route 66 enthusiasts from around the world to share experiences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">The Story Behind Route 66</h2>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      Route 66, known as "America's Main Street" and "The Mother Road," 
                      was one of the original highways in the U.S. Highway System, established in 1926. 
                      Running from Chicago to Santa Monica, it became a symbol of freedom and adventure.
                    </p>
                    <p>
                      Though officially decommissioned in 1985, Route 66 lives on in the hearts 
                      of millions of travelers who continue to seek out its historic path, 
                      vintage diners, classic motels, and quirky roadside attractions.
                    </p>
                    <p>
                      Our team is passionate about preserving this legacy while making it accessible 
                      to modern travelers who want to experience the authentic spirit of the American road trip.
                    </p>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Route 66 by the Numbers</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Distance:</span>
                      <span className="font-semibold">2,448 miles</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">States Crossed:</span>
                      <span className="font-semibold">8 states</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Years Active:</span>
                      <span className="font-semibold">1926-1985</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Historic Landmarks:</span>
                      <span className="font-semibold">200+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
              <p className="text-lg text-gray-600 mb-8">
                Have questions, suggestions, or want to share your Route 66 story? 
                We'd love to hear from you!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="mailto:info@ramble66.com"
                  className="inline-flex items-center gap-2 bg-route66-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-route66-red/90 transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  info@ramble66.com
                </a>
                
                <span className="text-gray-400">or</span>
                
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 border-2 border-route66-red text-route66-red px-6 py-3 rounded-lg font-semibold hover:bg-route66-red hover:text-white transition-colors"
                >
                  Visit Contact Page
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default AboutPage;