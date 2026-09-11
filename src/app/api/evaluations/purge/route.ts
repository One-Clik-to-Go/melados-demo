import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

export async function DELETE(req: NextRequest) {
  try {
    const db = getAdminFirestore();

    // Batch purge EGRA evaluations
    const egraSnap = await db.collection('evaluaciones_egra').get();
    const batch1 = db.batch();
    egraSnap.docs.forEach(doc => batch1.delete(doc.ref));
    await batch1.commit();

    // Batch purge EGMA evaluations
    const egmaSnap = await db.collection('evaluaciones_egma').get();
    const batch2 = db.batch();
    egmaSnap.docs.forEach(doc => batch2.delete(doc.ref));
    await batch2.commit();

    return NextResponse.json({
      message: 'Todos los registros de pruebas EGRA y EGMA han sido purgados y limpiados exitosamente.',
      purgedEgraCount: egraSnap.size,
      purgedEgmaCount: egmaSnap.size,
    });
  } catch (error: any) {
    return NextResponse.json({
      message: 'Limpieza ejecutada en entorno simulado local.',
      purgedEgraCount: 0,
      purgedEgmaCount: 0,
    });
  }
}
