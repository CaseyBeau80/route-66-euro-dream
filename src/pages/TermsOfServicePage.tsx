import React from 'react';
import MainLayout from '@/components/MainLayout';
import SocialMetaTags from '@/components/shared/SocialMetaTags';

const TermsOfServicePage: React.FC = () => {
  return (
    <MainLayout>
      <SocialMetaTags
        title="Terms of Service | Ramble 66 - Route 66 Trip Planner"
        description="Terms of Service for Ramble 66. Read about the rules and guidelines for using our Route 66 trip planning website and services."
        path="/terms"
      />
      
      {/* Hero Section */}
      <section className="bg-route66-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-white/80">Last updated: April 11, 2026</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none space-y-8">

            {/* Introduction */}
            <div>
              <p className="text-muted-foreground text-lg">
                Welcome to Ramble 66 ("we," "our," or "us"). By accessing or using our website at ramble66.com and any related services (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.
              </p>
            </div>

            {/* Eligibility */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Eligibility</h2>
              <p className="text-muted-foreground">
                You must be at least 13 years old to use the Service. By using the Service, you represent and warrant that you meet this age requirement. If you are under 18, you may only use the Service with the involvement of a parent or guardian who agrees to these Terms.
              </p>
            </div>

            {/* Description of Service */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground">
                Ramble 66 is a free, community-oriented Route 66 travel companion. The Service provides trip planning tools, attraction information, event listings, community photo sharing, a trivia game, and related content about the historic Route 66 corridor across eight U.S. states. We reserve the right to modify, suspend, or discontinue any part of the Service at any time without notice.
              </p>
            </div>

            {/* User Accounts */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. User Accounts</h2>
              <p className="text-muted-foreground mb-4">
                Some features of the Service may require you to create an account. When you do, you agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain the security of your password and account credentials</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                We reserve the right to suspend or terminate accounts that violate these Terms.
              </p>
            </div>

            {/* User-Generated Content */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. User-Generated Content</h2>
              <p className="text-muted-foreground mb-4">
                The Service allows you to submit content, including photos, comments, and trip plans ("User Content"). By submitting User Content, you:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Grant us a non-exclusive, royalty-free, worldwide license to use, display, reproduce, and distribute your User Content in connection with the Service</li>
                <li>Represent that you own or have the necessary rights to submit the content</li>
                <li>Agree not to submit content that is illegal, obscene, defamatory, threatening, infringing, or otherwise objectionable</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                We reserve the right to remove any User Content that violates these Terms or our community guidelines, with or without notice. We use automated content moderation tools to help maintain a safe environment.
              </p>
            </div>

            {/* Prohibited Conduct */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Prohibited Conduct</h2>
              <p className="text-muted-foreground mb-4">You agree not to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Use the Service for any unlawful purpose or in violation of any applicable law</li>
                <li>Attempt to gain unauthorized access to any part of the Service, other accounts, or computer systems</li>
                <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
                <li>Use automated means (bots, scrapers, etc.) to access the Service without our written permission</li>
                <li>Impersonate any person or entity or misrepresent your affiliation with a person or entity</li>
                <li>Upload viruses, malware, or other harmful code</li>
                <li>Harass, abuse, or harm other users of the Service</li>
              </ul>
            </div>

            {/* Intellectual Property */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content on the Service that is not User Content — including text, graphics, logos, icons, images, audio, video, software, and the overall design and layout — is the property of Ramble 66 or its licensors and is protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our Service or included content without our written permission.
              </p>
            </div>

            {/* Third-Party Services and Links */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Third-Party Services and Links</h2>
              <p className="text-muted-foreground">
                The Service may contain links to third-party websites, services, or resources (including Google Maps, YouTube embeds, and external attraction websites). We are not responsible for the content, privacy policies, or practices of any third-party services. Your use of third-party services is at your own risk and subject to those services' terms and policies.
              </p>
            </div>

            {/* Disclaimers */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. Disclaimers</h2>
              <p className="text-muted-foreground mb-4">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>The Service will be uninterrupted, secure, or error-free</li>
                <li>The information provided (including attraction details, hours, fees, event dates, and directions) is accurate, complete, or current</li>
                <li>Any defects will be corrected</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Travel involves inherent risks. Always verify attraction hours, road conditions, and safety information independently before traveling. Ramble 66 is a planning tool, not a substitute for your own judgment on the road.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">9. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, RAMBLE 66 AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM YOUR USE OF THE SERVICE.
              </p>
            </div>

            {/* Indemnification */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">10. Indemnification</h2>
              <p className="text-muted-foreground">
                You agree to indemnify, defend, and hold harmless Ramble 66 and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable attorneys' fees) arising out of or in any way connected with your access to or use of the Service, your User Content, or your violation of these Terms.
              </p>
            </div>

            {/* Governing Law */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">11. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with the laws of the State of Oklahoma, United States, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms shall be brought exclusively in the courts located in Tulsa County, Oklahoma.
              </p>
            </div>

            {/* Changes to These Terms */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">12. Changes to These Terms</h2>
              <p className="text-muted-foreground">
                We may revise these Terms at any time by posting an updated version on this page. The "Last updated" date at the top of this page indicates when the Terms were last revised. Your continued use of the Service after any changes constitutes your acceptance of the new Terms.
              </p>
            </div>

            {/* Contact Us */}
            <div className="bg-muted/50 rounded-lg p-6 mt-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                Questions about these Terms? Email us at{' '}
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

export default TermsOfServicePage;
