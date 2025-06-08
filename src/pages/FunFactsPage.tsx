
import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import FunFactsOfTheDay from '../components/FunFactsOfTheDay';

const FunFactsPage = () => {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "pt-BR">("en");

  return (
    <MainLayout language={language} setLanguage={setLanguage}>
      <div className="pt-20">
        <FunFactsOfTheDay />
      </div>
    </MainLayout>
  );
};

export default FunFactsPage;
