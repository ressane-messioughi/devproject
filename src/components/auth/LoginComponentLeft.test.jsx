import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LoginComponentLeft from './LoginComponentLeft';

// On remplace la couche reseau : aucun vrai serveur pendant un test.
const fausseRequete = vi.fn();

vi.mock('../../hooks/useFetch', () => ({
  useFetch: () => ({ apiFetch: fausseRequete }),
}));

vi.mock('react-toastify', () => ({
  toast: Object.assign(vi.fn(), { error: vi.fn(), success: vi.fn() }),
}));

function afficher() {
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ loginAuth: vi.fn() }}>
        <LoginComponentLeft />
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

describe('LoginComponentLeft', () => {
  beforeEach(() => fausseRequete.mockReset());

  it("affiche l'erreur renvoyee par le serveur", async () => {
    fausseRequete.mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Mot de passe incorrect' }),
    });

    afficher();

    await userEvent.type(screen.getByLabelText('Email:'), 'ressane@test.fr');
    await userEvent.type(screen.getByLabelText('Password:'), 'mauvais');
    await userEvent.click(screen.getByRole('button'));

    expect(await screen.findByText(/Mot de passe incorrect/)).toBeInTheDocument();
  });
});
