
import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import CentennialSection from '../components/CentennialSection';

const CountdownPage = () => {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "pt-BR">("en");

  return (
    <MainLayout language={language} setLanguage={setLanguage}>
      <div className="pt-20">
        <CentennialSection />
      </div>
    </MainLayout>
  );
};

export default CountdownPage;
