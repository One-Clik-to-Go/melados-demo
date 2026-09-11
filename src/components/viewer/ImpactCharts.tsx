'use client';

import React from 'react';
import { DashboardStats } from '@/types/database';
import { BookOpen, Calculator, CalendarCheck, TrendingUp, Users, Award, HeartHandshake, Database, Cloud } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

interface ChartDataPoint {
  sub: string;
  Programa: number;
  Control: number;
  UCPN?: number;
}

interface ImpactChartsProps {
  stats: DashboardStats;
  egraData: ChartDataPoint[];
  egmaData: ChartDataPoint[];
  dataSource: 'firestore' | 'seed';
}

export const ImpactCharts: React.FC<ImpactChartsProps> = ({ stats, egraData, egmaData, dataSource }) => {
  const diffEgra = stats.promedio_egra_programa - stats.promedio_egra_control;
  const diffEgma = stats.promedio_egma_programa - stats.promedio_egma_control;

  return (
    <div className="space-y-8">
      {/* Data Source Indicator */}
      <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold border ${
        dataSource === 'firestore'
          ? 'bg-green-50 text-proninez-green border-green-200'
          : 'bg-blue-50 text-proninez-blue border-blue-200'
      }`}>
        {dataSource === 'firestore' ? (
          <>
            <Cloud className="w-4 h-4 text-proninez-green" />
            <span>Información actualizada en tiempo real</span>
          </>
        ) : (
          <>
            <Database className="w-4 h-4 text-proninez-blue" />
            <span>Modo de demostración — Muestras ilustrativas de evaluación</span>
          </>
        )}
      </div>

      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Muestra */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-proninez-teal mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Muestra Longitudinal</span>
            <Users className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-gray-900">{stats.total_estudiantes}</div>
          <div className="text-xs text-gray-500 mt-1 font-medium flex items-center gap-2">
            <span className="bg-proninez-teal/10 text-proninez-teal px-2 py-0.5 rounded-md font-bold">{stats.estudiantes_programa} CET</span>
            <span>vs</span>
            <span className="bg-gray-100 px-2 py-0.5 rounded-md font-bold text-gray-600">{stats.estudiantes_control} Control</span>
          </div>
        </div>

        {/* EGRA */}
        <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-proninez-green mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Impacto EGRA (Lectura)</span>
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-proninez-green">
            {stats.promedio_egra_programa}%
          </div>
          <div className="text-xs text-proninez-lime mt-1 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{diffEgra.toFixed(1)}% sobre control ({stats.promedio_egra_control}%)</span>
          </div>
        </div>

        {/* EGMA */}
        <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-proninez-purple mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Impacto EGMA (Matemáticas)</span>
            <Calculator className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-proninez-purple">
            {stats.promedio_egma_programa}%
          </div>
          <div className="text-xs text-proninez-purple/70 mt-1 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{diffEgma.toFixed(1)}% sobre control ({stats.promedio_egma_control}%)</span>
          </div>
        </div>

        {/* Asistencia */}
        <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-proninez-pink mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Asistencia Escolar</span>
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-proninez-pink">
            {stats.asistencia_promedio_programa}%
          </div>
          <div className="text-xs text-gray-500 mt-1 font-medium">
            Prevención de deserción escolar
          </div>
        </div>
      </div>

      {/* Institutional Banner */}
      <div className="bg-gradient-to-r from-proninez-teal/5 via-white to-proninez-green/5 rounded-2xl p-6 border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-proninez-lime/10 text-proninez-lime flex items-center justify-center shrink-0 border border-proninez-lime/20">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Reporte Técnico para la Fundación Banco General</h3>
            <p className="text-xs text-gray-500 max-w-2xl mt-0.5">
              Demostración científica con datos estructurados del impacto a largo plazo de los CET de la Asociación Proyecto MelaDos Panameña en comunidades rurales.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="bg-proninez-teal/10 text-proninez-teal text-xs font-bold px-3 py-1.5 rounded-xl border border-proninez-teal/20 flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            Evidencia Científica V2
          </span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* EGRA Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-proninez-teal" />
              Desempeño en Lectoescritura (EGRA)
            </h3>
            <p className="text-xs text-gray-500">Comparativa por sub-dimensión entre cohorte CET y Control</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={egraData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="sub" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="UCPN" fill="#ebb540" radius={[6, 6, 0, 0]} name="CET + Laptop (UCPN) (%)" />
                <Bar dataKey="Programa" fill="#65bec2" radius={[6, 6, 0, 0]} name="CET Programa (%)" />
                <Bar dataKey="Control" fill="#d1d5db" radius={[6, 6, 0, 0]} name="Grupo Control (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* EGMA Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-proninez-lime" />
              Desempeño en Matemáticas (EGMA)
            </h3>
            <p className="text-xs text-gray-500">Comparativa por sub-dimensión matemática</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={egmaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="sub" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="UCPN" fill="#ebb540" radius={[6, 6, 0, 0]} name="CET + Laptop (UCPN) (%)" />
                <Bar dataKey="Programa" fill="#70b839" radius={[6, 6, 0, 0]} name="CET Programa (%)" />
                <Bar dataKey="Control" fill="#d1d5db" radius={[6, 6, 0, 0]} name="Grupo Control (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
