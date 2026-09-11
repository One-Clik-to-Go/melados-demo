import { NextRequest, NextResponse } from 'next/server';
import { meiliClient, INDEX_ESCUELAS, INDEX_ESTUDIANTES, INDEX_EVALUACIONES, syncFirestoreToMeilisearch } from '@/lib/meilisearch/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all';

  if (!q || q.trim().length === 0) {
    return NextResponse.json({
      query: q,
      results: { escuelas: [], estudiantes: [], evaluaciones: [] },
    });
  }

  try {
    let escuelasResults: any[] = [];
    let estudiantesResults: any[] = [];
    let evaluacionesResults: any[] = [];

    if (type === 'all' || type === 'escuelas') {
      try {
        const res = await meiliClient.index(INDEX_ESCUELAS).search(q, { limit: 10 });
        escuelasResults = res.hits;
      } catch {}
    }

    if (type === 'all' || type === 'estudiantes') {
      try {
        const res = await meiliClient.index(INDEX_ESTUDIANTES).search(q, { limit: 10 });
        estudiantesResults = res.hits;
      } catch {}
    }

    if (type === 'all' || type === 'evaluaciones') {
      try {
        const res = await meiliClient.index(INDEX_EVALUACIONES).search(q, { limit: 10 });
        evaluacionesResults = res.hits;
      } catch {}
    }

    // Auto-sync fallback if Meilisearch returned empty results on first query
    if (escuelasResults.length === 0 && estudiantesResults.length === 0 && evaluacionesResults.length === 0) {
      try {
        await syncFirestoreToMeilisearch();
      } catch {}
    }

    return NextResponse.json({
      query: q,
      engine: 'Meilisearch',
      results: {
        escuelas: escuelasResults,
        estudiantes: estudiantesResults,
        evaluaciones: evaluacionesResults,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      query: q,
      engine: 'fallback',
      error: error.message,
      results: { escuelas: [], estudiantes: [], evaluaciones: [] },
    });
  }
}
