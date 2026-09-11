import { NextRequest, NextResponse } from 'next/server';
import { fetchStudents } from '@/lib/firebase/server-db';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { Estudiante, TipoGrupo } from '@/types/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query')?.trim().toLowerCase();

  const { estudiantes, source } = await fetchStudents();
  let safeStudents = estudiantes.map(s => ({
    id_estudiante: s.id_estudiante,
    codigo_anonimo: s.codigo_anonimo,
    tipo_grupo: s.tipo_grupo,
    cet_origen: s.cet_origen,
    generacion_egreso_cet: s.generacion_egreso_cet,
    nivel_egreso_cet: s.nivel_egreso_cet,
    genero: s.genero,
    anio_nacimiento: s.anio_nacimiento,
    asistio_kinder: s.asistio_kinder,
    nombre_escuela: s.nombre_escuela || 'Escuela San Pedro Nolasco',
    escuela_actual_id: s.escuela_actual_id || 'esc-san-pedro-nolasco',
    grado_actual: s.grado_actual,
    activo: s.activo,
  }));

  if (query) {
    safeStudents = safeStudents.filter(s =>
      s.codigo_anonimo.toLowerCase().includes(query) ||
      s.id_estudiante.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({
    total: safeStudents.length,
    estudiantes: safeStudents,
    source,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      matricula_cedula,
      codigo_anonimo,
      tipo_grupo,
      cet_origen,
      grado_actual,
      escuela_actual_id,
      nombre_escuela,
      genero,
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
    } = body;

    const searchKey = (matricula_cedula || codigo_anonimo || '').trim();
    if (!searchKey) {
      return NextResponse.json({ error: 'La matrícula, cédula o código anónimo es requerido para el registro' }, { status: 400 });
    }

    const finalCode = codigo_anonimo?.trim() || `EST-${(tipo_grupo === 'Control' ? 'C' : 'P')}2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const studentId = `est-${finalCode.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    try {
      const db = getAdminFirestore();

      // Deduplication check
      const existingSnap = await db.collection('estudiantes').where('codigo_anonimo', '==', finalCode).get();
      if (!existingSnap.empty) {
        const existingData = existingSnap.docs[0].data();
        return NextResponse.json(
          {
            error: 'El estudiante ya se encuentra registrado.',
            estudiante_existente: existingData,
            codigo_error: 'ESTUDIANTE_DUPLICADO',
          },
          { status: 409 }
        );
      }

      const newStudent: Estudiante = {
        id_estudiante: studentId,
        codigo_anonimo: finalCode,
        tipo_grupo: (tipo_grupo as TipoGrupo) || 'Programa',
        cet_origen: cet_origen || 'CET Cañazas',
        genero: genero || 'M',
        anio_nacimiento: 2018,
        asistio_kinder: true,
        escuela_actual_id: escuela_actual_id || 'esc-san-pedro-nolasco',
        nombre_escuela: nombre_escuela || 'Escuela San Pedro Nolasco',
        grado_actual: grado_actual || 2,
        activo: true,
        creado_en: new Date().toISOString(),
      };

      await db.collection('estudiantes').doc(studentId).set(newStudent);

      // Save separated identity fields in Ley 285 isolated PII collection
      const fullNombre = [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido].filter(Boolean).join(' ') || 'Estudiante Registrado';

      await db.collection('estudiantes_identidad').doc(studentId).set({
        estudiante_id: studentId,
        codigo_anonimo: finalCode,
        primer_nombre: primer_nombre || '',
        segundo_nombre: segundo_nombre || '',
        primer_apellido: primer_apellido || '',
        segundo_apellido: segundo_apellido || '',
        nombre_completo: fullNombre,
        cedula_matricula: matricula_cedula || 'N/A',
        creado_en: new Date().toISOString(),
      });

      return NextResponse.json({
        message: 'Estudiante creado exitosamente con campos de perfil separados.',
        estudiante: newStudent,
      }, { status: 201 });
    } catch {
      const mockNew: Estudiante = {
        id_estudiante: studentId,
        codigo_anonimo: finalCode,
        tipo_grupo: (tipo_grupo as TipoGrupo) || 'Programa',
        cet_origen: cet_origen || 'Centro de Estimulación Temprana (CET)',
        genero: genero || 'M',
        anio_nacimiento: 2018,
        asistio_kinder: true,
        escuela_actual_id: escuela_actual_id || 'esc-san-pedro-nolasco',
        nombre_escuela: nombre_escuela || 'Escuela San Pedro Nolasco',
        grado_actual: grado_actual || 2,
        activo: true,
        creado_en: new Date().toISOString(),
      };
      return NextResponse.json({
        message: 'Estudiante creado en modo simulación.',
        estudiante: mockNew,
      }, { status: 201 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { codigo_anonimo, id_estudiante, grado_actual, cet_origen, email_acudiente, fecha_nacimiento, escuela_actual_id, nombre_escuela } = body;

    const studentCode = codigo_anonimo || id_estudiante;
    if (!studentCode) {
      return NextResponse.json({ error: 'Se requiere el codigo_anonimo del estudiante' }, { status: 400 });
    }

    try {
      const db = getAdminFirestore();
      const docId = `est-${studentCode.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      const updates: any = {};

      if (grado_actual !== undefined) updates.grado_actual = Number(grado_actual);
      if (cet_origen !== undefined) updates.cet_origen = cet_origen;
      if (email_acudiente !== undefined) updates.email_acudiente = email_acudiente;
      if (fecha_nacimiento !== undefined) updates.fecha_nacimiento = fecha_nacimiento;
      if (escuela_actual_id !== undefined) updates.escuela_actual_id = escuela_actual_id;
      if (nombre_escuela !== undefined) updates.nombre_escuela = nombre_escuela;

      await db.collection('estudiantes').doc(docId).set(updates, { merge: true });

      return NextResponse.json({ message: 'Perfil y grado del estudiante actualizado exitosamente.', updates });
    } catch {
      return NextResponse.json({ message: 'Actualizado en modo simulación.', updates: body });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
