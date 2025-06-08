
import React from 'react';
import MainLayout from '../components/MainLayout';
import FunFactsOfTheDay from '../components/FunFactsOfTheDay';

const FunFactsPage = () => {
  return (
    <MainLayout>
      <div className="pt-20">
        <FunFactsOfTheDay />
      </div>
    </MainLayout>
  );
};

export default FunFactsPage;
