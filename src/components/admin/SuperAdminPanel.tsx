'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/database';
import { UserRecord } from '@/app/api/admin/users/route';
import { Eye, Plus, RefreshCw, Sparkles, CheckCircle2, UserPlus, Shield } from 'lucide-react';

export const SuperAdminPanel: React.FC = () => {
  const { simulatedRole, setSimulatedRole } = useAuth();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('EVALUADOR');
  const [newName, setNewName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch {
      setUsers([
        { uid: 'u1', email: 'andres@grupoplustech.com', displayName: 'Andrés (SuperAdmin)', role: 'ADMIN', created_at: new Date().toISOString() },
        { uid: 'u2', email: 'melanie@proninezpanama.org', displayName: 'Melanie Alvarado', role: 'ADMIN', created_at: new Date().toISOString() },
        { uid: 'u3', email: 'evaluador.veraguas@proninezpanama.org', displayName: 'Juan Pérez (Evaluador)', role: 'EVALUADOR', created_at: new Date().toISOString() },
        { uid: 'u4', email: 'donante@bancogeneral.com', displayName: 'Fundación Banco General', role: 'VIEWER', created_at: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (email: string, role: UserRole) => {
    try {
      await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });
      setMessage(`Permisos de ${email} actualizados a ${role}`);
      setTimeout(() => setMessage(null), 3000);
      fetchUsers();
    } catch {
      setMessage('No se pudo actualizar el permiso. Intenta nuevamente.');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    setSubmitting(true);
    try {
      await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, role: newRole, displayName: newName }),
      });
      setMessage(`Usuario ${newEmail} registrado como ${newRole}`);
      setNewEmail('');
      setNewName('');
      setTimeout(() => setMessage(null), 3000);
      fetchUsers();
    } catch {
      setMessage('No se pudo registrar el usuario. Intenta nuevamente.');
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* SuperAdmin Banner */}
      <div className="bg-gradient-to-r from-proninez-teal/10 via-white to-proninez-green/10 rounded-3xl p-6 border border-proninez-teal/30 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-proninez-teal text-white flex items-center justify-center shrink-0 shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">Consola de Administración Central</h2>
              <span className="bg-proninez-green/10 text-proninez-green text-xs px-2.5 py-0.5 rounded-full font-bold border border-proninez-green/20">
                andres@grupoplustech.com
              </span>
            </div>
            <p className="text-xs text-gray-500 max-w-2xl mt-0.5">
              Gestión centralizada de usuarios, asignación de permisos y prueba de experiencias de usuario en tiempo real.
            </p>
          </div>
        </div>

        {/* Role Simulator Selector for SuperAdmin */}
        <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-2 shrink-0">
          <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-proninez-teal" />
            <span>Simulador de Vista de Rol:</span>
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSimulatedRole(null)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                simulatedRole === null
                  ? 'bg-proninez-teal text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ADMIN (Real)
            </button>
            <button
              onClick={() => setSimulatedRole('EVALUADOR')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                simulatedRole === 'EVALUADOR'
                  ? 'bg-proninez-green text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Probar como EVALUADOR
            </button>
            <button
              onClick={() => setSimulatedRole('VIEWER')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                simulatedRole === 'VIEWER'
                  ? 'bg-proninez-pink text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Probar como REPORTE / AUDITOR
            </button>
          </div>
          {simulatedRole && (
            <div className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 text-center">
              Modo prueba activo: Viendo la plataforma como {simulatedRole}
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {message && (
        <div className="p-3.5 rounded-2xl bg-green-50 border border-green-200 text-xs font-bold text-proninez-green flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Users & Roles Management Table */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-proninez-teal" />
              <span>Usuarios Registrados y Permisos de Acceso</span>
            </h3>
            <p className="text-xs text-gray-500">
              Administración de acceso para colaboradores de la Asociación Proyecto MelaDos Panameña, equipo de campo y donantes.
            </p>
          </div>

          <button
            onClick={fetchUsers}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 bg-gray-100 px-3 py-1.5 rounded-xl font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Actualizar Lista</span>
          </button>
        </div>

        {/* Add New User Form */}
        <form onSubmit={handleAddUser} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
          <div className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-proninez-teal" />
            <span>Registrar Nuevo Colaborador / Asignar Permisos</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="email"
              required
              placeholder="Correo electrónico (ej. nombre@proninez.org)"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-proninez-teal"
            />
            <input
              type="text"
              placeholder="Nombre Completo"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-proninez-teal"
            />
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as UserRole)}
              className="bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-proninez-teal font-bold"
            >
              <option value="EVALUADOR">Permiso: EVALUADOR (Campo EGRA/EGMA)</option>
              <option value="ADMIN">Permiso: ADMIN (Administración General)</option>
              <option value="VIEWER">Permiso: REPORTE / AUDITOR (Acceso a Indicadores)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-proninez-teal hover:bg-proninez-teal/90 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>{submitting ? 'Guardando...' : 'Guardar Colaborador'}</span>
          </button>
        </form>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 font-bold uppercase text-[11px]">
                <th className="py-3 px-4">Usuario</th>
                <th className="py-3 px-4">Correo Electrónico</th>
                <th className="py-3 px-4">Permiso Asignado</th>
                <th className="py-3 px-4 text-right">Cambiar Permisos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.uid} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-gray-900">
                    {u.displayName || u.email.split('@')[0]}
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-600">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      u.role === 'ADMIN'
                        ? 'bg-pink-50 text-proninez-pink border-pink-200'
                        : u.role === 'EVALUADOR'
                        ? 'bg-green-50 text-proninez-green border-green-200'
                        : 'bg-teal-50 text-proninez-teal border-teal-200'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleUpdateRole(u.email, 'ADMIN')}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold ${
                        u.role === 'ADMIN' ? 'bg-proninez-pink text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      ADMIN
                    </button>
                    <button
                      onClick={() => handleUpdateRole(u.email, 'EVALUADOR')}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold ${
                        u.role === 'EVALUADOR' ? 'bg-proninez-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      EVALUADOR
                    </button>
                    <button
                      onClick={() => handleUpdateRole(u.email, 'VIEWER')}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold ${
                        u.role === 'VIEWER' ? 'bg-proninez-teal text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      VIEWER
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
