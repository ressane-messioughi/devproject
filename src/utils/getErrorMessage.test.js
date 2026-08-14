import { describe, it, expect } from 'vitest';
import { getErrorMessage } from './getErrorMessage.js';

describe('getErrorMessage', () => {
  it('lit le message d\'une erreur simple', () => {
    expect(getErrorMessage({ message: 'Mot de passe incorrect' }))
      .toBe('Mot de passe incorrect');
  });

  it('lit le premier message d\'une liste d\'erreurs', () => {
    expect(getErrorMessage({ errors: [{ msg: 'Email invalide' }] }))
      .toBe('Email invalide');
  });

  it('renvoie le message par defaut quand il n\'y a rien', () => {
    expect(getErrorMessage(null)).toBe('Une erreur est survenue');
  });
});