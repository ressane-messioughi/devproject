import usePageTitle from '../hooks/usePageTitle.js';
import { Link } from 'react-router-dom';
import logo from '../assets/image/logo.webp';

function ErrorPage() {
  usePageTitle('Page Introuvable');

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-4 text-center">
      <img src={logo} alt="Logo DevProject" className="w-40 mx-auto" />

      <p className="text-6xl sm:text-8xl font-bold text-(--color-text-secondary)">404</p>

      <h1 className="text-xl sm:text-2xl font-bold">Cette page n&apos;existe pas</h1>

      <p className="text-(--color-text-muted) max-w-md">
        adresse saisie incorrecte ou la page a été déplacée.
      </p>

      <Link
        to="/"
        className="border border-white/18 outline-none cursor-pointer px-6 py-3.5 rounded-[10px] bg-(--color-background-secondary) text-white font-bold text-(--text-sm) transition shadow-[0_6px_18px_rgba(0,0,0,0.35)] hover:bg-blue-600 hover:-translate-y-0.5 active:translate-y-0"
      >
        Retour au Panel
      </Link>
    </main>
  );
}

export default ErrorPage;
