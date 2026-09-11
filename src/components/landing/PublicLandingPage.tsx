'use client';

import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import {
  BookOpen, Calculator, ShieldCheck, HeartHandshake,
  ArrowRight, LogIn, ExternalLink, Award, Sparkles, MapPin, CheckCircle2
} from 'lucide-react';

export const PublicLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-proninez-teal to-proninez-green flex items-center justify-center font-bold text-white shadow-md">
              PNP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-gray-900 tracking-tight">Proyecto MelaDos</h1>
                <span className="bg-proninez-teal/10 text-proninez-teal text-xs px-2.5 py-0.5 rounded-full font-semibold border border-proninez-teal/20">
                  Estudio Longitudinal
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Programa CET • Fundación Banco General • One Clik To Go
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/evaluar"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-proninez-teal/10 text-proninez-teal border border-proninez-teal/20 hover:bg-proninez-teal hover:text-white transition-all shadow-sm"
            >
              <span>Pruebas de Campo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/login"
              className="flex items-center gap-2 bg-proninez-teal hover:bg-proninez-teal/90 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Iniciar Sesión</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-12">
        <Breadcrumbs />

        {/* Hero Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-12 border border-gray-200 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 bg-proninez-green/10 text-proninez-green border border-proninez-green/20 px-3 py-1 rounded-full text-xs font-bold">
              <Award className="w-4 h-4" />
              <span>Evidencia Científica de Estimulación Temprana (2022-2028)</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Transformando la educación inicial rural en Panamá
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Plataforma oficial del <strong>Estudio Longitudinal de Impacto</strong> de los Centros de Estimulación Temprana (CET) de la <strong>Asociación Proyecto MelaDos Panameña</strong>, financiado por la <strong>Fundación Banco General</strong> e implementado por <strong>One Clik To Go</strong>.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/login"
                className="bg-gradient-to-r from-proninez-teal to-proninez-green text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-sm hover:opacity-95 transition-all"
              >
                <span>Acceder al Panel de Control</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/evaluar"
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold px-6 py-3.5 rounded-2xl shadow-sm flex items-center justify-center gap-2 text-sm transition-all"
              >
                <BookOpen className="w-4 h-4 text-proninez-teal" />
                <span>Portal Móvil de Evaluación en Campo</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-proninez-teal/10 text-proninez-teal flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Evaluaciones EGRA y EGMA</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Aplicación de pruebas estandarizadas de lectoescritura (EGRA) y matemáticas tempranas (EGMA) adaptadas a la realidad rural panameña.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-proninez-green/10 text-proninez-green flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Protección Cumpliente Ley 285</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Resguardo estricto de identidades infantiles mediante un modelo desacoplado de códigos anónimos de cohorte.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-proninez-pink/10 text-proninez-pink flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Funcionamiento Offline en Campo</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Soporte PWA sin internet que almacena las evaluaciones en la memoria del equipo y sincroniza automáticamente al reconectarse.
            </p>
          </div>
        </section>

        {/* Institutional Banner */}
        <section className="bg-gradient-to-r from-proninez-teal/10 via-white to-proninez-green/10 rounded-3xl p-8 border border-proninez-teal/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-proninez-lime/10 text-proninez-lime flex items-center justify-center shrink-0 border border-proninez-lime/20">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Asociación Proyecto MelaDos Panameña</h3>
              <p className="text-xs text-gray-500 max-w-xl mt-0.5">
                Generando evidencias científicas de impacto positivo en el desarrollo cognitivo y sociaemocional de la niñez rural.
              </p>
            </div>
          </div>

          <Link
            href="/login"
            className="bg-proninez-teal text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-sm hover:bg-proninez-teal/90 transition-all shrink-0"
          >
            Ingresar al Sistema
          </Link>
        </section>
      </main>

      {/* Institutional Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 px-4 lg:px-8 mt-12 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-proninez-teal/10 text-proninez-teal flex items-center justify-center font-bold">
              PNP
            </div>
            <div>
              <div className="font-bold text-gray-800">Asociación Proyecto MelaDos Panameña</div>
              <div>Estudio Longitudinal de Impacto (2022-2028)</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-600">
            <Link href="/terminos" className="hover:text-proninez-teal transition-colors">
              Términos y Condiciones
            </Link>
            <span>•</span>
            <Link href="/privacidad" className="hover:text-proninez-teal transition-colors">
              Política de Privacidad
            </Link>
            <span>•</span>
            <Link href="/evaluar" className="hover:text-proninez-teal transition-colors">
              Portal de Campo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
