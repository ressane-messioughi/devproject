import usePageTitle from '../hooks/usePageTitle.js';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch.js';
import { toast } from 'react-toastify';

function JoinProjectPage() {
  usePageTitle('Rejoindre Un Projet');

  const { team_code } = useParams();
  const { apiFetch } = useFetch();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');

  // Fonction pour envoyer automatiquement une demande pour rejoindre le projet du QR code scanné
  // =============================================
  useEffect(() => {
    const joinProject = async () => {
      const response = await apiFetch('/project/join', {
        method: 'POST',
        body: JSON.stringify({ team_code }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || 'Impossible de rejoindre ce projet.');
        setStatus('error');
        navigate('/project');
        return;
      }

      toast.success(
        "Demande envoyée avec succès ! Veuillez attendre la confirmation du chef d'équipe.",
      );
      setStatus('success');
      navigate('/project');
    };

    joinProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team_code]);

  return (
    <section className="flex items-center justify-center min-h-[50vh] text-center">
      <h1 className="sr-only">Rejoindre un projet</h1>
      <p className="text-lg font-bold">
        {status === 'loading' && 'Envoi de la demande pour rejoindre le projet...'}
        {status === 'success' && 'Demande envoyée, redirection...'}
        {status === 'error' && "Une erreur s'est produite, redirection..."}
      </p>
    </section>
  );
}

export default JoinProjectPage;
