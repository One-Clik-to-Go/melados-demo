import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { UserRole } from '@/types/database';

export const dynamic = 'force-dynamic';

export interface UserRecord {
  uid: string;
  email: string;
  primer_nombre?: string;
  segundo_nombre?: string;
  primer_apellido?: string;
  segundo_apellido?: string;
  cedula?: string;
  telefono?: string;
  displayName?: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
}

export async function GET(req: NextRequest) {
  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection('usuarios').get();

    let users: UserRecord[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      const pNombre = data.primer_nombre || '';
      const sNombre = data.segundo_nombre || '';
      const pApellido = data.primer_apellido || '';
      const sApellido = data.segundo_apellido || '';
      const calcName = [pNombre, sNombre, pApellido, sApellido].filter(Boolean).join(' ') || data.displayName || data.nombre || data.email?.split('@')[0] || '';

      users.push({
        uid: doc.id,
        email: data.email || '',
        primer_nombre: pNombre,
        segundo_nombre: sNombre,
        primer_apellido: pApellido,
        segundo_apellido: sApellido,
        cedula: data.cedula || 'N/A',
        telefono: data.telefono || 'N/A',
        displayName: calcName,
        role: data.role || 'EVALUADOR',
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at,
      });
    });

    // Ensure SuperAdmin default entry exists in list if DB is empty
    if (!users.some(u => u.email === 'andres@grupoplustech.com')) {
      users.unshift({
        uid: 'superadmin-andres',
        email: 'andres@grupoplustech.com',
        primer_nombre: 'Andrés',
        primer_apellido: 'SuperAdmin',
        cedula: '8-000-0000',
        telefono: '6000-0000',
        displayName: 'Andrés (SuperAdmin)',
        role: 'ADMIN',
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error obteniendo usuarios', detail: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, role, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, cedula, telefono, displayName } = body;

    if (!email || !role) {
      return NextResponse.json(
        { error: 'email y role son obligatorios' },
        { status: 400 }
      );
    }

    const db = getAdminFirestore();
    const userRef = db.collection('usuarios').doc(email.replace(/[^a-zA-Z0-9_-]/g, '_'));

    const fullCalc = [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido].filter(Boolean).join(' ') || displayName || email.split('@')[0];

    const userData: Partial<UserRecord> = {
      email: email.trim(),
      role: role as UserRole,
      primer_nombre: primer_nombre || '',
      segundo_nombre: segundo_nombre || '',
      primer_apellido: primer_apellido || '',
      segundo_apellido: segundo_apellido || '',
      cedula: cedula || '',
      telefono: telefono || '',
      displayName: fullCalc,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    await userRef.set(userData, { merge: true });

    return NextResponse.json({
      message: 'Evaluador/Colaborador registrado exitosamente con perfil completo.',
      user: userData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error actualizando usuario', detail: error.message },
      { status: 500 }
    );
  }
}
