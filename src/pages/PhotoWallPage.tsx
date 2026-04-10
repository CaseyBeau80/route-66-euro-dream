import MainLayout from "../components/MainLayout";
import SocialMetaTags from "../components/shared/SocialMetaTags";
import SocialSection from "../components/SocialSection/SocialSection";

const PhotoWallPage = () => {
  return (
    <MainLayout>
      <SocialMetaTags
        path="/photo-wall"
        title="Route 66 Photo Wall — Share Your Road Trip Photos"
        description="Upload and browse community photos from Route 66. Share your road trip memories and see what other travelers have captured along the Mother Road."
      />
      <SocialSection />
    </MainLayout>
  );
};

export default PhotoWallPage;
