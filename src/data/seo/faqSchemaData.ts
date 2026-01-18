// FAQ Schema Data - Questions derived from visible on-page content
// Follow Google's FAQPage guidelines: one FAQPage per page, visible content only, no advertising or user-submitted answers

export interface FAQItem {
  question: string;
  answer: string;
}

export const faqSchemaData: FAQItem[] = [
  {
    question: "Can I still drive Route 66 today?",
    answer: "Yes! Although officially decommissioned in 1985, most of the historic route is preserved and drivable, with many original alignments still open to traffic."
  },
  {
    question: "How long does it take to drive all of Route 66?",
    answer: "A full 2,448-mile trip usually takes 10–14 days for a leisurely pace (200–300 miles/day) with stops. Pure driving time is 32–38 hours, but plan 2–3 weeks for the complete experience — especially in 2026 with extra centennial events."
  },
  {
    question: "What is a realistic budget for a Route 66 road trip in 2026?",
    answer: "Expect $200–400 per person per day (for two sharing), totaling $3,000–$8,000+ for two weeks (excluding flights). Breakdown: gas ($500–800), lodging ($100–200/night), food ($50–100/day), attractions ($20–50/day). In 2026, centennial demand may increase lodging prices 10–20% in popular areas — book early!"
  },
  {
    question: "What is the best time to drive Route 66 in 2026?",
    answer: "2026 is Route 66's centennial year. Spring (April–May) and fall (September–October) offer mild weather (60–80°F), fewer crowds, and blooming landscapes. Summer can be very hot (100°F+ in deserts) and busier due to centennial events. Shoulder seasons are ideal for enjoying festivals without peak heat."
  },
  {
    question: "When was Route 66 established?",
    answer: "Route 66 was officially established on November 11, 1926 — making 2026 its 100th anniversary!"
  },
  {
    question: "How many states does Route 66 pass through?",
    answer: "Route 66 crosses 8 states: Illinois, Missouri, Kansas, Oklahoma, Texas, New Mexico, Arizona, and California."
  },
  {
    question: "What is Cadillac Ranch on Route 66?",
    answer: "Cadillac Ranch in Amarillo, Texas, is a famous art installation featuring ten Cadillacs buried nose-first in the ground — visitors are encouraged to spray paint them!"
  },
  {
    question: "Where does Route 66 officially end?",
    answer: "Route 66 officially ends at Santa Monica Pier in California, marked by the iconic \"End of the Trail\" sign."
  },
  {
    question: "Why is Route 66 called the Mother Road?",
    answer: "John Steinbeck coined the term \"Mother Road\" in his 1939 novel \"The Grapes of Wrath,\" capturing its role as a lifeline for migrants and dreamers."
  },
  {
    question: "What is the Blue Whale of Catoosa?",
    answer: "The Blue Whale of Catoosa is a giant blue whale swimming hole attraction built in the 1970s in Oklahoma — a beloved quirky stop right in our home state!"
  }
];

export const generateFAQSchema = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqSchemaData.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
});
