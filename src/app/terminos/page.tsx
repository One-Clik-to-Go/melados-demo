'use client';

import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { ShieldCheck, ArrowLeft, HeartHandshake } from 'lucide-react';

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-proninez-teal to-proninez-green text-white font-bold flex items-center justify-center text-xs shadow-sm">
              PNP
            </div>
            <span className="font-bold text-gray-900 text-sm">Proyecto MelaDos</span>
          </Link>
          <Link href="/" className="text-xs text-proninez-teal font-bold flex items-center gap-1 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al Inicio</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-6">
        <Breadcrumbs customItems={[{ label: 'Inicio', href: '/' }, { label: 'Términos y Condiciones' }]} />

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm space-y-6 text-xs text-gray-700 leading-relaxed">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-proninez-teal/10 text-proninez-teal flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Términos y Condiciones de Uso</h1>
              <p className="text-xs text-gray-500">Plataforma del Estudio Longitudinal de Impacto</p>
            </div>
          </div>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-gray-900">1. Disposiciones Generales</h2>
            <p>
              El presente sistema es operado por la <strong>Asociación Proyecto MelaDos Panameña</strong> con el patrocinio financiero de la <strong>Fundación Banco General</strong> y el desarrollo tecnológico de <strong>One Clik To Go</strong>. El acceso a esta plataforma está restringido al personal autorizado, aplicadores de campo y consultores acreditados.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-gray-900">2. Cumplimiento Normativo (Ley 285 de Panamá)</h2>
            <p>
              En estricto cumplimiento de la <strong>Ley 285 de Protección Integral a la Niñez y Adolescencia de la República de Panamá</strong>, la plataforma utiliza un esquema de desacoplamiento de identidades (*Online Decoupled Pattern*). Los datos académicos e indicadores de campo se procesan de forma anónima a través de códigos de cohorte.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-gray-900">3. Uso Aceptable de la Consola Móvil</h2>
            <p>
              Los evaluadores de campo son responsables del registro fidedigno de los instrumentos EGRA (Early Grade Reading Assessment) y EGMA (Early Grade Mathematics Assessment). Toda prueba realizada en zonas rurales sin conectividad será resguardada en el dispositivo local y sincronizada al servidor principal al reconectarse.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-gray-900">4. Propiedad Intelectual y Reportes</h2>
            <p>
              Toda la información metodológica, algoritmos de cálculo y reportes longitudinales son propiedad de la Asociación Proyecto MelaDos Panameña. Queda prohibida la reproducción o divulgación no autorizada de microdatos identificables.
            </p>
          </section>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
            <span>Última actualización: Agosto 2026</span>
            <span>Asociación Proyecto MelaDos Panameña</span>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 px-4 text-center text-xs text-gray-500">
        <div className="flex justify-center items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-proninez-lime" />
          <span>Asociación Proyecto MelaDos Panameña • Fundación Banco General</span>
        </div>
      </footer>
    </div>
  );
}
