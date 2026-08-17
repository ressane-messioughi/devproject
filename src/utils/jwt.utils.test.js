import process from 'node:process';
import { describe, it, expect } from 'vitest';
import { isTokenValid } from './jwt.utils';

// Les jetons de test viennent du fichier .env, qui n'est pas versionne.
// Ils n'ont pas le prefixe VITE_ : ils restent donc hors du bundle envoye
// au navigateur et ne servent qu'aux tests.
const VALID_TOKEN = process.env.TEST_TOKEN_VALID;
const EXPIRED_TOKEN = process.env.TEST_TOKEN_EXPIRED;

describe('isTokenValid', () => {
  it('retourne false si le token est expire', () => {
    expect(isTokenValid(EXPIRED_TOKEN)).toBe(false);
  });

  it('retourne true si le token est valide', () => {
    expect(isTokenValid(VALID_TOKEN)).toBe(true);
  });
});
