import { NextRequest, NextResponse } from 'next/server';
import { fetchIdentityByAnonymousCode } from '@/lib/firebase/server-db';
import { parseRoleHeader, canAccessUnmaskedPII } from '@/lib/auth/rbac';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization') || req.headers.get('x-user-role');
  const role = parseRoleHeader(authHeader);

  if (!canAccessUnmaskedPII(role)) {
    return NextResponse.json(
      {
        error: 'Acceso no autorizado a la resolución de identidad (Ley 285). Requiere rol de Administrador.',
        codigo_error: 'LEY_285_ACCESO_DENEGADO',
      },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const codigo = searchParams.get('codigo_anonimo');

  if (!codigo) {
    return NextResponse.json(
      { error: 'El parámetro codigo_anonimo es obligatorio' },
      { status: 400 }
    );
  }

  const identity = await fetchIdentityByAnonymousCode(codigo);

  if (!identity) {
    return NextResponse.json(
      { error: `No se encontró registro de identidad para el código ${codigo}` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    codigo_anonimo: codigo,
    estudiante_id: identity.estudiante_id,
    nombre_completo: identity.nombre_completo,
    cedula: identity.cedula || 'Sin cédula registrada',
    protegido_por: 'Ley 285 de Protección a la Niñez (Panamá)',
    audit: {
      acceso_concedido_a: 'ADMIN (Melanie Alvarado)',
      timestamp: new Date().toISOString(),
    }
  });
}
