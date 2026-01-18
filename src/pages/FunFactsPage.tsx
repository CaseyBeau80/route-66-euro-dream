import MainLayout from '../components/MainLayout';
import FunFactsOfTheDay from '../components/FunFactsOfTheDay';
import SocialMetaTags from '../components/shared/SocialMetaTags';

const FunFactsPage = () => {
  return (
    <MainLayout>
      <SocialMetaTags 
        path="/fun-facts"
        title="Route 66 Fun Facts – Ramble 66"
        description="Discover fascinating fun facts about Route 66, America's Mother Road, from Chicago to Santa Monica."
      />
      <div className="pt-20">
        <FunFactsOfTheDay />
      </div>
    </MainLayout>
  );
};

export default FunFactsPage;
