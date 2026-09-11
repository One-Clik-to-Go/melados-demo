import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { Estudiante, TipoGrupo } from '@/types/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { estudiantes_lista, escuela_destino_id, nombre_escuela } = body;

    if (!Array.isArray(estudiantes_lista) || estudiantes_lista.length === 0) {
      return NextResponse.json({ error: 'La lista de estudiantes no puede estar vacía' }, { status: 400 });
    }

    const db = getAdminFirestore();
    let creadosCount = 0;
    let transferidosMergedCount = 0;

    for (const rawEst of estudiantes_lista) {
      const matricula = (rawEst.matricula_cedula || rawEst.codigo_anonimo || '').trim();
      if (!matricula) continue;

      const primerNombre = (rawEst.primer_nombre || '').trim();
      const segundoNombre = (rawEst.segundo_nombre || '').trim();
      const primerApellido = (rawEst.primer_apellido || '').trim();
      const segundoApellido = (rawEst.segundo_apellido || '').trim();
      const fullNombre = [primerNombre, segundoNombre, primerApellido, segundoApellido].filter(Boolean).join(' ') || rawEst.nombre_completo || 'Estudiante Cargado';

      const finalCode = rawEst.codigo_anonimo?.trim() || `EST-${(rawEst.tipo_grupo === 'Control' ? 'C' : 'P')}2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const studentId = `est-${finalCode.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

      // Check if student exists in Firestore
      const existingDoc = await db.collection('estudiantes').doc(studentId).get();

      if (existingDoc.exists) {
        // MERGE: Update school assignment and log transfer while preserving evaluation history!
        const existingData = existingDoc.data() as Estudiante;
        const oldSchool = existingData.nombre_escuela || 'Escuela Anterior';

        await db.collection('estudiantes').doc(studentId).update({
          escuela_actual_id: escuela_destino_id || existingData.escuela_actual_id,
          nombre_escuela: nombre_escuela || existingData.nombre_escuela,
          grado_actual: rawEst.grado_actual || existingData.grado_actual || 2,
          cet_origen: rawEst.cet_origen || existingData.cet_origen,
        });

        // Record transfer history log
        await db.collection('historial_traslados').add({
          estudiante_id: studentId,
          codigo_anonimo: finalCode,
          escuela_anterior: oldSchool,
          escuela_nueva: nombre_escuela || escuela_destino_id,
          fecha_traslado: new Date().toISOString(),
          motivo: 'Carga masiva / Traslado escolar',
        });

        transferidosMergedCount++;
      } else {
        // Create new student
        const newStudent: Estudiante = {
          id_estudiante: studentId,
          codigo_anonimo: finalCode,
          tipo_grupo: (rawEst.tipo_grupo as TipoGrupo) || 'Programa',
          cet_origen: rawEst.cet_origen || 'Centro de Estimulación Temprana (CET)',
          genero: rawEst.genero || 'M',
          anio_nacimiento: rawEst.anio_nacimiento || 2018,
          fecha_nacimiento: rawEst.fecha_nacimiento || '',
          email_acudiente: rawEst.email_acudiente || '',
          matricula_escolar: matricula,
          asistio_kinder: true,
          escuela_actual_id: escuela_destino_id || 'esc-san-pedro-nolasco',
          nombre_escuela: nombre_escuela || 'Escuela San Pedro Nolasco',
          grado_actual: rawEst.grado_actual || 2,
          activo: true,
          creado_en: new Date().toISOString(),
        };

        await db.collection('estudiantes').doc(studentId).set(newStudent);

        // Save Ley 285 isolated identity with separated fields
        await db.collection('estudiantes_identidad').doc(studentId).set({
          estudiante_id: studentId,
          codigo_anonimo: finalCode,
          primer_nombre: primerNombre,
          segundo_nombre: segundoNombre,
          primer_apellido: primerApellido,
          segundo_apellido: segundoApellido,
          nombre_completo: fullNombre,
          cedula_matricula: matricula,
          email_acudiente: rawEst.email_acudiente || '',
          fecha_nacimiento: rawEst.fecha_nacimiento || '',
          creado_en: new Date().toISOString(),
        });

        creadosCount++;
      }
    }

    return NextResponse.json({
      message: `Carga masiva procesada exitosamente: ${creadosCount} estudiantes nuevos creados, ${transferidosMergedCount} estudiantes unificados/trasladados con historial conservado.`,
      creadosCount,
      transferidosMergedCount,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error procesando carga masiva', detail: error.message }, { status: 500 });
  }
}
