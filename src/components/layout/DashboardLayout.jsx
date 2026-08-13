import { Outlet } from 'react-router-dom';
import NavbarAside from '../layout/NavbarAside.jsx';

export default function DashboardLayout() {
  return (
    <>
      <NavbarAside />
      <main className="bg-[url('/background.png')] bg-cover bg-center min-h-dvh px-6 pb-6 pt-20 md:p-12 md:ml-[230px]">
        <Outlet />
      </main>
    </>
  );
}
