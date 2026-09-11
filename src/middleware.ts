import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parseRoleHeader } from '@/lib/auth/rbac';

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get('Authorization') || req.headers.get('x-user-role');
  const role = parseRoleHeader(authHeader);

  // 1. Protect Admin APIs (Ley 285 PII identity matching)
  if (req.nextUrl.pathname.startsWith('/api/admin/')) {
    if (role !== 'ADMIN') {
      return new NextResponse(
        JSON.stringify({
          error: 'Acceso no autorizado. Permisos restringidos exclusivamente a Administradores conforme a la Ley 285 de Protección a la Niñez (Panamá).',
          codigo_error: 'LEY_285_ACCESO_DENEGADO',
          rol_detectado: role
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // 2. Protect Evaluation Field Ingestion APIs
  if (req.nextUrl.pathname.startsWith('/api/evaluations/')) {
    if (!['ADMIN', 'EVALUADOR'].includes(role)) {
      return new NextResponse(
        JSON.stringify({
          error: 'No está autorizado para registrar evaluaciones de campo.',
          codigo_error: 'EVALUADOR_ACCESO_DENEGADO',
          rol_detectado: role
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*', '/api/evaluations/:path*'],
};
