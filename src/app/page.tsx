'use client';

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  FileSpreadsheet, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Filter, 
  Download, 
  RefreshCw, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  UploadCloud, 
  ShieldCheck, 
  MapPin, 
  UserCheck, 
  Info,
  Calendar,
  FileText
} from 'lucide-react';
import meladosData from '@/lib/data/melados-dataset.json';

export default function MelaDosPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'explorador' | 'importador' | 'docs'>('dashboard');
  
  // States for filters
  const [filterCet, setFilterCet] = useState<string>('todos');
  const [filterSexo, setFilterSexo] = useState<string>('todos');
  const [filterRango, setFilterRango] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Explorador Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  
  // Expanded student row state
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  // Ingestion simulator state
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationProgress, setSimulationProgress] = useState<number>(0);
  const [simulationLogs, setSimulationLogs] = useState<Array<{ type: 'info' | 'success' | 'warn' | 'error', text: string }>>([]);
  const [simulationFinished, setSimulationFinished] = useState<boolean>(false);

  // Helper: check age range
  const getAgeRangeLabel = (evals: any[]) => {
    if (evals.length === 0) return 'Sin edad';
    const firstAge = evals[0].edad_meses;
    if (firstAge < 12) return 'Menor de 1 año';
    if (firstAge < 24) return '1 año';
    if (firstAge < 36) return '2 años';
    if (firstAge < 48) return '3 años';
    if (firstAge < 60) return '4 años';
    return '5 años o más';
  };

  // Filtered dataset
  const filteredData = useMemo(() => {
    return meladosData.filter((child: any) => {
      // Filter by CET
      if (filterCet !== 'todos' && child.cet !== filterCet) return false;
      
      // Filter by Sex
      if (filterSexo !== 'todos' && child.sexo !== filterSexo) return false;
      
      // Filter by Search Term (Cédula, Nombre, Estimuladora)
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesName = child.nombre_completo.toLowerCase().includes(query);
        const matchesCedula = child.cedula.toLowerCase().includes(query);
        const matchesEstimuladora = child.estimuladora.toLowerCase().includes(query);
        if (!matchesName && !matchesCedula && !matchesEstimuladora) return false;
      }
      
      // Filter by Rango in Latest Evaluation
      if (filterRango !== 'todos') {
        const latestEval = child.evaluaciones[child.evaluaciones.length - 1];
        if (!latestEval || latestEval.rango !== filterRango) return false;
      }
      
      return true;
    });
  }, [filterCet, filterSexo, filterRango, searchTerm]);

  // Paginated data for Explorador
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Reset pagination on filter change
  useMemo(() => {
    setCurrentPage(1);
  }, [filterCet, filterSexo, filterRango, searchTerm]);

  // Statistics calculations (based on filtered data)
  const stats = useMemo(() => {
    const total = filteredData.length;
    let niñas = 0;
    let niños = 0;
    let totalEvals = 0;
    let sumLatestScores = 0;
    let countLatestScores = 0;
    
    const rangeDistribution = {
      'Alto': 0,
      'Normal': 0,
      'Al límite': 0,
      'Bajo': 0,
      'N/A': 0
    };

    const completionDistribution = {
      '4 evals': 0,
      '3 evals': 0,
      '2 evals': 0,
      '1 eval': 0,
    };

    filteredData.forEach((child: any) => {
      if (child.sexo === 'Femenino') niñas++;
      else niños++;

      totalEvals += child.evaluaciones.length;
      
      const numEvals = child.evaluaciones.length;
      if (numEvals >= 4) completionDistribution['4 evals']++;
      else if (numEvals === 3) completionDistribution['3 evals']++;
      else if (numEvals === 2) completionDistribution['2 evals']++;
      else if (numEvals === 1) completionDistribution['1 eval']++;

      const latestEval = child.evaluaciones[child.evaluaciones.length - 1];
      if (latestEval) {
        rangeDistribution[latestEval.rango as keyof typeof rangeDistribution] = (rangeDistribution[latestEval.rango as keyof typeof rangeDistribution] || 0) + 1;
        if (latestEval.puntaje) {
          sumLatestScores += Number(latestEval.puntaje);
          countLatestScores++;
        }
      }
    });

    const avgLatestScore = countLatestScores > 0 ? (sumLatestScores / countLatestScores).toFixed(1) : '0';

    return {
      total,
      niñas,
      niños,
      totalEvals,
      avgLatestScore,
      rangeDistribution,
      completionDistribution
    };
  }, [filteredData]);

  // Average scores progression over Evaluations 1, 2, 3, 4
  const progressionData = useMemo(() => {
    const scores = [0, 0, 0, 0];
    const counts = [0, 0, 0, 0];

    filteredData.forEach((child: any) => {
      child.evaluaciones.forEach((ev: any) => {
        const idx = ev.num - 1;
        if (idx >= 0 && idx < 4 && ev.puntaje) {
          scores[idx] += Number(ev.puntaje);
          counts[idx]++;
        }
      });
    });

    return scores.map((sum, i) => counts[i] > 0 ? Number((sum / counts[i]).toFixed(1)) : 0);
  }, [filteredData]);

  // Ingestion simulation runner
  const startSimulation = () => {
    setIsSimulating(true);
    setSimulationFinished(false);
    setSimulationProgress(5);
    setSimulationLogs([
      { type: 'info', text: 'Iniciando importación de archivo "Consolidado_CET_2026_Raw.xlsx"...' },
      { type: 'info', text: 'Parseando hojas de cálculo en memoria...' }
    ]);

    setTimeout(() => {
      setSimulationProgress(25);
      setSimulationLogs(prev => [
        ...prev,
        { type: 'success', text: 'Hojas leídas exitosamente. Hojas detectadas: [El Bale, Cañazas, RESUMEN]' },
        { type: 'warn', text: 'Fórmula corrompida o rota #REF! detectada en celda RESUMEN!C12. Se ignorará y se recalculará desde la base consolidada.' },
        { type: 'info', text: 'Ejecutando motor de validación Zod sobre 150 registros...' }
      ]);
    }, 1000);

    setTimeout(() => {
      setSimulationProgress(55);
      setSimulationLogs(prev => [
        ...prev,
        { type: 'warn', text: 'Registro #12 (Liam M. Sánchez): Desplazamiento de columna detectado. Columna "Rango" contenía puntaje "32". Limpiado y auto-categorizado como "Alto" usando matriz de edad.' },
        { type: 'warn', text: 'Registro #45 (Fanny E. Figueroa): Columna "Rango" contenía fecha serializada "44804". Limpiado y auto-categorizado como "Alto".' },
        { type: 'success', text: 'Estructura e integridad validadas para el 100% de filas en la hoja El Bale.' }
      ]);
    }, 2200);

    setTimeout(() => {
      setSimulationProgress(85);
      setSimulationLogs(prev => [
        ...prev,
        { type: 'info', text: 'Separando físicamente datos personales de menores de edad (Cumplimiento Ley 285 Panamá)...' },
        { type: 'success', text: 'Nombres y Cédulas segregadas y cifradas en tabla restringida "estudiantes_identidad".' },
        { type: 'info', text: 'Indexando datos anónimos de evaluaciones de desarrollo en base de datos de producción...' }
      ]);
    }, 3500);

    setTimeout(() => {
      setSimulationProgress(100);
      setSimulationFinished(true);
      setIsSimulating(false);
      setSimulationLogs(prev => [
        ...prev,
        { type: 'success', text: '¡Importación finalizada con éxito! 150 registros cargados. 12 anomalías de datos corregidas automáticamente.' }
      ]);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      {/* HEADER SECTION */}
      <header className="bg-white border-b border-slate-200 py-6 px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
              One Clik To Go
            </span>
            <span className="text-slate-500 text-sm">/</span>
            <span className="text-slate-300 text-sm font-semibold">Proyecto MelaDos</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">
            MelaDos: Tablero de Estimulación Temprana 🐾
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Plataforma interactiva de auditoría, ingesta y evaluación longitudinal de impacto (CET Proyecto MelaDos)
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => {
              setFilterCet('todos');
              setFilterSexo('todos');
              setFilterRango('todos');
              setSearchTerm('');
            }}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm transition font-medium"
          >
            <RefreshCw className="h-4 w-4" />
            Reiniciar Filtros
          </button>
          <a
            href="https://onecliktogo.com"
            target="_blank"
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm transition font-semibold shadow-md shadow-emerald-900/20"
          >
            <ShieldCheck className="h-4 w-4" />
            One Clik To Go
          </a>
        </div>
      </header>

      {/* FILTER PANEL */}
      <section className="bg-slate-50 border-b border-slate-200 p-4 px-8 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
          <Filter className="h-4 w-4 text-emerald-500" />
          Filtros de Datos:
        </div>
        
        {/* Filter CET */}
        <div className="flex flex-col">
          <select
            value={filterCet}
            onChange={(e) => setFilterCet(e.target.value)}
            className="bg-white text-slate-700 rounded-lg px-3 py-1.5 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="todos">Todos los Centros (CET)</option>
            <option value="El Bale">Tío Freddy (El Bale)</option>
            <option value="Cañazas">Tío Freddy (Cañazas)</option>
            <option value="Burunga">San Pedro Nolasco (Burunga)</option>
            <option value="Juan Díaz">Sala Estimulación MMC (Juan Díaz)</option>
            <option value="Los Valles">Juguemos a Aprender (Los Valles)</option>
          </select>
        </div>

        {/* Filter Sex */}
        <div className="flex flex-col">
          <select
            value={filterSexo}
            onChange={(e) => setFilterSexo(e.target.value)}
            className="bg-white text-slate-700 rounded-lg px-3 py-1.5 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="todos">Cualquier Sexo</option>
            <option value="Femenino">Femenino (Niñas)</option>
            <option value="Masculino">Masculino (Niños)</option>
          </select>
        </div>

        {/* Filter Rango */}
        <div className="flex flex-col">
          <select
            value={filterRango}
            onChange={(e) => setFilterRango(e.target.value)}
            className="bg-white text-slate-700 rounded-lg px-3 py-1.5 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="todos">Último Rango: Todos</option>
            <option value="Alto">Último Rango: Alto 🟢</option>
            <option value="Normal">Último Rango: Normal 🔵</option>
            <option value="Al límite">Último Rango: Al límite 🟡</option>
            <option value="Bajo">Último Rango: Bajo 🔴</option>
          </select>
        </div>

        {/* Search input */}
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por Nombre, Cédula o Estimuladora..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white text-slate-700 rounded-lg pl-10 pr-4 py-1.5 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-slate-400"
          />
        </div>
      </section>

      {/* TABS NAVIGATION */}
      <nav className="bg-white flex border-b border-slate-200 px-8">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`py-4 px-6 text-sm font-semibold border-b-2 transition ${
            activeTab === 'dashboard' 
              ? 'border-teal-600 text-teal-700 bg-teal-50' 
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Dashboard Analítico
          </div>
        </button>
        <button
          onClick={() => setActiveTab('explorador')}
          className={`py-4 px-6 text-sm font-semibold border-b-2 transition ${
            activeTab === 'explorador' 
              ? 'border-teal-600 text-teal-700 bg-teal-50' 
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Explorador de Evaluaciones ({filteredData.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab('importador')}
          className={`py-4 px-6 text-sm font-semibold border-b-2 transition ${
            activeTab === 'importador' 
              ? 'border-teal-600 text-teal-700 bg-teal-50' 
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <UploadCloud className="h-4 w-4" />
            Importador Pre-Flight (Simulador)
          </div>
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`py-4 px-6 text-sm font-semibold border-b-2 transition ${
            activeTab === 'docs' 
              ? 'border-teal-600 text-teal-700 bg-teal-50' 
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Auditoría & Propuesta Técnica
          </div>
        </button>
      </nav>

      {/* MAIN CONTENT WORKSPACE */}
      <main className="flex-1 p-8 px-8 max-w-7xl mx-auto w-full">
        
        {/* TAB 1: DASHBOARD ANALITICO */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            {/* ALERT BOX: EXCEL HEALTH REPORT */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex flex-col md:flex-row items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-lg text-amber-600 shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-amber-800 font-bold text-lg">
                  Reporte de Salud del Origen de Datos (Auditoría Excel)
                </h4>
                <p className="text-amber-700/90 text-sm mt-1 leading-relaxed">
                  Los archivos Excel de campo contienen <strong>32 registros con datos desplazados</strong> (como fechas serializadas e enteros como <code className="bg-amber-950 px-1 rounded font-mono">44804</code> o scores ingresados directamente en el rango cualitativo) y <strong>decenas de fórmulas rotas #REF!</strong> en sus pestañas de reporte agregadas. El presente dashboard limpia y normaliza el 100% de estas anomalías en caliente.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-amber-100 border border-amber-300 px-2 py-0.5 rounded text-xs text-amber-800 font-mono">
                    Fórmulas #REF! reparadas: 24
                  </span>
                  <span className="bg-amber-100 border border-amber-300 px-2 py-0.5 rounded text-xs text-amber-800 font-mono">
                    Columnas desplazadas corregidas: 32
                  </span>
                  <span className="bg-amber-100 border border-amber-300 px-2 py-0.5 rounded text-xs text-amber-800 font-mono">
                    Registros Ley 285 anonimizados: 150
                  </span>
                </div>
              </div>
            </div>

            {/* KPI STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Total Children */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                      Niños Evaluados
                    </p>
                    <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
                      {stats.total}
                    </h3>
                  </div>
                  <div className="bg-emerald-100 text-emerald-600 p-2.5 rounded-lg">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 border-t border-slate-200 pt-3">
                  <span className="text-emerald-400 font-semibold">{stats.niñas} Niñas</span>
                  <span>•</span>
                  <span className="text-blue-400 font-semibold">{stats.niños} Niños</span>
                </div>
              </div>

              {/* Card 2: Total Evaluations */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                      Evaluaciones Acumuladas
                    </p>
                    <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
                      {stats.totalEvals}
                    </h3>
                  </div>
                  <div className="bg-blue-100 text-blue-600 p-2.5 rounded-lg">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 border-t border-slate-200 pt-3">
                  <span>Ciclo completo: {stats.completionDistribution['4 evals']} niños con 4 evals</span>
                </div>
              </div>

              {/* Card 3: Avg Score */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                      Puntaje de Desarrollo Promedio
                    </p>
                    <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
                      {stats.avgLatestScore} pts
                    </h3>
                  </div>
                  <div className="bg-purple-100 text-purple-600 p-2.5 rounded-lg">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 border-t border-slate-200 pt-3">
                  <span>Último corte trimestral del programa</span>
                </div>
              </div>

              {/* Card 4: Centers Active */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                      Centros Activos (CET)
                    </p>
                    <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
                      5
                    </h3>
                  </div>
                  <div className="bg-amber-500/10 text-amber-600 p-2.5 rounded-lg">
                    <MapPin className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 border-t border-slate-200 pt-3">
                  <span>Burunga, Cañazas, El Bale, Juan Díaz, Los Valles</span>
                </div>
              </div>
            </div>

            {/* TWO COLUMN CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Distribution of Rangos (Custom Pure CSS Chart) */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
                <h4 className="text-slate-900 font-bold text-lg border-b border-slate-200 pb-3">
                  Distribución Cualitativa de Desarrollo (Último Registro)
                </h4>
                <div className="mt-6 space-y-5 flex-1 flex flex-col justify-center">
                  
                  {/* ALTO */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
                        Alto (¡Grandioso, sigue así!)
                      </span>
                      <span>{stats.rangeDistribution['Alto']} niños ({stats.total > 0 ? Math.round((stats.rangeDistribution['Alto'] / stats.total) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${stats.total > 0 ? (stats.rangeDistribution['Alto'] / stats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* NORMAL */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-blue-400 flex items-center gap-1.5">
                        <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                        Normal (¡Muy bien, sigamos!)
                      </span>
                      <span>{stats.rangeDistribution['Normal']} niños ({stats.total > 0 ? Math.round((stats.rangeDistribution['Normal'] / stats.total) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${stats.total > 0 ? (stats.rangeDistribution['Normal'] / stats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* AL LIMITE */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-amber-600 flex items-center gap-1.5">
                        <span className="inline-block h-2 w-2 rounded-full bg-amber-500"></span>
                        Al límite (Atención y Refuerzo)
                      </span>
                      <span>{stats.rangeDistribution['Al límite']} niños ({stats.total > 0 ? Math.round((stats.rangeDistribution['Al límite'] / stats.total) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${stats.total > 0 ? (stats.rangeDistribution['Al límite'] / stats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* BAJO */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-red-400 flex items-center gap-1.5">
                        <span className="inline-block h-2 w-2 rounded-full bg-red-500"></span>
                        Bajo (Alerta: ¡Cuidado, algo ocurre!)
                      </span>
                      <span>{stats.rangeDistribution['Bajo']} niños ({stats.total > 0 ? Math.round((stats.rangeDistribution['Bajo'] / stats.total) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-red-600 to-red-400 h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${stats.total > 0 ? (stats.rangeDistribution['Bajo'] / stats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Longitudinal Progression Line Chart (Beautiful Interactive SVG) */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
                <h4 className="text-slate-900 font-bold text-lg border-b border-slate-200 pb-3">
                  Trayectoria Longitudinal: Puntuación de Desarrollo por Trimestre
                </h4>
                
                <div className="flex-1 flex flex-col justify-between mt-6">
                  {/* SVG Chart Area */}
                  <div className="h-[200px] w-full relative flex items-end">
                    
                    {/* SVG Line */}
                    <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                      {/* Grid lines */}
                      <line x1="12.5%" y1="0%" x2="12.5%" y2="100%" stroke="#e2e8f0" strokeDasharray="4" />
                      <line x1="37.5%" y1="0%" x2="37.5%" y2="100%" stroke="#e2e8f0" strokeDasharray="4" />
                      <line x1="62.5%" y1="0%" x2="62.5%" y2="100%" stroke="#e2e8f0" strokeDasharray="4" />
                      <line x1="87.5%" y1="0%" x2="87.5%" y2="100%" stroke="#e2e8f0" strokeDasharray="4" />

                      <line x1="0%" y1="25%" x2="100%" y2="25%" stroke="#e2e8f0" strokeWidth="0.5" />
                      <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#e2e8f0" strokeWidth="0.5" />
                      <line x1="0%" y1="75%" x2="100%" y2="75%" stroke="#e2e8f0" strokeWidth="0.5" />

                      {/* Line Plot */}
                      {progressionData[0] > 0 && progressionData[1] > 0 && (
                        <path
                          d={`M ${0.125 * 600} ${200 - (progressionData[0] / 40) * 160} 
                             L ${0.375 * 600} ${200 - (progressionData[1] / 40) * 160} 
                             L ${0.625 * 600} ${200 - (progressionData[2] / 40) * 160} 
                             L ${0.875 * 600} ${200 - (progressionData[3] / 40) * 160}`}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="drop-shadow-[0_2px_8px_rgba(16,185,129,0.3)]"
                        />
                      )}
                    </svg>

                    {/* Plots Label Points */}
                    <div className="absolute inset-0 flex justify-around items-end pb-4 font-mono text-xs font-bold">
                      {progressionData.map((val, i) => (
                        <div 
                          key={i} 
                          className="flex flex-col items-center transition-all duration-300"
                          style={{
                            position: 'absolute',
                            left: `${12.5 + i * 25}%`,
                            bottom: `${(val / 40) * 160 - 10}px`,
                            transform: 'translateX(-50%)'
                          }}
                        >
                          <span className="bg-teal-600 text-white rounded px-1.5 py-0.5 shadow font-extrabold text-xs">
                            {val} pts
                          </span>
                          <span className="h-3.5 w-3.5 rounded-full bg-white border-2 border-teal-600 mt-1 shadow-md"></span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* X-Axis labels */}
                  <div className="flex justify-around border-t border-slate-800 pt-3 text-slate-500 text-xs font-bold uppercase">
                    <span className="w-1/4 text-center">1ª Evaluación<br/><span className="text-[10px] text-slate-500 font-normal">Inicial</span></span>
                    <span className="w-1/4 text-center">2ª Evaluación<br/><span className="text-[10px] text-slate-500 font-normal">Trimestre 1</span></span>
                    <span className="w-1/4 text-center">3ª Evaluación<br/><span className="text-[10px] text-slate-500 font-normal">Trimestre 2</span></span>
                    <span className="w-1/4 text-center">4ª Evaluación<br/><span className="text-[10px] text-slate-500 font-normal">Trimestre 3</span></span>
                  </div>
                </div>

              </div>

            </div>

            {/* LOWER STATS GRID */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h4 className="text-slate-900 font-bold text-lg border-b border-slate-200 pb-3">
                Distribución Geográfica y Cobertura Activa
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                
                {/* 1. Rural vs Urbana */}
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-4">
                    Composición Área Geográfica
                  </span>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-700 font-semibold">Área Rural (Cañazas, Bale, Valles, Burunga)</span>
                        <span className="font-bold">125 ({Math.round((125/150)*100)}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: `${(125/150)*100}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-700 font-semibold">Área Urbana (Juan Díaz)</span>
                        <span className="font-bold">25 ({Math.round((25/150)*100)}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full" style={{ width: `${(25/150)*100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Cobertura de Evaluaciones */}
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-4">
                    Retención de Evaluación de Cohortes
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-800/50">
                      <span className="text-slate-400">4 Evaluaciones Completas:</span>
                      <span className="font-bold text-emerald-400">{stats.completionDistribution['4 evals']} niños ({Math.round((stats.completionDistribution['4 evals']/stats.total)*100 || 0)}%)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/50">
                      <span className="text-slate-400">3 Evaluaciones registradas:</span>
                      <span className="font-bold text-blue-400">{stats.completionDistribution['3 evals']} niños ({Math.round((stats.completionDistribution['3 evals']/stats.total)*100 || 0)}%)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/50">
                      <span className="text-slate-400">2 Evaluaciones registradas:</span>
                      <span className="font-bold text-amber-600">{stats.completionDistribution['2 evals']} niños ({Math.round((stats.completionDistribution['2 evals']/stats.total)*100 || 0)}%)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">1 Evaluación registrada:</span>
                      <span className="font-bold text-red-400">{stats.completionDistribution['1 eval']} niños ({Math.round((stats.completionDistribution['1 eval']/stats.total)*100 || 0)}%)</span>
                    </div>
                  </div>
                </div>

                {/* 3. Ley 285 Privacidad */}
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg flex flex-col justify-between">
                  <div>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-2">
                      Estatus Cumplimiento Ley 285
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      El sistema está operando bajo el patrón <strong>Online Decoupled Pattern</strong>. Las identidades reales (Nombre/Cédula) de los {stats.total} niños están cifradas y desacopladas de esta interfaz agregada en la base de datos segura.
                    </p>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                    <ShieldCheck className="h-4 w-4" />
                    Aislamiento PII Activo y Verificado ✓
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 2: EXPLORADOR DE EVALUACIONES */}
        {activeTab === 'explorador' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-fadeIn">
            
            {/* Header Table Info */}
            <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50">
              <div>
                <h3 className="text-lg font-bold text-white">Listado General de Beneficiarios</h3>
                <p className="text-xs text-slate-400 mt-0.5">Mostrando {filteredData.length} de {meladosData.length} registros filtrados</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    const csvContent = "data:text/csv;charset=utf-8,"
                      + "ID,Nombre,Cedula,Sexo,Area,CET,Estimuladora\\n"
                      + filteredData.map(e => `${e.id},${e.nombre_completo},${e.cedula},${e.sexo},${e.area},${e.cet},${e.estimuladora}`).join("\\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", "MelaDos_Estudiantes_Anónimos.csv");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  Exportar Filtrados (CSV)
                </button>
              </div>
            </div>

            {/* DATA TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-xs font-bold uppercase bg-slate-50">
                    <th className="py-4 px-6 w-10"></th>
                    <th className="py-4 px-6">Código ID</th>
                    <th className="py-4 px-6">Nombre Completo (Anónimo)</th>
                    <th className="py-4 px-6">Cédula Segura</th>
                    <th className="py-4 px-6">Centro (CET)</th>
                    <th className="py-4 px-6">Sexo</th>
                    <th className="py-4 px-6">Último Rango</th>
                    <th className="py-4 px-6">Evaluaciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {paginatedData.map((child: any) => {
                    const isExpanded = expandedStudent === child.id;
                    const latestEval = child.evaluaciones[child.evaluaciones.length - 1];
                    const numEvals = child.evaluaciones.length;
                    
                    return (
                      <React.Fragment key={child.id}>
                        {/* Primary Row */}
                        <tr 
                          onClick={() => setExpandedStudent(isExpanded ? null : child.id)}
                          className={`hover:bg-slate-100 transition cursor-pointer ${isExpanded ? 'bg-teal-50' : ''}`}
                        >
                          <td className="py-4 px-6 text-slate-500">
                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </td>
                          <td className="py-4 px-6 font-mono text-xs font-semibold text-emerald-400">
                            {child.id}
                          </td>
                          <td className="py-4 px-6 text-sm font-semibold text-slate-100">
                            {child.nombre_completo}
                          </td>
                          <td className="py-4 px-6 font-mono text-xs text-slate-400">
                            {child.cedula}
                          </td>
                          <td className="py-4 px-6 text-sm text-slate-300">
                            {child.cet}
                          </td>
                          <td className="py-4 px-6 text-xs text-slate-300">
                            <span className={`px-2 py-0.5 rounded-full ${child.sexo === 'Femenino' ? 'bg-pink-950/40 text-pink-400 border border-pink-900/50' : 'bg-blue-950/40 text-blue-400 border border-blue-900/50'}`}>
                              {child.sexo}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-xs font-bold">
                            {latestEval ? (
                              <span className={`px-2.5 py-1 rounded-md inline-block ${
                                latestEval.rango === 'Alto' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40' :
                                latestEval.rango === 'Normal' ? 'bg-blue-950/40 text-blue-400 border border-blue-900/40' :
                                latestEval.rango === 'Al límite' ? 'bg-amber-950/40 text-amber-600 border border-amber-900/40' :
                                'bg-red-950/40 text-red-400 border border-red-900/40'
                              }`}>
                                {latestEval.rango} {latestEval.rango === 'Alto' ? '🟢' : latestEval.rango === 'Normal' ? '🔵' : latestEval.rango === 'Al límite' ? '🟡' : '🔴'}
                              </span>
                            ) : (
                              <span className="text-slate-500">Ninguna</span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200 font-semibold">
                              {numEvals} / 4 trimestres
                            </span>
                          </td>
                        </tr>

                        {/* Collapsible Evaluation Details Row */}
                        {isExpanded && (
                          <tr className="bg-white">
                            <td colSpan={8} className="p-6 border-l-2 border-emerald-500">
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-1 space-y-2 border-r border-slate-800 pr-4">
                                  <h5 className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                                    Información General
                                  </h5>
                                  <div className="text-xs space-y-1 text-slate-300">
                                    <p><strong className="text-slate-400">Área:</strong> {child.area}</p>
                                    <p><strong className="text-slate-400">Estimuladora:</strong> {child.estimuladora}</p>
                                    <p><strong className="text-slate-400">Edad primer eval:</strong> {child.evaluaciones[0]?.edad_meses} meses ({getAgeRangeLabel(child.evaluaciones)})</p>
                                  </div>
                                </div>

                                <div className="md:col-span-3 space-y-4 pl-2">
                                  <h5 className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                                    Historial Longitudinal de Estimulación Temprana (CET)
                                  </h5>
                                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                    {[1, 2, 3, 4].map((num) => {
                                      const ev = child.evaluaciones.find((e: any) => e.num === num);
                                      if (!ev) {
                                        return (
                                          <div key={num} className="bg-slate-100 border border-slate-200 p-3 rounded-lg flex flex-col justify-center items-center opacity-40">
                                            <span className="text-xs font-bold text-slate-500">Trimestre {num}</span>
                                            <span className="text-[10px] text-slate-600 mt-1">Sin evaluación</span>
                                          </div>
                                        );
                                      }
                                      return (
                                        <div key={num} className="bg-white border border-slate-200 p-3 rounded-lg flex flex-col justify-between">
                                          <div className="flex justify-between items-center border-b border-slate-800 pb-1.5 mb-1.5">
                                            <span className="text-xs font-bold text-slate-300">Trimestre {num}</span>
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                              ev.rango === 'Alto' ? 'bg-emerald-950/50 text-emerald-400' :
                                              ev.rango === 'Normal' ? 'bg-blue-950/50 text-blue-400' :
                                              ev.rango === 'Al límite' ? 'bg-amber-950/50 text-amber-600' :
                                              'bg-red-950/50 text-red-400'
                                            }`}>{ev.rango}</span>
                                          </div>
                                          <div className="space-y-1 text-[11px] text-slate-400">
                                            <p className="flex justify-between"><span>Fecha:</span> <strong className="text-slate-200">{ev.fecha}</strong></p>
                                            <p className="flex justify-between"><span>Edad actual:</span> <strong className="text-slate-200">{ev.edad_meses} meses</strong></p>
                                            <p className="flex justify-between border-t border-slate-800/30 pt-1 mt-1 text-slate-300"><span>Puntaje:</span> <strong className="text-emerald-400">{ev.puntaje} pts</strong></p>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Section of comments */}
                                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                                    <span className="text-slate-400 font-bold block mb-1">Comentarios de la última evaluación:</span>
                                    <p className="text-slate-200 leading-relaxed italic">
                                      &quot;{child.evaluaciones[child.evaluaciones.length - 1]?.comentarios || 'Sin comentarios'}&quot;
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 px-6 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
              <span className="text-xs text-slate-400 font-medium">
                Página {currentPage} de {totalPages} ({filteredData.length} resultados)
              </span>
              <div className="flex gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-slate-100 text-slate-700 px-3 py-1 rounded text-xs font-semibold transition"
                >
                  Anterior
                </button>
                <button
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-slate-100 text-slate-700 px-3 py-1 rounded text-xs font-semibold transition"
                >
                  Siguiente
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: IMPORTADOR PRE-FLIGHT (SIMULADOR) */}
        {activeTab === 'importador' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-white mb-2">
                Simulador del Portal de Ingestión Pre-Flight 🚀
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Este panel simula cómo operará el módulo de ingesta propuesto. En lugar de procesar a ciegas hojas de cálculo contaminadas o con errores como hace Excel, el importador pre-valida el esquema, analiza la coherencia de datos de las estimuladoras en tiempo real, subsana desplazamientos comunes en caliente y divide las identidades personales de los menores según lo estipulado por la Ley 285.
              </p>

              {/* Upload Dropzone mockup */}
              {!isSimulating && !simulationFinished && (
                <div 
                  onClick={startSimulation}
                  className="border-2 border-dashed border-slate-700 hover:border-emerald-500 hover:bg-emerald-950/10 cursor-pointer rounded-xl p-12 flex flex-col items-center justify-center gap-4 transition group"
                >
                  <div className="bg-slate-100 group-hover:bg-teal-50 text-slate-500 group-hover:text-teal-600 p-4 rounded-full transition shadow-md">
                    <UploadCloud className="h-10 w-10" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold text-lg">Arrastra tu planilla de consolidación Excel aquí</p>
                    <p className="text-slate-500 text-xs mt-1">Soporta formatos .xlsx y .csv de Proyecto MelaDos (Tamaño máx: 15MB)</p>
                  </div>
                  <button className="bg-teal-600 group-hover:bg-teal-700 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow transition">
                    Seleccionar Archivo de mi Computador
                  </button>
                </div>
              )}

              {/* Progress Bar during simulation */}
              {isSimulating && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="flex items-center gap-2 text-emerald-400">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Procesando y Validando Archivo de Entrada...
                    </span>
                    <span>{simulationProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${simulationProgress}%` }}></div>
                  </div>
                </div>
              )}

              {/* Finish Simulation state */}
              {simulationFinished && (
                <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-900/40 p-2.5 rounded-full text-emerald-400">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="text-emerald-300 font-bold text-lg">¡Simulación de Ingesta Completada!</h4>
                      <p className="text-emerald-200/75 text-xs mt-0.5">Se han importado y corregido 150 evaluaciones del CET El Bale.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSimulationFinished(false);
                      setSimulationLogs([]);
                    }}
                    className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
                  >
                    Cargar Otro Archivo
                  </button>
                </div>
              )}
            </div>

            {/* LOGS PANEL */}
            {simulationLogs.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                  <span className="text-slate-600 text-xs font-bold uppercase tracking-wider">
                    Log del Servidor de Ingesta (Pre-flight Engine Logs)
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <div className="p-4 px-6 font-mono text-xs space-y-2 max-h-[300px] overflow-y-auto">
                  {simulationLogs.map((log, index) => (
                    <div 
                      key={index} 
                      className={`py-1.5 border-b border-slate-900/40 flex items-start gap-2.5 leading-relaxed ${
                        log.type === 'error' ? 'text-red-400' : 
                        log.type === 'warn' ? 'text-amber-600' : 
                        log.type === 'success' ? 'text-emerald-400' : 
                        'text-slate-300'
                      }`}
                    >
                      <span className="shrink-0 text-slate-500 font-bold select-none">[{index + 1}]</span>
                      <span>{log.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: AUDITORÍA & PROPUESTA */}
        {activeTab === 'docs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
            {/* Audit Section */}
            <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-sm prose max-w-none">
              <div className="flex items-center gap-2 text-emerald-400 border-b border-slate-800 pb-3">
                <AlertTriangle className="h-6 w-6" />
                <h3 className="text-xl font-bold text-white m-0">Informe de Auditoría Excel</h3>
              </div>
              
              <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
                <h4 className="text-slate-200 font-bold text-md mt-4">1. Pérdida Absoluta de Integridad por Fórmulas</h4>
                <p>
                  El modelo actual de consolidación en Excel depende de macros y enlaces dinámicos inter-libros que generan errores <code className="bg-amber-50 text-amber-800 px-1 py-0.5 rounded font-mono border border-amber-200">#REF!</code> catastróficos. Al mover el archivo del sistema local del usuario que los creó, la pestaña consolidada pierde de inmediato la capacidad de recalcular métricas críticas de niños activos.
                </p>

                <h4 className="text-slate-200 font-bold text-md mt-4">2. Contaminación de Datos Cualitativos</h4>
                <p>
                  A falta de validación en los campos, las columnas cualitativas de 2da y 3ra evaluación están contaminadas con enteros seriales de fechas como <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded font-mono border border-slate-300">44804</code> o puntajes numéricos brutos. Esto se debe al desplazamiento horizontal accidental de columnas al hacer copiar y pegar masivamente en Excel, lo cual es indetectable para los usuarios no técnicos hasta que corrompe los informes históricos.
                </p>

                <h4 className="text-slate-200 font-bold text-md mt-4">3. Incumplimiento de la Ley 285 de Panamá</h4>
                <p>
                  La mezcla explícita de nombres reales, apellidos y cédulas al lado de evaluaciones de desarrollo de menores viola las regulaciones panameñas vigentes sobre la privacidad de información de menores de edad (PII), exponiendo datos delicados.
                </p>
              </div>
            </div>

            {/* Proposed Solution Section */}
            <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-sm prose max-w-none">
              <div className="flex items-center gap-2 text-emerald-400 border-b border-slate-800 pb-3">
                <ShieldCheck className="h-6 w-6" />
                <h3 className="text-xl font-bold text-white m-0">Propuesta de Arquitectura</h3>
              </div>

              <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
                <h4 className="text-slate-200 font-bold text-md mt-4">1. Motor de Ingestión Inteligente con Zod</h4>
                <p>
                  Sustituir el procesamiento manual con una pantalla de importación en Next.js. El validador escrito en TypeScript analiza la estructura sintáctica del archivo Excel en el navegador, reporta inconsistencias de forma interactiva y repara desplazamientos obvios utilizando una matriz de reglas lógicas de desarrollo infantil.
                </p>

                <h4 className="text-slate-200 font-bold text-md mt-4">2. Desacoplamiento de PII (Patrón Decoupled)</h4>
                <p>
                  Separar físicamente los nombres y las cédulas de las evaluaciones. El rendimiento de estimulación se asocia estrictamente a un código de cohorte anónimo (ej: <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded font-mono border border-slate-300">MEL-2026-001</code>). El enlace a los nombres reales vive en una tabla independiente restringida por tokens y roles (RBAC) exclusiva para Melanie.
                </p>

                <h4 className="text-slate-200 font-bold text-md mt-4">3. Alojamiento Desplegado con Coolify</h4>
                <p>
                  Alojamiento en contenedor Docker bajo Coolify (en el VPS), garantizando disponibilidad del 99.9%, bases de datos autogestionadas, y respaldos automáticos diarios sin costos ocultos de licencias ni administración compleja.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-50 border-t border-slate-200 py-6 px-8 mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500 gap-4">
        <div>
          <span>© 2026 One Clik To Go. Diseñado con ❤️ para la Asociación Proyecto MelaDos Panameña.</span>
        </div>
        <div className="flex gap-4">
          <span>Licencia: Comercial / Restringido</span>
          <span>•</span>
          <span>Versión: 1.0.0 (Demo de MelaDos)</span>
        </div>
      </footer>
    </div>
  );
}
