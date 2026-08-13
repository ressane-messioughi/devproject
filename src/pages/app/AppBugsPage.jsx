import usePageTitle from '../../hooks/usePageTitle.js';
import ButtonBug from '../../components/app/bug/ButtonBug.jsx';
import ListBug from '../../components/app/bug/ListBug.jsx';

function AppBugsPage() {
  usePageTitle('Bugs');

  return (
    <>
      <h1 className="sr-only">Gestion des bugs</h1>
      <div className="flex flex-col gap-6">
        <ButtonBug />
        <ListBug />
      </div>
    </>
  );
}

export default AppBugsPage;
