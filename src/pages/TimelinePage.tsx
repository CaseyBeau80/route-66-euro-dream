
import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TimelinePage = () => {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "pt-BR">("en");

  return (
    <MainLayout language={language} setLanguage={setLanguage}>
      <div className="pt-20 min-h-screen bg-route66-background-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-route66 text-route66-primary mb-4 font-bold">
              Route 66 Historic Timeline
            </h1>
            <p className="text-xl text-route66-text-secondary max-w-3xl mx-auto">
              100 years of America's most famous highway
            </p>
          </div>
          
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-route66-primary">Timeline Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-route66-text-muted">
                A comprehensive timeline of Route 66's history from 1926 to 2026 will be available here soon.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default TimelinePage;
