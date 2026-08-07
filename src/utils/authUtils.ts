import { UserProfile } from '../types';

export const ADMIN_EMAIL = 'ahmedalsherif30@gmail.com';

/**
 * Validates whether a given user profile has Administrative access rights
 * according to platform RBAC policies.
 */
export function isAdminUser(user?: UserProfile | null): boolean {
  if (!user || !user.email) return false;
  return user.email.trim().toLowerCase() === ADMIN_EMAIL;
}
