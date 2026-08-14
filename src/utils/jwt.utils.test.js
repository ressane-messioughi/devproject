import { describe, it, expect } from 'vitest';
import { isTokenValid } from './jwt.utils';

// exp = 2036 : encore valide
const VALID_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJpZCI6NywiZmlyc3RuYW1lIjoiUmVzc2FuZSIsInJvbGUiOiJVU0VSIiwiZXhwIjoyMTAyMDU2MzkxfQ.' +
  'signature';

// exp = il y a une heure : perime
const EXPIRED_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJpZCI6NywiZmlyc3RuYW1lIjoiUmVzc2FuZSIsInJvbGUiOiJVU0VSIiwiZXhwIjoxNzg2NjkyNzkxfQ.' +
  'signature';

describe('isTokenValid', () => {
  it('retourne false si le token est invalide', () => {
    expect(isTokenValid('token_invalide')).toBe(false);
  });

  it('retourne false si le token est expire', () => {
    expect(isTokenValid(EXPIRED_TOKEN)).toBe(false);
  });

  it('retourne true si le token est valide', () => {
    expect(isTokenValid(VALID_TOKEN)).toBe(true);
  });
});