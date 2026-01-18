// HowTo Schema Data - Steps reference visible UI elements in Trip Planner section
// One comprehensive HowTo for the interactive trip planning tool

export interface HowToStep {
  name: string;
  text: string;
}

export const howToSchemaData: HowToStep[] = [
  {
    name: "Select your departure date",
    text: "Use the date picker in the Trip Planner section to choose when your Route 66 adventure begins. Consider spring or fall for ideal weather conditions."
  },
  {
    name: "Choose your starting city",
    text: "Select your departure point from the 'From' dropdown menu. Options include Chicago, St. Louis, Tulsa, Oklahoma City, and other Route 66 cities along the historic route."
  },
  {
    name: "Pick your destination",
    text: "Choose your end point from the 'To' dropdown menu, from Oklahoma City all the way to Santa Monica where Route 66 meets the Pacific Ocean."
  },
  {
    name: "Set your trip duration",
    text: "Adjust the number of days using the slider to match your available travel time. The planner will optimize your daily driving distances accordingly."
  },
  {
    name: "Review your daily itinerary",
    text: "View the generated day-by-day breakdown showing driving distances, estimated travel times, and recommended overnight stops along your route."
  },
  {
    name: "Check weather forecasts",
    text: "Review weather predictions for each day and location along your route to pack appropriately and plan for conditions."
  },
  {
    name: "Explore recommended attractions",
    text: "Browse suggested stops including hidden gems, classic diners, retro motels, and iconic roadside attractions near each segment of your journey."
  },
  {
    name: "Share your itinerary",
    text: "Use the share buttons to email your trip details, add events to your calendar, or generate a shareable link for travel companions to view your complete Route 66 itinerary."
  }
];

export const generateHowToSchema = () => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Plan Your Route 66 Trip with Ramble 66",
  "description": "Plan your ultimate Route 66 road trip using our free interactive planner. Create a custom itinerary with time estimates, weather forecasts, and shareable links for the historic 2,448-mile journey from Chicago to Santa Monica.",
  "totalTime": "PT10M",
  "tool": {
    "@type": "HowToTool",
    "name": "Ramble 66 Trip Planner"
  },
  "step": howToSchemaData.map((step, index) => ({
    "@type": "HowToStep",
    "position": index + 1,
    "name": step.name,
    "text": step.text
  }))
});
