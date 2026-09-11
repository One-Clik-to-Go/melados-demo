'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import {
  BookOpen, School, Users, ShieldCheck, ArrowLeft, HeartHandshake,
  FileText, CheckCircle2, Search, ExternalLink, HelpCircle, Layers, Sparkles
} from 'lucide-react';

export default function DocumentacionPage() {
  const [activeTab, setActiveTab] = useState<'EVALUACIONES' | 'ESCUELAS' | 'USUARIOS' | 'LEY285' | 'TANGERINE'>('EVALUACIONES');

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-proninez-teal to-proninez-green text-white font-bold flex items-center justify-center text-xs shadow-sm">
              PNP
            </div>
            <div>
              <span className="font-bold text-gray-900 text-sm block">Proyecto MelaDos</span>
              <span className="text-[10px] text-gray-400 font-semibold block">Centro de Documentación y Manuales</span>
            </div>
          </Link>
          <Link href="/" className="text-xs text-proninez-teal font-bold flex items-center gap-1 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al Sistema</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 space-y-6">
        <Breadcrumbs customItems={[{ label: 'Inicio', href: '/' }, { label: 'Centro de Documentación' }]} />

        {/* Banner Title */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-proninez-teal/10 text-proninez-teal border border-proninez-teal/20 px-3 py-0.5 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Manuales de Operación Versión 0.0.1</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Centro de Documentación de Usuarios y Guías</h1>
            <p className="text-xs text-gray-500">
              Guías de uso de la consola móvil, gestión de escuelas, administración de evaluadores, comparativa Tangerine y Ley 285.
            </p>
          </div>

          <Link
            href="/evaluar"
            target="_blank"
            className="bg-proninez-teal hover:bg-proninez-teal/90 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all shrink-0"
          >
            <span>Ir a Consola Móvil</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Documentation Sub-Tabs */}
        <div className="flex flex-wrap bg-gray-100 p-1.5 rounded-2xl border border-gray-200 text-xs font-bold gap-1">
          <button
            onClick={() => setActiveTab('EVALUACIONES')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'EVALUACIONES' ? 'bg-proninez-teal text-white shadow-md' : 'text-gray-600 hover:bg-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Manual de Evaluaciones EGRA/EGMA</span>
          </button>

          <button
            onClick={() => setActiveTab('ESCUELAS')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'ESCUELAS' ? 'bg-proninez-green text-white shadow-md' : 'text-gray-600 hover:bg-white'
            }`}
          >
            <School className="w-4 h-4" />
            <span>2. Gestión de Escuelas y Sedes</span>
          </button>

          <button
            onClick={() => setActiveTab('USUARIOS')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'USUARIOS' ? 'bg-proninez-pink text-white shadow-md' : 'text-gray-600 hover:bg-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>3. Usuarios y Permisos</span>
          </button>

          <button
            onClick={() => setActiveTab('LEY285')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'LEY285' ? 'bg-gradient-to-r from-proninez-teal to-proninez-green text-white shadow-md' : 'text-gray-600 hover:bg-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>4. Protección Ley 285</span>
          </button>

          <button
            onClick={() => setActiveTab('TANGERINE')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'TANGERINE' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-600 hover:bg-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>5. Comparativa Tangerine® Central</span>
          </button>
        </div>

        {/* Tab 1: Evaluaciones */}
        {activeTab === 'EVALUACIONES' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6 text-xs text-gray-700 leading-relaxed">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <BookOpen className="w-5 h-5 text-proninez-teal" />
              <span>Manual del Aplicador de Campo: Evaluaciones Certificadas EGRA y EGMA</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-proninez-teal text-white flex items-center justify-center text-[10px]">1</span>
                  <span>Protocolo Certificado EGRA (7 Sub-pruebas)</span>
                </h3>
                <ol className="list-decimal pl-5 space-y-1 text-gray-600">
                  <li><strong>Reconocimiento de letras (1 min)</strong>: Medición del número de letras identificadas por minuto.</li>
                  <li><strong>Sonido de las letras</strong>: Identificación fonética de grafemas.</li>
                  <li><strong>Lectura de palabras simples</strong>: Decodificación de palabras frecuentes.</li>
                  <li><strong>Lectura de pseudopalabras</strong>: Lectura de palabras inventadas para medir decodificación pura.</li>
                  <li><strong>Lectura de pasaje en voz alta</strong>: Fluidez en texto narrativo corto.</li>
                  <li><strong>Comprensión lectora directa</strong>: Preguntas sobre el pasaje leído.</li>
                  <li><strong>Comprensión auditiva</strong>: Preguntas tras escuchar una narración del evaluador.</li>
                </ol>
              </div>

              <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-proninez-green text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Protocolo Certificado EGMA (6 Sub-pruebas)</span>
                </h3>
                <ol className="list-decimal pl-5 space-y-1 text-gray-600">
                  <li><strong>Identificación de números</strong>: Lectura de dígitos y números de 2 cifras.</li>
                  <li><strong>Comparación de cantidades</strong>: Discriminación de mayor/menor entre pares.</li>
                  <li><strong>Secuencias numéricas</strong>: Completar el número faltante en una serie.</li>
                  <li><strong>Operaciones de suma</strong>: Sumas básicas de un dígito.</li>
                  <li><strong>Operaciones de resta</strong>: Restas básicas sin reagrupación.</li>
                  <li><strong>Problemas verbales</strong>: Razonamiento numérico aplicado a contexto cotidiano.</li>
                </ol>
              </div>
            </div>

            <div className="bg-teal-50 border border-teal-200 p-4 rounded-2xl space-y-2">
              <h4 className="font-bold text-proninez-teal text-xs">🚀 Modo Sesión Activa (Evaluación Secuencial en Lote)</h4>
              <p>
                Al evaluar en zonas rurales, active la casilla <strong>&quot;Fijar sesión para evaluar varios estudiantes consecutivamente&quot;</strong>. Esto mantendrá guardado el nombre del evaluador y la escuela elegida, de modo que al finalizar con un alumno, con solo presionar <strong>&quot;Evaluar Siguiente Niño&quot;</strong> el sistema limpiará la prueba sin requerir volver a llenar los datos institucionales.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Escuelas */}
        {activeTab === 'ESCUELAS' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6 text-xs text-gray-700 leading-relaxed">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <School className="w-5 h-5 text-proninez-green" />
              <span>Manual de Gestión de Escuelas y Control Anti-Duplicados</span>
            </h2>

            <div className="space-y-4">
              <p>
                La plataforma gestiona el catálogo de escuelas rurales y sedes de la República de Panamá conectadas a los Centros de Estimulación Temprana (CET).
              </p>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
                <h3 className="font-bold text-gray-900 text-xs">Regiones Educativas Soportadas</h3>
                <p>
                  Las escuelas están organizadas por provincia y comarca: <em>Veraguas (Cañazas, San Francisco)</em>, <em>Comarca Ngäbe-Buglé (Ñurüm, Munä, Besikö)</em>, <em>Chiriquí (David)</em>, <em>Coclé (Penonomé)</em>, <em>Panamá Centro</em> y <em>Panamá Oeste (La Chorrera)</em>.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-2">
                <h3 className="font-bold text-amber-800 text-xs">🛡️ Algoritmo Anti-Duplicados</h3>
                <p>
                  Al agregar una nueva escuela desde el panel de administración, el sistema ejecuta una validación por normalización (conversión a minúsculas y eliminación de espacios). Si la escuela ya existe en la base de datos de Firestore, la solicitud responderá con un código <strong>HTTP 409 Conflict</strong> informando que el registro se encuentra duplicado.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Usuarios */}
        {activeTab === 'USUARIOS' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6 text-xs text-gray-700 leading-relaxed">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Users className="w-5 h-5 text-proninez-pink" />
              <span>Manual de Administración de Usuarios, Permisos y Simulador SuperAdmin</span>
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-1">
                  <div className="font-bold text-proninez-teal text-xs">Rol: EVALUADOR</div>
                  <p className="text-[11px] text-gray-600">
                    Acceso a la consola móvil para la toma e ingesta de pruebas EGRA y EGMA en campo.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200 space-y-1">
                  <div className="font-bold text-proninez-pink text-xs">Rol: ADMIN</div>
                  <p className="text-[11px] text-gray-600">
                    Acceso al centro de gestión, resolución de identidades (Ley 285), alta de alumnos y escuelas.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-green-50 border border-green-200 space-y-1">
                  <div className="font-bold text-proninez-green text-xs">Rol: REPORTE / AUDITOR</div>
                  <p className="text-[11px] text-gray-600">
                    Acceso exclusivo a indicadores de impacto longitudinal sin permisos de modificación.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
                <h3 className="font-bold text-gray-900 text-xs">Simulador de Roles en Tiempo Real (SuperAdmin)</h3>
                <p>
                  El usuario SuperAdmin autorizados cuenta con la capacidad de simular la experiencia de cualquier rol en vivo. A través de la barra superior o la pestaña SuperAdmin, se puede alternar entre <em>ADMIN</em>, <em>EVALUADOR</em> y <em>REPORTE / AUDITOR</em> sin cerrar la sesión activa.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Ley 285 */}
        {activeTab === 'LEY285' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6 text-xs text-gray-700 leading-relaxed">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <ShieldCheck className="w-5 h-5 text-proninez-teal" />
              <span>Cumplimiento Normativo de la Ley 285 de Panamá (Protección de la Niñez)</span>
            </h2>

            <div className="space-y-4">
              <p>
                La <strong>Ley 285 de 15 de febrero de 2022</strong> establece el sistema de protección integral de la niñez y la adolescencia en la República de Panamá. Para dar cumplimiento a esta normativa, la plataforma implementa el patrón de <strong>Desacoplamiento de Identidad en Línea (*Online Decoupled Pattern*)</strong>.
              </p>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                <h3 className="font-bold text-gray-900 text-xs">Aislamiento de Microdatos en Base de Datos</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>
                    <strong>Colección de Evaluaciones (`evaluaciones_egra` / `evaluaciones_egma`)</strong>: Almacena únicamente puntajes de rendimiento académico vinculados a un código anónimo de cohorte (ej. `EST-P2026-1001`). No contiene nombres, apellidos ni cédulas infantiles.
                  </li>
                  <li>
                    <strong>Colección de Identidad Protegida (`estudiantes_identidad`)</strong>: Almacena la resolución de nombres de estudiantes resguardada bajo reglas de seguridad en Firestore accesibles únicamente por administradores autorizados.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Comparativa Tangerine */}
        {activeTab === 'TANGERINE' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6 text-xs text-gray-700 leading-relaxed">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Layers className="w-5 h-5 text-proninez-teal" />
              <span>Estudio Comparativo y Garantía de Migración: Tangerine® Central vs. Proyecto MelaDos</span>
            </h2>

            <div className="space-y-4">
              <p>
                <strong>Tangerine® Central</strong> es el estándar internacional desarrollado por <strong>RTI International</strong> para recolección de datos offline en evaluaciones iniciales de lectura (EGRA) y matemáticas (EGMA). A continuación se certifica la paridad funcional de la nueva plataforma para una migración 100% transparente.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse border border-gray-200 rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200">
                      <th className="p-3">Característica</th>
                      <th className="p-3">Tangerine® Central</th>
                      <th className="p-3">Plataforma Proyecto MelaDos</th>
                      <th className="p-3 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-600">
                    <tr>
                      <td className="p-3 font-bold text-gray-900">Operación Offline (Sin Internet)</td>
                      <td className="p-3">PouchDB / CouchDB</td>
                      <td className="p-3">IndexedDB + ServiceWorker (PWA)</td>
                      <td className="p-3 text-center font-bold text-green-600">100% Cumplido</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-gray-900">Sub-pruebas EGRA (7 Módulos)</td>
                      <td className="p-3">Letras, Sonidos, Palabras, Pasaje, Comprensión</td>
                      <td className="p-3">7 Sub-pruebas Certificadas en App</td>
                      <td className="p-3 text-center font-bold text-green-600">100% Cumplido</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-gray-900">Sub-pruebas EGMA (6 Módulos)</td>
                      <td className="p-3">Números, Cantidades, Series, Sumas, Restas</td>
                      <td className="p-3">6 Sub-pruebas Certificadas en App</td>
                      <td className="p-3 text-center font-bold text-green-600">100% Cumplido</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-gray-900">Cronómetro de 60 Segundos</td>
                      <td className="p-3">Temporizador integrado</td>
                      <td className="p-3">Reloj interactivo de 60s con pausa/reinicio</td>
                      <td className="p-3 text-center font-bold text-green-600">100% Cumplido</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-gray-900">Protección de Datos PII (Ley 285)</td>
                      <td className="p-3">Anonimización básica</td>
                      <td className="p-3">Aislamiento total en línea (*Decoupled PII*)</td>
                      <td className="p-3 text-center font-bold text-teal-600">Superado ⭐</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-gray-900">Evaluación en Lote (Escuelas Rurales)</td>
                      <td className="p-3">Re-selección manual</td>
                      <td className="p-3">Modo *Sticky Session* en 1 clic</td>
                      <td className="p-3 text-center font-bold text-teal-600">Superado ⭐</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl space-y-2">
                <h3 className="font-bold text-gray-900 text-xs">📄 Documento Completo en GitHub</h3>
                <p>
                  El análisis detallado con desglose de microdatos y protocolo de importación histórica se encuentra disponible en la carpeta del repositorio: <code>docs/COMPARATIVA_TANGERINE.md</code>.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 px-4 text-center text-xs text-gray-500">
        <div className="flex justify-center items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-proninez-lime" />
          <span>Asociación Proyecto MelaDos Panameña • Fundación Banco General • One Clik To Go</span>
        </div>
      </footer>
    </div>
  );
}
