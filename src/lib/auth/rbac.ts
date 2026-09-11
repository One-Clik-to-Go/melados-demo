import { UserRole } from '@/types/database';

export interface UserSession {
  userId: string;
  name: string;
  role: UserRole;
  exp: number;
}

export function parseRoleHeader(authHeader: string | null): UserRole {
  if (!authHeader) return 'VIEWER';

  // Support custom header simulation (e.g., "Bearer role-ADMIN", "Bearer role-EVALUADOR", "Bearer role-VIEWER")
  if (authHeader.includes('role-ADMIN') || authHeader.includes('role=ADMIN')) return 'ADMIN';
  if (authHeader.includes('role-EVALUADOR') || authHeader.includes('role=EVALUADOR')) return 'EVALUADOR';
  if (authHeader.includes('role-VIEWER') || authHeader.includes('role=VIEWER')) return 'VIEWER';

  return 'VIEWER';
}

export function canAccessUnmaskedPII(role: UserRole): boolean {
  // Ley 285 Panama: Strict restriction. ONLY ADMIN can resolve student identities.
  return role === 'ADMIN';
}

export function canIngestEvaluations(role: UserRole): boolean {
  return role === 'ADMIN' || role === 'EVALUADOR';
}

export function getMockTokenForRole(role: UserRole): string {
  return `Bearer role-${role}`;
}
