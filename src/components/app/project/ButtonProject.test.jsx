import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ProjectContext from '../../../context/ProjectContext.js';
import ButtonProject from './ButtonProject.jsx';

const fausseRequete = vi.fn();

vi.mock('../../../hooks/useFetch.js', () => ({
  useFetch: () => ({ apiFetch: fausseRequete }),
}));

vi.mock('react-toastify', () => ({
  toast: Object.assign(vi.fn(), { error: vi.fn(), success: vi.fn() }),
}));

function afficher() {
  render(
    <MemoryRouter>
      <ProjectContext.Provider
        value={{ setProjects: vi.fn(), setSelectedProject: vi.fn() }}
      >
        <ButtonProject />
      </ProjectContext.Provider>
    </MemoryRouter>,
  );
}

describe('ButtonProject — validation des donnees', () => {
  beforeEach(() => fausseRequete.mockReset());

  it('refuse un formulaire de creation vide', async () => {
    afficher();

    // On ouvre la modale, puis on soumet sans rien remplir.
    await userEvent.click(screen.getByText('Créer un projet'));
    await userEvent.click(screen.getByText('Créer'));

    expect(await screen.findByText(/Nom du projet requis/)).toBeInTheDocument();
    expect(screen.getByText(/Description du projet requise/)).toBeInTheDocument();
    expect(screen.getByText(/URL Trello requise/)).toBeInTheDocument();

    // La regle metier a fait son travail : rien n'est parti au serveur.
    expect(fausseRequete).not.toHaveBeenCalled();
  });

  it('refuse un nom de projet trop court', async () => {
    afficher();

    await userEvent.click(screen.getByText('Créer un projet'));
    await userEvent.type(screen.getByLabelText('Nom du projet :'), 'Test');
    await userEvent.click(screen.getByText('Créer'));

    expect(await screen.findByText(/au moins 6 caractères/)).toBeInTheDocument();
    expect(fausseRequete).not.toHaveBeenCalled();
  });

  it('exige le code d\'equipe pour rejoindre un projet', async () => {
    afficher();

    await userEvent.click(screen.getByText('Rejoindre un projet'));
    await userEvent.click(screen.getByText('Rejoindre'));

    expect(await screen.findByText(/Code du projet requis/)).toBeInTheDocument();
    expect(fausseRequete).not.toHaveBeenCalled();
  });
});