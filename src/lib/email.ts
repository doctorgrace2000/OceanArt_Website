/**
 * Email con forma real: usuario@dominio.ext. Rechaza puntos al principio o al final,
 * puntos dobles, espacios y extensiones de menos de 2 letras (ej. "ana@gmail.com." o "ana@gmail").
 */
const EMAIL_RE =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;

export function isValidEmail(email: string): boolean {
  return email.length <= 160 && EMAIL_RE.test(email);
}
