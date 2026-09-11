import { NextRequest, NextResponse } from 'next/server';
import { EvaluationIngestPayload } from '@/types/database';
import { saveEvaluationIngest } from '@/lib/firebase/server-db';
import { parseRoleHeader, canIngestEvaluations } from '@/lib/auth/rbac';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  return NextResponse.json({
    status: 'OK',
    service: 'Ingesta de Evaluaciones EGRA/EGMA Proyecto MelaDos',
    method: 'POST para registrar evaluaciones',
  });
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization') || req.headers.get('x-user-role');
  const role = parseRoleHeader(authHeader);

  if (!canIngestEvaluations(role)) {
    return NextResponse.json(
      { error: 'No autorizado para ingresar evaluaciones de campo' },
      { status: 403 }
    );
  }

  try {
    const payload = (await req.json()) as EvaluationIngestPayload;

    if (!payload.estudiante?.codigo_anonimo || !payload.evaluacion_academicas?.instrumento) {
      return NextResponse.json(
        { error: 'Estructura de payload inválida' },
        { status: 400 }
      );
    }

    const result = await saveEvaluationIngest(payload);

    return NextResponse.json({
      status: 'COMPLETADO',
      id_transaccion: result.id,
      codigo_anonimo: payload.estudiante.codigo_anonimo,
      instrumento: payload.evaluacion_academicas.instrumento,
      sincronizado_en: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error procesando ingesta de evaluación', detalle: error.message },
      { status: 500 }
    );
  }
}
