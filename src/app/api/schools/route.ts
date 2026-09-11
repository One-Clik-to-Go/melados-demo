import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { Escuela } from '@/types/database';
import { SEED_ESCUELAS } from '@/lib/firebase/seed-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection('escuelas').get();

    let escuelas: Escuela[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      escuelas.push({
        id_escuela: doc.id,
        nombre_escuela: data.nombre_escuela || doc.id,
        sede_region: data.sede_region || 'Veraguas',
        creado_en: data.creado_en,
      });
    });

    if (escuelas.length < 10) {
      const batch = db.batch();
      SEED_ESCUELAS.forEach(s => {
        const ref = db.collection('escuelas').doc(s.id_escuela);
        batch.set(ref, { ...s, creado_en: new Date().toISOString() }, { merge: true });
      });
      await batch.commit();
      escuelas = SEED_ESCUELAS;
    }

    return NextResponse.json({ escuelas });
  } catch (error: any) {
    return NextResponse.json({ escuelas: SEED_ESCUELAS, source: 'fallback' });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre_escuela, sede_region } = body;

    if (!nombre_escuela || !nombre_escuela.trim()) {
      return NextResponse.json({ error: 'El nombre de la escuela es obligatorio' }, { status: 400 });
    }

    const normalizedNewName = nombre_escuela.trim().toLowerCase();
    const db = getAdminFirestore();

    // Deduplication check across existing schools in Firestore
    const snapshot = await db.collection('escuelas').get();
    let isDuplicate = false;
    let duplicateSchool: Escuela | null = null;

    snapshot.forEach(doc => {
      const data = doc.data();
      const existingName = (data.nombre_escuela || '').trim().toLowerCase();
      if (existingName === normalizedNewName) {
        isDuplicate = true;
        duplicateSchool = {
          id_escuela: doc.id,
          nombre_escuela: data.nombre_escuela,
          sede_region: data.sede_region,
        };
      }
    });

    if (isDuplicate && duplicateSchool) {
      return NextResponse.json(
        {
          error: `La escuela "${nombre_escuela}" ya se encuentra registrada en el sistema.`,
          codigo_error: 'ESCUELA_DUPLICADA',
          escuela: duplicateSchool,
        },
        { status: 409 }
      );
    }

    const id_escuela = 'escuela-' + normalizedNewName.replace(/[^a-z0-9]/g, '-').slice(0, 35);
    const newSchool: Escuela = {
      id_escuela,
      nombre_escuela: nombre_escuela.trim(),
      sede_region: sede_region || 'Veraguas - Cañazas',
      creado_en: new Date().toISOString(),
    };

    await db.collection('escuelas').doc(id_escuela).set(newSchool);

    return NextResponse.json({
      message: 'Escuela registrada exitosamente',
      escuela: newSchool,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error registrando la escuela', detail: error.message }, { status: 500 });
  }
}
