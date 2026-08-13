// Le backend renvoie deux formats d'erreur différents selon son origine :
// { message } pour une AppError (règle métier), { errors: [...] } pour
// express-validator (validation de champs). Ce helper lit l'un ou l'autre
// pour qu'un seul appel affiche toujours le bon message, partout dans l'app.
export function getErrorMessage(result, fallback = 'Une erreur est survenue') {
  if (result?.errors?.length) return result.errors[0].msg;
  return result?.message || fallback;
}
