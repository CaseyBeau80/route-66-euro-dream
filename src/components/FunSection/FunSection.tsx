import React from 'react';
import Route66TriviaGame from '../Route66TriviaGame';

interface FunSectionProps {
  language: string;
}

const FunSection: React.FC<FunSectionProps> = ({
  language
}) => {
  return (
    <section className="py-20 bg-gradient-to-br from-route66-background to-route66-background-alt">
      <div className="container mx-auto px-4">
        <Route66TriviaGame />
      </div>
    </section>
  );
};

export default FunSection;