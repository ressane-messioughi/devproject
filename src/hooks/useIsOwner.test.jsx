import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import ProjectContext from '../context/ProjectContext.js';
import useIsOwner from './useIsOwner.js';

// Fabrique un fournisseur de contexte avec le projet qu'on veut simuler.
const wrapperAvecProjet = (selectedProject) =>
  // eslint-disable-next-line react/prop-types
  function Wrapper({ children }) {
    return (
      <ProjectContext.Provider value={{ selectedProject }}>{children}</ProjectContext.Provider>
    );
  };

describe('useIsOwner', () => {
  it('renvoie true pour le proprietaire du projet', () => {
    const { result } = renderHook(() => useIsOwner(), {
      wrapper: wrapperAvecProjet({ id_project: 1, role: 'OWNER' }),
    });
    expect(result.current).toBe(true);
  });
});
