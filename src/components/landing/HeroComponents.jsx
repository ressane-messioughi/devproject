import logo from '../../assets/image/logo.webp';
import Button from '../ui/Button.jsx';
import { User } from 'lucide-react';
import { UserRoundPlus } from 'lucide-react';
import linkedin from '/icon/linkedin.webp';
import instagram from '/icon/instagram.webp';
import facebook from '/icon/facebook.webp';
import x from '/icon/twitter.webp';
import { Link } from 'react-router-dom';
function HeroComponents() {
  return (
    <>
      <section className="bg-[url('/background.webp')] bg-cover min-h-dvh flex flex-col items-center justify-around gap-5">
        <div className="flex gap-4 ">
          <Link to="/register">
            <Button className="flex gap-2">
              <UserRoundPlus />
              Inscription
            </Button>
          </Link>
          <Link to="/login">
            <Button className="flex gap-2">
              <User />
              Connexion
            </Button>
          </Link>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={logo}
            className="w-48 sm:w-72 md:w-100 animate-pulse transform transition-300"
            alt="Logo"
          />
        </div>
        <div className="flex flex-wrap justify-center w-full gap-3 sm:gap-4">
          <a
            href="#"
            className="border border-white/18 outline-none cursor-pointer font-bold text-(--text-sm) shadow-[0_6px_18px_rgba(0,0,0,0.35)] no-underline px-4 py-2 rounded-3xl bg-(--color-background-secondary) transition duration-200 w-[10em] text-center hover:bg-(--color-primary) hover:text-(--color-background) hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
          >
            <img src={facebook} className="w-8" alt="" />
            Facebook
          </a>
          <a
            href="#"
            className="border border-white/18 outline-none cursor-pointer font-bold text-(--text-sm) shadow-[0_6px_18px_rgba(0,0,0,0.35)] no-underline px-4 py-2 rounded-3xl bg-(--color-background-secondary) transition duration-200 w-[10em] text-center hover:bg-(--color-primary) hover:text-(--color-background) hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
          >
            <img src={x} className="w-8" alt="" />
            Twitter
          </a>
          <a
            href="#"
            className="border border-white/18 outline-none cursor-pointer font-bold text-(--text-sm) shadow-[0_6px_18px_rgba(0,0,0,0.35)] no-underline px-4 py-2 rounded-3xl bg-(--color-background-secondary) transition duration-200 w-[10em] text-center hover:bg-(--color-primary) hover:text-(--color-background) hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
          >
            <img src={instagram} className="w-8" alt="" />
            Instagram
          </a>
          <a
            href="#"
            className="border border-white/18 outline-none cursor-pointer font-bold text-(--text-sm) shadow-[0_6px_18px_rgba(0,0,0,0.35)] no-underline px-4 py-2 rounded-3xl bg-(--color-background-secondary) transition duration-200 w-[10em] text-center hover:bg-(--color-primary) hover:text-(--color-background) hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
          >
            <img src={linkedin} className="w-8" alt="" />
            LinkedIn
          </a>
        </div>
      </section>
    </>
  );
}

export default HeroComponents;
