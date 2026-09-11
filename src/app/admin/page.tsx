'use client';

import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { School, Users, UserPlus, FileText, Settings, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminHubPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Breadcrumbs customItems={[
          { label: 'Inicio', href: '/' },
          { label: 'Panel de Administración General' }
        ]} />

        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-proninez-teal" />
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Panel de Administración General</h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 max-w-2xl">
              Proyecto MelaDos — Control centralizado de escuelas primarias, cohortes de estudiantes con traslados, equipo de evaluadores certificados y auditorías.
            </p>
          </div>
        </div>

        {/* Admin Navigation Hub Cards / Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Schools */}
          <Link
            href="/admin/escuelas"
            className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:border-proninez-teal transition-all group space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-proninez-teal flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-all">
                <School className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-proninez-teal transition-colors">
                  Escuelas e Instituciones
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Catálogo oficial de las 57 escuelas primarias de Panamá, sedes y regiones comarcales.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-proninez-teal pt-2 border-t border-gray-100">
              <span>Gestionar Escuelas</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Students */}
          <Link
            href="/admin/estudiantes"
            className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:border-proninez-pink transition-all group space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 text-proninez-pink flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-all">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-proninez-pink transition-colors">
                  Cohorte y Traslados
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Carga masiva CSV, merge de historial por matrícula en traslados y autorizaciones Ley 285.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-proninez-pink pt-2 border-t border-gray-100">
              <span>Gestionar Estudiantes</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Evaluators */}
          <Link
            href="/admin/evaluadores"
            className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:border-proninez-green transition-all group space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-proninez-green flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-all">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-proninez-green transition-colors">
                  Equipo y Evaluadores
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Registro de evaluadores con nombres y apellidos separados y roles estandarizados.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-proninez-green pt-2 border-t border-gray-100">
              <span>Gestionar Evaluadores</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Audit */}
          <Link
            href="/admin/evaluaciones"
            className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:border-proninez-teal transition-all group space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-800 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-all">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-proninez-teal transition-colors">
                  Auditoría de Pruebas
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Histórico unificado de evaluaciones EGRA y EGMA aplicadas en campo.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-gray-800 pt-2 border-t border-gray-100">
              <span>Ver Auditoría Global</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
