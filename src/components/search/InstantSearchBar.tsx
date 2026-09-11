'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, School, Users, FileText, RefreshCw, X, Sparkles } from 'lucide-react';

interface SearchResults {
  escuelas: any[];
  estudiantes: any[];
  evaluaciones: any[];
}

export const InstantSearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResults>({ escuelas: [], estudiantes: [], evaluaciones: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ escuelas: [], estudiantes: [], evaluaciones: [] });
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.results) {
          setResults(data.results);
          setIsOpen(true);
        }
      } catch {
        // Ignore
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleManualSync = async () => {
    setSyncing(true);
    try {
      await fetch('/api/search/sync', { method: 'POST' });
    } catch {
      // Ignore
    } finally {
      setSyncing(false);
    }
  };

  const totalHits = results.escuelas.length + results.estudiantes.length + results.evaluaciones.length;

  return (
    <div className="relative w-full max-w-xl mx-auto" ref={dropdownRef}>
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-proninez-teal absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar en tiempo real por escuelas, estudiantes, evaluaciones..."
          className="w-full bg-white border border-gray-300 rounded-2xl pl-10 pr-20 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-proninez-teal focus:ring-2 focus:ring-proninez-teal/20 shadow-sm transition-all"
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          {query && (
            <button
              onClick={() => { setQuery(''); setIsOpen(false); }}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleManualSync}
            disabled={syncing}
            className="text-proninez-teal hover:bg-proninez-teal/10 p-1 rounded-lg transition-all"
            title="Actualizar índice de búsqueda"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Results Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-12 bg-white rounded-3xl border border-gray-200 shadow-2xl z-50 max-h-96 overflow-y-auto p-4 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2 text-[11px] font-bold text-gray-400 uppercase">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-proninez-teal" />
              <span>Resultados de Búsqueda ({totalHits})</span>
            </span>
            <span className="text-proninez-teal font-medium">Búsqueda en Tiempo Real</span>
          </div>

          {totalHits === 0 && !loading && (
            <div className="text-center py-6 text-xs text-gray-500 font-medium">
              No se encontraron coincidencias para &quot;{query}&quot;.
            </div>
          )}

          {/* Escuelas */}
          {results.escuelas.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-proninez-teal" />
                <span>Escuelas e Instituciones ({results.escuelas.length})</span>
              </div>
              <div className="space-y-1">
                {results.escuelas.map((s, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-gray-50 hover:bg-proninez-teal/10 text-xs transition-colors flex items-center justify-between">
                    <span className="font-bold text-gray-900">{s.nombre_escuela}</span>
                    <span className="text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded-md border border-gray-200 font-medium">{s.sede_region}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Estudiantes */}
          {results.estudiantes.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-proninez-green" />
                <span>Estudiantes de Cohorte ({results.estudiantes.length})</span>
              </div>
              <div className="space-y-1">
                {results.estudiantes.map((st, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-gray-50 hover:bg-proninez-green/10 text-xs transition-colors flex items-center justify-between">
                    <span className="font-mono font-bold text-gray-900">{st.codigo_anonimo}</span>
                    <span className="text-[10px] text-proninez-green bg-green-50 px-2 py-0.5 rounded-md border border-green-200 font-bold">{st.tipo_grupo}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evaluaciones */}
          {results.evaluaciones.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-proninez-pink" />
                <span>Pruebas EGRA / EGMA ({results.evaluaciones.length})</span>
              </div>
              <div className="space-y-1">
                {results.evaluaciones.map((ev, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-gray-50 hover:bg-proninez-pink/10 text-xs transition-colors flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900">{ev.instrumento}</span>
                      <span className="text-gray-500 ml-2 font-mono">({ev.codigo_anonimo})</span>
                    </div>
                    <span className="font-mono font-black text-proninez-teal text-xs">{ev.score_total}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
