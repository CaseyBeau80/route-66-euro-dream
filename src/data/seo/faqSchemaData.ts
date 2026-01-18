// FAQ Schema Data - Questions derived from visible on-page content
// Follow Google's FAQPage guidelines: one FAQPage per page, visible content only, no advertising or user-submitted answers

export interface FAQItem {
  question: string;
  answer: string;
}

export const faqSchemaData: FAQItem[] = [
  {
    question: "What is the best time to drive Route 66 in 2026?",
    answer: "2026 marks Route 66's centennial celebration. Spring (April-May) and fall (September-October) offer ideal weather for the 2,448-mile journey from Chicago to Santa Monica, with moderate temperatures and fewer crowds."
  },
  {
    question: "When was Route 66 established?",
    answer: "Route 66 was officially established on November 11, 1926, making 2026 its 100th anniversary celebration year."
  },
  {
    question: "How many states does Route 66 pass through?",
    answer: "Route 66 crosses 8 states: Illinois, Missouri, Kansas, Oklahoma, Texas, New Mexico, Arizona, and California, spanning 2,448 miles from Chicago to Santa Monica."
  },
  {
    question: "What is Cadillac Ranch on Route 66?",
    answer: "Cadillac Ranch in Amarillo, Texas, is a famous art installation featuring ten Cadillacs buried nose-first in a field. Visitors have been encouraged to add graffiti to the cars since 1974."
  },
  {
    question: "Where does Route 66 officially end?",
    answer: "Route 66 officially ends at Santa Monica Pier in California, marked by the iconic 'End of the Trail' sign overlooking the Pacific Ocean."
  },
  {
    question: "Why is Route 66 called the Mother Road?",
    answer: "John Steinbeck coined the term 'Mother Road' in his 1939 novel 'The Grapes of Wrath,' describing the highway that carried Dust Bowl migrants westward to California in search of a better life."
  },
  {
    question: "What is the Blue Whale of Catoosa?",
    answer: "The Blue Whale of Catoosa is a giant blue whale structure built by Hugh Davis in the 1970s as a family swimming hole in Oklahoma. It's now one of Route 66's most beloved roadside attractions."
  },
  {
    question: "Can I still drive Route 66 today?",
    answer: "Yes, while Route 66 was officially decommissioned in 1985, most of the historic route is preserved and drivable as Historic Route 66, with brown signs marking the way through all 8 states."
  },
  {
    question: "How long does it take to drive all of Route 66?",
    answer: "A complete Route 66 road trip typically takes 10-14 days to fully experience the attractions, covering approximately 2,448 miles at a leisurely pace with time for stops and exploration."
  },
  {
    question: "What should I budget for a Route 66 trip?",
    answer: "A typical Route 66 road trip budget ranges from $150-300 per day including fuel, accommodations, meals, and attractions, depending on your travel style. Budget travelers can manage with less, while luxury travelers may spend more."
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
