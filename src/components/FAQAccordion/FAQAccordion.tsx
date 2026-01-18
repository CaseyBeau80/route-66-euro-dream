import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqSchemaData } from "@/data/seo/faqSchemaData";

const FAQAccordion: React.FC = () => {
  return (
    <section 
      className="py-16 md:py-20 bg-gradient-to-b from-route66-background to-route66-background-alt"
      aria-labelledby="faq-heading"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Main Card Container */}
        <div className="bg-white rounded-2xl border-4 border-route66-primary shadow-[0_0_20px_rgba(59,130,246,0.2)] p-6 md:p-10">
          {/* Heading */}
          <h2 
            id="faq-heading"
            className="font-route66 text-2xl md:text-3xl lg:text-4xl text-center mb-8 md:mb-10 text-route66-text"
          >
            <span className="text-3xl md:text-4xl mr-2">🛣️</span>
            <span className="bg-gradient-to-r from-route66-primary via-route66-accent to-route66-red bg-clip-text text-transparent">
              FAQ
            </span>
            <span className="block text-lg md:text-xl mt-2 text-route66-text-secondary font-americana">
              about Route 66 (2026 Centennial Edition)
            </span>
          </h2>

          {/* FAQ Accordion */}
          <Accordion 
            type="single" 
            collapsible 
            className="space-y-2"
          >
            {faqSchemaData.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-2 border-route66-primary/20 rounded-lg px-4 hover:border-route66-accent/50 transition-colors duration-200 bg-route66-background/30"
              >
                <AccordionTrigger className="font-route66 text-left text-base md:text-lg text-route66-text hover:text-route66-accent hover:no-underline py-4 gap-4">
                  <span className="flex items-start gap-3">
                    <span className="text-route66-primary font-bold min-w-[28px]">
                      {(index + 1).toString().padStart(2, '0')}.
                    </span>
                    <span>{item.question}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-route66-text-secondary text-sm md:text-base leading-relaxed pb-4 pl-10">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Footer Link to Trivia */}
          <div className="mt-8 pt-6 border-t-2 border-route66-primary/10 text-center">
            <a 
              href="#fun" 
              className="inline-flex items-center gap-2 font-route66 text-route66-primary hover:text-route66-accent transition-colors duration-200 group"
            >
              <span className="text-xl group-hover:animate-bounce">🚗</span>
              <span>Want more Route 66 fun? Try our Trivia Game</span>
              <span className="text-lg group-hover:translate-x-1 transition-transform duration-200">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQAccordion;
