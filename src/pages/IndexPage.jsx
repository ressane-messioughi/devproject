import usePageTitle from '../hooks/usePageTitle.js';
import { useContext } from 'react';
import HeroComponents from '../components/landing/HeroComponents';
import MainComponents from '../components/landing/MainComponents';
import { AuthContext } from '../context/AuthContext.js';
import { Navigate } from 'react-router-dom';
function IndexPage() {
  usePageTitle('Accueil');

  const { isLoggedIn } = useContext(AuthContext);
  if (isLoggedIn) {
    return <Navigate to="/panel" replace />;
  }
  return (
    <main className="h-full flex flex-col gap-10 bg-[#E1DAD9]">
      <HeroComponents />
      <MainComponents />
    </main>
  );
}

export default IndexPage;
