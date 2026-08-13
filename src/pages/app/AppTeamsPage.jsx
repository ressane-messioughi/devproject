import usePageTitle from '../../hooks/usePageTitle.js';
import TeamToolsBar from '../../components/app/team/TeamToolsBar.jsx';
import TeamMemberCard from '../../components/app/team/TeamMemberCard.jsx';
import { useState } from 'react';

function AppTeamsPage() {
  usePageTitle('Mon Équipe');

  const [refreshMembers, setRefreshMembers] = useState(false);
  const triggerRefreshMembers = () => {
    setRefreshMembers((prev) => !prev);
  };
  return (
    <section className="md:mr-60">
      <h1 className="sr-only">Mon équipe</h1>
      <TeamToolsBar onMemberAccepted={triggerRefreshMembers} />
      <TeamMemberCard refreshMembers={refreshMembers} />
    </section>
  );
}

export default AppTeamsPage;
