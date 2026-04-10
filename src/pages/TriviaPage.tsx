import MainLayout from "../components/MainLayout";
import SocialMetaTags from "../components/shared/SocialMetaTags";
import FunSection from "../components/FunSection/FunSection";

const TriviaPage = () => {
  return (
    <MainLayout>
      <SocialMetaTags
        path="/trivia"
        title="Route 66 Trivia Game — Test Your Mother Road Knowledge"
        description="Think you know Route 66? Test your knowledge of America's most famous highway with our interactive trivia game. Fun facts about the Mother Road from Chicago to Santa Monica."
      />
      <FunSection />
    </MainLayout>
  );
};

export default TriviaPage;
