import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Globe, MapPin, Phone } from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us - Ramble Route 66</title>
        <meta name="description" content="Get in touch with Ramble Route 66. Contact us for questions, suggestions, or partnership opportunities." />
        <link rel="canonical" href="https://www.ramble66.com/contact" />
      </Helmet>
      
      <NavigationBar />
      
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-route66-red text-white py-16">
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
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-route66-red rounded-lg flex items-center justify-center flex-shrink-0">
                        <Globe className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Website</h3>
                        <a 
                          href="https://www.ramble66.com" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-route66-red hover:underline"
                        >
                          www.ramble66.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-route66-red rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                        <a 
                          href="mailto:info@ramble66.com" 
                          className="text-route66-red hover:underline"
                        >
                          info@ramble66.com
                        </a>
                        <p className="text-gray-600 text-sm mt-1">
                          General inquiries, partnerships, and support
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-route66-red rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Route Coverage</h3>
                        <p className="text-gray-600">
                          Chicago, Illinois to Santa Monica, California<br />
                          2,448 miles of America's Main Street
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a Message</h2>
                  
                  <form className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-route66-red focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-route66-red focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-route66-red focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-route66-red focus:border-transparent"
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-route66-red text-white py-3 px-6 rounded-lg font-semibold hover:bg-route66-red/90 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = 'mailto:info@ramble66.com?subject=Contact Form Inquiry';
                      }}
                    >
                      Send Message
                    </button>
                    
                    <p className="text-sm text-gray-600 text-center">
                      This will open your email client to send us a message directly.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default ContactPage;