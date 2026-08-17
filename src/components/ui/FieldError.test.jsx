import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FieldError from './FieldError.jsx';

describe('FieldError', () => {
  it("affiche le message de l'erreur", () => {
    // 1. j'affiche le composant dans la page invisible
    render(<FieldError error={{ message: 'Email requis' }} />);

    // 2. je le cherche   3. je verifie qu'il est bien la
    expect(screen.getByText(/Email requis/)).toBeInTheDocument();
  });
});
