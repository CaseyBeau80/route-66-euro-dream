import MainLayout from "../components/MainLayout";
import SocialMetaTags from "../components/shared/SocialMetaTags";
import FAQAccordion from "../components/FAQAccordion";

const FAQPage = () => {
  return (
    <MainLayout>
      <SocialMetaTags
        path="/faq"
        title="Route 66 FAQ — Common Questions Answered"
        description="Get answers to the most frequently asked questions about driving Route 66. Trip planning tips, best times to visit, must-see stops, costs, and road conditions."
        includeFaqSchema={true}
      />
      <section className="py-12 bg-route66-background">
        <div className="container mx-auto px-4">
          <h1 className="font-route66 text-3xl md:text-4xl text-route66-brown text-center mb-8">
            Route 66 FAQ
          </h1>
        </div>
        <FAQAccordion />
      </section>
    </MainLayout>
  );
};

export default FAQPage;
