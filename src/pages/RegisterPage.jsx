import usePageTitle from '../hooks/usePageTitle.js';
import RegisterForm from '../components/auth/RegisterForm.jsx';
function RegisterPage() {
  usePageTitle('Inscription');

  return (
    <>
      <main className="bg-[url('/background.png')] bg-cover bg-center min-h-dvh flex items-center justify-center p-6 md:p-12">
        <h1 className="sr-only">Inscription</h1>
        <RegisterForm />
      </main>
    </>
  );
}

export default RegisterPage;
