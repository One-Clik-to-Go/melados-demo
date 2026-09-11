import { NextResponse } from 'next/server';
import { syncFirestoreToMeilisearch, initializeMeiliIndexes } from '@/lib/meilisearch/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST() {
  try {
    await initializeMeiliIndexes();
    const result = await syncFirestoreToMeilisearch();
    return NextResponse.json({
      message: 'Sincronización con Meilisearch completada exitosamente',
      result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al sincronizar con Meilisearch', detail: error.message },
      { status: 500 }
    );
  }
}
