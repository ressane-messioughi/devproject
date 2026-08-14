import { jwtDecode } from 'jwt-decode';

// Un token est valide s'il est lisible, s'il porte une date d'expiration,
// et si cette date n'est pas depassee. exp est en secondes, Date.now() en
// millisecondes : d'ou la multiplication par 1000.
export function isTokenValid(token) {
  try {
    const decodedToken = jwtDecode(token);
    if (!decodedToken.exp) return false;
    return decodedToken.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}