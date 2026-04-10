import MainLayout from "../components/MainLayout";
import SocialMetaTags from "../components/shared/SocialMetaTags";
import CentennialEventsCalendar from "../components/CentennialEventsCalendar";

const EventsPage = () => {
  return (
    <MainLayout>
      <SocialMetaTags
        path="/events"
        title="2026 Route 66 Centennial Events Calendar"
        description="Find every event celebrating Route 66's 100th anniversary in 2026. Festivals, car shows, parades, concerts, and caravans across all 8 states from Illinois to California."
      />
      <CentennialEventsCalendar />
    </MainLayout>
  );
};

export default EventsPage;
