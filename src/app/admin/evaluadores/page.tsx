'use client';

import React, { useState, useEffect } from 'react';
import { UserRole } from '@/types/database';
import { UserRecord } from '@/app/api/admin/users/route';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Users, UserPlus, RefreshCw, CheckCircle2, Mail, Phone, CreditCard, ShieldCheck } from 'lucide-react';

export default function AdminEvaluadoresPage() {
  const [evaluators, setEvaluators] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State (Full Normalized Profile Fields)
  const [evalEmail, setEvalEmail] = useState('');
  const [primerNombre, setPrimerNombre] = useState('');
  const [segundoNombre, setSegundoNombre] = useState('');
  const [primerApellido, setPrimerApellido] = useState('');
  const [segundoApellido, setSegundoApellido] = useState('');
  const [cedula, setCedula] = useState('');
  const [telefono, setTelefono] = useState('');
  const [evalRole, setEvalRole] = useState<UserRole>('EVALUADOR');
  const [submitting, setSubmitting] = useState(false);

  const fetchEvaluators = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) setEvaluators(data.users);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchEvaluators();
  }, []);

  const handleAddEvaluator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalEmail.trim() || !primerNombre.trim() || !primerApellido.trim()) {
      alert('Por favor complete al menos el Primer Nombre, Primer Apellido y Correo del evaluador.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: evalEmail.trim(),
          role: evalRole,
          primer_nombre: primerNombre.trim(),
          segundo_nombre: segundoNombre.trim(),
          primer_apellido: primerApellido.trim(),
          segundo_apellido: segundoApellido.trim(),
          cedula: cedula.trim(),
          telefono: telefono.trim(),
        }),
      });

      if (res.ok) {
        setToastMessage(`Evaluador ${primerNombre} ${primerApellido} registrado exitosamente.`);
        setEvalEmail('');
        setPrimerNombre('');
        setSegundoNombre('');
        setPrimerApellido('');
        setSegundoApellido('');
        setCedula('');
        setTelefono('');
        fetchEvaluators();
      }
    } catch {
      setToastMessage('Error registrando colaborador.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumbs customItems={[
          { label: 'Inicio', href: '/' },
          { label: 'Panel de Administración', href: '/admin' },
          { label: 'Equipo y Evaluadores' }
        ]} />

        {/* Header */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">Equipo de Campo y Evaluadores Certificados</h1>
              <span className="bg-proninez-green/10 text-proninez-green text-xs px-2.5 py-0.5 rounded-full font-bold border border-proninez-green/20">
                {evaluators.length} Usuarios Registrados
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Perfil completo de evaluadores: Nombres, Apellidos, Cédula, Teléfono y Correo Electrónico.
            </p>
          </div>

          <button
            onClick={fetchEvaluators}
            disabled={loading}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar Equipo</span>
          </button>
        </div>

        {toastMessage && (
          <div className="p-3.5 rounded-2xl bg-green-50 border border-green-200 text-xs font-bold text-proninez-green flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Form (Full Profile Fields: First Name, Middle Name, First Surname, Second Surname, Cédula, Phone, Email) */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
          <form onSubmit={handleAddEvaluator} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
            <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5 border-b border-gray-200 pb-2">
              <UserPlus className="w-4 h-4 text-proninez-green" />
              <span>Registrar Evaluador de Campo (Perfil Completo Estandarizado)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Primer Nombre *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. María"
                  value={primerNombre}
                  onChange={(e) => setPrimerNombre(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2 text-xs text-gray-900 focus:outline-none focus:border-proninez-green"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Segundo Nombre</label>
                <input
                  type="text"
                  placeholder="Ej. Isabel"
                  value={segundoNombre}
                  onChange={(e) => setSegundoNombre(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2 text-xs text-gray-900 focus:outline-none focus:border-proninez-green"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Primer Apellido *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Morales"
                  value={primerApellido}
                  onChange={(e) => setPrimerApellido(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2 text-xs text-gray-900 focus:outline-none focus:border-proninez-green"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Segundo Apellido</label>
                <input
                  type="text"
                  placeholder="Ej. Castillo"
                  value={segundoApellido}
                  onChange={(e) => setSegundoApellido(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2 text-xs text-gray-900 focus:outline-none focus:border-proninez-green"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Cédula de Identidad *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 8-123-4567"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-proninez-green"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Teléfono de Contacto</label>
                <input
                  type="text"
                  placeholder="Ej. 6677-8899"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2 text-xs font-mono text-gray-900 focus:outline-none focus:border-proninez-green"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  placeholder="evaluador@proninezpanama.org"
                  value={evalEmail}
                  onChange={(e) => setEvalEmail(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2 text-xs text-gray-900 focus:outline-none focus:border-proninez-green"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Permiso / Rol *</label>
                <select
                  value={evalRole}
                  onChange={(e) => setEvalRole(e.target.value as UserRole)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2 text-xs font-bold text-gray-900"
                >
                  <option value="EVALUADOR">EVALUADOR (Campo EGRA/EGMA)</option>
                  <option value="ADMIN">ADMIN (Administrador Principal)</option>
                  <option value="VIEWER">REPORTE / AUDITOR</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting || !evalEmail.trim()}
                className="bg-proninez-green hover:bg-proninez-green/90 text-white font-bold px-6 py-2 rounded-xl text-xs shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                <span>{submitting ? 'Guardando...' : 'Guardar Perfil Completo'}</span>
              </button>
            </div>
          </form>

          {/* Evaluators Full Profile Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-bold uppercase text-[11px]">
                  <th className="py-3 px-4">Nombre Completo del Evaluador</th>
                  <th className="py-3 px-4">Cédula</th>
                  <th className="py-3 px-4">Teléfono</th>
                  <th className="py-3 px-4">Correo Electrónico</th>
                  <th className="py-3 px-4">Rol / Permiso</th>
                  <th className="py-3 px-4 text-right">Estatus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {evaluators.map(u => (
                  <tr key={u.uid} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900">{u.displayName || u.email.split('@')[0]}</td>
                    <td className="py-3.5 px-4 font-mono text-gray-700">{u.cedula || 'N/A'}</td>
                    <td className="py-3.5 px-4 font-mono text-gray-700">{u.telefono || 'N/A'}</td>
                    <td className="py-3.5 px-4 font-mono text-gray-600">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-teal-50 text-proninez-teal border border-teal-200 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="bg-green-50 text-proninez-green border border-green-200 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                        Habilitado
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
