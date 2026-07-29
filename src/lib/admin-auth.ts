export const ADMIN_PASSWORD_HASH = '5b0583b28b7e283287680be9fbf09dcaae7fa8ed0e2c88f117c0a76f2f94b306';
export const AUTH_STORAGE_KEY = 'sk_admin_session_token';

/**
 * Computes SHA-256 hash of a string using Web Crypto API.
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Checks if the current client holds a valid authenticated session.
 */
export function isAuthenticatedClient(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
  return token === ADMIN_PASSWORD_HASH;
}

/**
 * Stores the authenticated session token.
 */
export function setAdminAuthSession(rememberMe: boolean = true) {
  if (typeof window === 'undefined') return;
  if (rememberMe) {
    localStorage.setItem(AUTH_STORAGE_KEY, ADMIN_PASSWORD_HASH);
  } else {
    sessionStorage.setItem(AUTH_STORAGE_KEY, ADMIN_PASSWORD_HASH);
  }
}

/**
 * Clears the authenticated session token.
 */
export function clearAdminAuthSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}
