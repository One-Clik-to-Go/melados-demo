import { Meilisearch } from 'meilisearch';
import { getAdminFirestore } from '@/lib/firebase/admin';

const MEILI_HOST = process.env.MEILI_HOST || 'http://meilisearch:7700';
const MEILI_MASTER_KEY = process.env.MEILI_MASTER_KEY || '4409316835114162a2088a98b8eb154a';

export const meiliClient = new Meilisearch({
  host: MEILI_HOST,
  apiKey: MEILI_MASTER_KEY,
});

export const INDEX_ESCUELAS = 'escuelas';
export const INDEX_ESTUDIANTES = 'estudiantes';
export const INDEX_EVALUACIONES = 'evaluaciones';

/**
 * Configure Meilisearch settings and searchable attributes for all indexes
 */
export async function initializeMeiliIndexes() {
  try {
    const escuelasIndex = meiliClient.index(INDEX_ESCUELAS);
    await escuelasIndex.updateSearchableAttributes(['nombre_escuela', 'sede_region', 'id_escuela']);

    const estudiantesIndex = meiliClient.index(INDEX_ESTUDIANTES);
    await estudiantesIndex.updateSearchableAttributes(['codigo_anonimo', 'tipo_grupo', 'cet_origen', 'nombre_escuela']);

    const evaluacionesIndex = meiliClient.index(INDEX_EVALUACIONES);
    await evaluacionesIndex.updateSearchableAttributes([
      'codigo_anonimo',
      'instrumento',
      'evaluador',
      'nombre_escuela',
      'observaciones',
    ]);

    console.log('[Meilisearch] Indexes initialized successfully');
  } catch (error) {
    console.warn('[Meilisearch] Index initialization warning:', error);
  }
}

/**
 * Sync all documents from Firestore into Meilisearch indexes
 */
export async function syncFirestoreToMeilisearch() {
  const { SEED_ESCUELAS, SEED_ESTUDIANTES } = await import('@/lib/firebase/seed-data');

  try {
    const db = getAdminFirestore();

    // 1. Sync Escuelas
    const escuelasSnap = await db.collection('escuelas').get();
    const escuelasDocs: any[] = [];
    escuelasSnap.forEach(doc => {
      const data = doc.data();
      escuelasDocs.push({
        id: doc.id,
        id_escuela: doc.id,
        nombre_escuela: data.nombre_escuela || doc.id,
        sede_region: data.sede_region || 'Veraguas',
        creado_en: data.creado_en || new Date().toISOString(),
      });
    });

    if (escuelasDocs.length > 0) {
      await meiliClient.index(INDEX_ESCUELAS).addDocuments(escuelasDocs, { primaryKey: 'id' });
    }

    // 2. Sync Estudiantes
    const estudiantesSnap = await db.collection('estudiantes').get();
    const estudiantesDocs: any[] = [];
    estudiantesSnap.forEach(doc => {
      const data = doc.data();
      estudiantesDocs.push({
        id: doc.id,
        id_estudiante: doc.id,
        codigo_anonimo: data.codigo_anonimo || doc.id,
        tipo_grupo: data.tipo_grupo || 'Programa',
        cet_origen: data.cet_origen || 'CET Cañazas',
        grado_actual: data.grado_actual || 2,
        nombre_escuela: data.nombre_escuela || 'Escuela San Pedro Nolasco',
        activo: data.activo ?? true,
      });
    });

    if (estudiantesDocs.length > 0) {
      await meiliClient.index(INDEX_ESTUDIANTES).addDocuments(estudiantesDocs, { primaryKey: 'id' });
    }

    // 3. Sync Evaluaciones
    const egraSnap = await db.collection('evaluaciones_egra').get();
    const egmaSnap = await db.collection('evaluaciones_egma').get();
    const evalDocs: any[] = [];

    egraSnap.forEach(doc => {
      const data = doc.data();
      evalDocs.push({
        id: doc.id,
        instrumento: 'EGRA',
        codigo_anonimo: data.codigo_anonimo || 'EST-P2026-1001',
        tipo_grupo: data.tipo_grupo || 'Programa',
        evaluador: data.evaluador || data.evaluador_nombre || 'Evaluador de Campo',
        score_total: Math.round(data.score_total || data.scoring_calculado?.score_total || 65),
        grado: data.grado_evaluado || 2,
        observaciones: data.observaciones || '',
        fecha: data.fecha_aplicacion || data.creado_en || new Date().toISOString(),
      });
    });

    egmaSnap.forEach(doc => {
      const data = doc.data();
      evalDocs.push({
        id: doc.id,
        instrumento: 'EGMA',
        codigo_anonimo: data.codigo_anonimo || 'EST-P2026-1001',
        tipo_grupo: data.tipo_grupo || 'Programa',
        evaluador: data.evaluador || data.evaluador_nombre || 'Evaluador de Campo',
        score_total: Math.round(data.score_total || data.scoring_calculado?.score_total || 70),
        grado: data.grado_evaluado || 2,
        observaciones: data.observaciones || '',
        fecha: data.fecha_aplicacion || data.creado_en || new Date().toISOString(),
      });
    });

    if (evalDocs.length > 0) {
      await meiliClient.index(INDEX_EVALUACIONES).addDocuments(evalDocs, { primaryKey: 'id' });
    }

    return {
      syncedEscuelas: escuelasDocs.length,
      syncedEstudiantes: estudiantesDocs.length,
      syncedEvaluaciones: evalDocs.length,
    };
  } catch (error: any) {
    console.warn('[Meilisearch] Firestore query fallback to SEED dataset:', error.message);

    const escuelasDocs = SEED_ESCUELAS.map(e => ({
      id: e.id_escuela,
      id_escuela: e.id_escuela,
      nombre_escuela: e.nombre_escuela,
      sede_region: e.sede_region,
      creado_en: new Date().toISOString(),
    }));

    const estudiantesDocs = SEED_ESTUDIANTES.map(e => ({
      id: e.id_estudiante,
      id_estudiante: e.id_estudiante,
      codigo_anonimo: e.codigo_anonimo,
      tipo_grupo: e.tipo_grupo,
      cet_origen: e.cet_origen,
      grado_actual: e.grado_actual,
      nombre_escuela: e.nombre_escuela || 'Escuela San Pedro Nolasco',
      activo: e.activo,
    }));

    await meiliClient.index(INDEX_ESCUELAS).addDocuments(escuelasDocs, { primaryKey: 'id' });
    await meiliClient.index(INDEX_ESTUDIANTES).addDocuments(estudiantesDocs, { primaryKey: 'id' });

    return {
      syncedEscuelas: escuelasDocs.length,
      syncedEstudiantes: estudiantesDocs.length,
      syncedEvaluaciones: 0,
      fallback: true,
    };
  }
}
