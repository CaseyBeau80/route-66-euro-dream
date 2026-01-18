import React from 'react';
import { Mail, Globe, MapPin, Phone } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import SocialMetaTags from '@/components/shared/SocialMetaTags';

const ContactPage = () => {
  return (
    <MainLayout>
      <SocialMetaTags 
        path="/contact"
        title="Contact Ramble 66 – Route 66 Trip Planner" 
        description="Get in touch with Ramble 66—your Route 66 trip planner for routes, attractions, lodging, and trip tools along America's Mother Road."
      />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-route66-primary text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
              <p className="text-xl text-white/90">
                Have questions about Route 66? We'd love to hear from you!
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                
                {/* Get in Touch */}
                <div>
                  <h2 className="text-3xl font-bold text-route66-text-primary mb-8">Get in Touch</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-route66-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <Globe className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-route66-text-primary mb-1">Website</h3>
                        <a 
                          href="https://ramble66.com" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-route66-primary hover:underline"
                        >
                          ramble66.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-route66-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-route66-text-primary mb-1">Email</h3>
                        <a 
                          href="mailto:info@ramble66.com" 
                          className="text-route66-primary hover:underline"
                        >
                          info@ramble66.com
                        </a>
                        <p className="text-route66-text-secondary text-sm mt-1">
                          General inquiries, partnerships, and support
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-route66-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-route66-text-primary mb-1">Route Coverage</h3>
                        <p className="text-route66-text-secondary">
                          Chicago, Illinois to Santa Monica, California<br />
                          2,448 miles of America's Main Street
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div>
                  <h2 className="text-3xl font-bold text-route66-text-primary mb-8">Send us a Message</h2>
                  
                  <form className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-route66-text-secondary mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-4 py-3 border border-route66-border rounded-lg focus:ring-2 focus:ring-route66-primary focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-route66-text-secondary mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-3 border border-route66-border rounded-lg focus:ring-2 focus:ring-route66-primary focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-route66-text-secondary mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        className="w-full px-4 py-3 border border-route66-border rounded-lg focus:ring-2 focus:ring-route66-primary focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-route66-text-secondary mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        className="w-full px-4 py-3 border border-route66-border rounded-lg focus:ring-2 focus:ring-route66-primary focus:border-transparent"
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-route66-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-route66-primary-dark transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = 'mailto:info@ramble66.com?subject=Contact Form Inquiry';
                      }}
                    >
                      Send Message
                    </button>
                    
                    <p className="text-sm text-route66-text-muted text-center">
                      This will open your email client to send us a message directly.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  );
};

export default ContactPage;
