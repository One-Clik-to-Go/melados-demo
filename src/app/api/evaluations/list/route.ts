import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const db = getAdminFirestore();

    // Query EGRA evaluations
    const egraSnap = await db.collection('evaluaciones_egra').get();
    const egraList: any[] = [];
    egraSnap.forEach(doc => {
      const data = doc.data();
      egraList.push({
        id: doc.id,
        instrumento: 'EGRA',
        codigo_anonimo: data.codigo_anonimo || 'EST-P2026-1001',
        tipo_grupo: data.tipo_grupo || 'Programa',
        evaluador: data.evaluador || data.evaluador_nombre || 'Evaluador de Campo',
        escuela_id: data.escuela_actual_id || 'escuela-san-pedro',
        grado: data.grado_evaluado || 2,
        score_total: Math.round(data.score_total || data.scoring_calculado?.score_total || 65),
        fecha: data.fecha_aplicacion || data.creado_en || new Date().toISOString(),
        observaciones: data.observaciones || '',
      });
    });

    // Query EGMA evaluations
    const egmaSnap = await db.collection('evaluaciones_egma').get();
    const egmaList: any[] = [];
    egmaSnap.forEach(doc => {
      const data = doc.data();
      egmaList.push({
        id: doc.id,
        instrumento: 'EGMA',
        codigo_anonimo: data.codigo_anonimo || 'EST-P2026-1001',
        tipo_grupo: data.tipo_grupo || 'Programa',
        evaluador: data.evaluador || data.evaluador_nombre || 'Evaluador de Campo',
        escuela_id: data.escuela_actual_id || 'escuela-san-pedro',
        grado: data.grado_evaluado || 2,
        score_total: Math.round(data.score_total || data.scoring_calculado?.score_total || 70),
        fecha: data.fecha_aplicacion || data.creado_en || new Date().toISOString(),
        observaciones: data.observaciones || '',
      });
    });

    const evaluations = [...egraList, ...egmaList].sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );

    return NextResponse.json({
      total: evaluations.length,
      evaluaciones: evaluations,
    });
  } catch (error: any) {
    return NextResponse.json({
      total: 0,
      evaluaciones: [],
      error: error.message,
    });
  }
}
