
import MainLayout from '../components/MainLayout';
import Route66TriviaGame from '../components/Route66TriviaGame';

const TriviaPage = () => {
  return (
    <MainLayout>
      <div className="pt-20">
        <Route66TriviaGame />
      </div>
    </MainLayout>
  );
};

export default TriviaPage;
