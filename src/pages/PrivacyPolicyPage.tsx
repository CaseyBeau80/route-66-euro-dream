import React from 'react';
import MainLayout from '@/components/MainLayout';
import SocialMetaTags from '@/components/shared/SocialMetaTags';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <MainLayout>
      <SocialMetaTags
        title="Privacy Policy | Ramble 66 - Route 66 Trip Planner"
        description="Privacy Policy for Ramble 66, the Route 66 trip planning app. Learn how we collect, use, and protect your information."
        path="/privacy"
      />
      
      {/* Hero Section */}
      <section className="bg-route66-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-white/80">Last updated: January 25, 2026</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none space-y-8">
            
            {/* Introduction */}
            <div>
              <p className="text-muted-foreground text-lg">
                Ramble 66 ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our Route 66 trip planning application and website.
              </p>
            </div>

            {/* Information We Collect */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Information We Collect</h2>
              <p className="text-muted-foreground mb-4">We may collect the following types of information:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Location Data:</strong> With your permission, we access your device's location to provide route planning and navigation features. You can disable location access in your device settings at any time.</li>
                <li><strong>Usage Analytics:</strong> We collect anonymous usage data to improve our app's performance and user experience. This includes pages visited, features used, and general interaction patterns.</li>
                <li><strong>Contact Form Submissions:</strong> When you contact us through our website, we collect the information you provide, such as your name and email address.</li>
                <li><strong>Email Address:</strong> If you sign up for our newsletter or download our Route 66 Starter Guide, we collect your email address to deliver the requested content and occasional updates.</li>
              </ul>
            </div>

            {/* Photo Uploads */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Photo Uploads</h2>
              <p className="text-muted-foreground">
                If you upload photos to our community features, please be aware that these photos may be publicly visible to other users. Do not upload photos containing sensitive personal information. We reserve the right to remove any content that violates our community guidelines.
              </p>
            </div>

            {/* Content Moderation */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Content Moderation</h2>
              <p className="text-muted-foreground">
                We use AI-based content moderation to review user-submitted content, including photos and text. This helps us maintain a safe and appropriate environment for all users. Content that violates our guidelines may be automatically flagged or removed.
              </p>
            </div>

            {/* Third-Party Services */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Third-Party Services</h2>
              <p className="text-muted-foreground mb-4">Our app uses the following third-party services:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Google Maps Platform:</strong> We use Google Maps for mapping and location services. Your use of Google Maps is subject to <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-route66-primary hover:underline">Google's Privacy Policy</a>.</li>
                <li><strong>Google Play Services:</strong> On Android devices, we use Google Play Services for app functionality. This is subject to <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-route66-primary hover:underline">Google's Privacy Policy</a>.</li>
              </ul>
            </div>

            {/* How We Use Your Information */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Provide and improve our trip planning services</li>
                <li>Display relevant Route 66 attractions and points of interest</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Send you requested content like the Route 66 Starter Guide</li>
                <li>Analyze usage patterns to improve app performance</li>
              </ul>
            </div>

            {/* Data Sharing and Security */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Data Sharing and Security</h2>
              <p className="text-muted-foreground mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share anonymized, aggregated data for analytics purposes.
              </p>
              <p className="text-muted-foreground">
                We implement reasonable security measures to protect your information. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </div>

            {/* Data Deletion Request */}
            <div className="bg-accent/30 rounded-lg p-6 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">Data Deletion Request</h2>
              <p className="text-muted-foreground mb-4">
                You have the right to request deletion of your personal data. Here's how:
              </p>
              
              <h3 className="text-lg font-semibold text-foreground mb-2">What Data Can Be Deleted</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-4">
                <li><strong>Photos you uploaded:</strong> Any photos you submitted to our Photo Wall or photo challenges</li>
                <li><strong>Email address:</strong> If you signed up for our newsletter or Route 66 Starter Guide</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-foreground mb-2">How to Request Deletion</h3>
              <ol className="list-decimal list-inside text-muted-foreground space-y-2 ml-4 mb-4">
                <li>Send an email to <a href="mailto:hello@ramble66.com?subject=Data%20Deletion%20Request" className="text-route66-primary hover:underline font-medium">hello@ramble66.com</a></li>
                <li>Use the subject line: <strong>"Data Deletion Request"</strong></li>
                <li>Include a description of the data you want deleted (e.g., "photos I uploaded" or "my email address")</li>
                <li>If requesting photo deletion, please provide details to help identify your photos (approximate upload date, location shown, etc.)</li>
              </ol>
              
              <h3 className="text-lg font-semibold text-foreground mb-2">Processing Time</h3>
              <p className="text-muted-foreground">
                We will process your deletion request within <strong>30 days</strong> of receiving it. You will receive a confirmation email once your data has been deleted.
              </p>
            </div>

            {/* Children's Privacy */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our app is not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately so we can delete it.
              </p>
            </div>

            {/* Changes to This Policy */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically.
              </p>
            </div>

            {/* Contact Us */}
            <div className="bg-muted/50 rounded-lg p-6 mt-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                Questions about this privacy policy? Email us at{' '}
                <a href="mailto:hello@ramble66.com" className="text-route66-primary hover:underline">
                  hello@ramble66.com
                </a>
              </p>
              <p className="text-muted-foreground text-sm">
                Based in Tulsa, Oklahoma, USA
              </p>
            </div>

          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default PrivacyPolicyPage;
