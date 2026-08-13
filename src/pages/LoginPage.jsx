import usePageTitle from '../hooks/usePageTitle.js';
import LoginComponentRight from '../components/auth/LoginComponentRight';
import LoginComponentLeft from '../components/auth/LoginComponentLeft';

function LoginPage() {
  usePageTitle('Connexion');

  return (
    <main className="bg-[url('/background.png')] bg-cover bg-center place content-center min-h-dvh p-6 md:p-12">
      <h1 className="sr-only">Connexion</h1>
      <div className="flex flex-col md:flex-row justify-around mt-10 md:mt-0 items-center gap-50 md:gap-10">
        <LoginComponentLeft />
        <LoginComponentRight />
      </div>
    </main>
  );
}

export default LoginPage;
