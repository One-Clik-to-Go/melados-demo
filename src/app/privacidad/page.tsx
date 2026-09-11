'use client';

import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Shield, ArrowLeft, HeartHandshake, Lock } from 'lucide-react';

export default function PrivacidadPage() {
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
        <Breadcrumbs customItems={[{ label: 'Inicio', href: '/' }, { label: 'Política de Privacidad' }]} />

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm space-y-6 text-xs text-gray-700 leading-relaxed">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-proninez-green/10 text-proninez-green flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Política de Privacidad y Protección de Datos</h1>
              <p className="text-xs text-gray-500">Conforme a la Ley 285 de Protección a la Niñez (Panamá)</p>
            </div>
          </div>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-gray-900">1. Protección Absoluta de la Identidad de los Menores</h2>
            <p>
              La privacidad e integridad de los niños evaluados en el Estudio Longitudinal de Impacto es la prioridad máxima del proyecto. Ninguna prueba de rendimiento académico (EGRA o EGMA) almacena nombres de niños, apellidos ni números de cédula en la base de datos de consulta.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-gray-900">2. Arquitectura de Desacoplamiento de Identidad</h2>
            <p>
              Los datos se gestionan mediante una estructura separada en dos colecciones aisladas:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li><strong>Colección de Evaluaciones:</strong> Contiene puntajes académicos asociados de forma exclusiva a un código anónimo (ej. `EST-P2026-1001`).</li>
              <li><strong>Colección de Identidad Protegida:</strong> Resguardada bajo cifrado y accesible únicamente por administradores autorizados de la Asociación Proyecto MelaDos Panameña.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-gray-900">3. Seguridad en la Recolección de Campo y Sincronización</h2>
            <p>
              Durante el trabajo de campo en zonas rurales sin acceso a internet, la información se almacena localmente en la memoria del navegador utilizando cifrado de sesión. Una vez restablecida la conexión, los registros se transmiten a la nube mediante protocolos seguros HTTPS / TLS 1.3.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-gray-900">4. Derechos de Acceso y Cancelación</h2>
            <p>
              Para cualquier consulta sobre las políticas de privacidad o el tratamiento de datos del estudio longitudinal, puede contactar a la <strong>Asociación Proyecto MelaDos Panameña</strong> a través de sus canales oficiales.
            </p>
          </section>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
            <span>República de Panamá</span>
            <span>Ley 285 de Protección a la Niñez Compliant</span>
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
