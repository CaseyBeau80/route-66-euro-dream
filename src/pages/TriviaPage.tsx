
import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import Route66TriviaGame from '../components/Route66TriviaGame';

const TriviaPage = () => {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "pt-BR">("en");

  return (
    <MainLayout language={language} setLanguage={setLanguage}>
      <div className="pt-20">
        <Route66TriviaGame />
      </div>
    </MainLayout>
  );
};

export default TriviaPage;
