'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/database';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { APP_VERSION_TAG } from '@/lib/version';
import { ShieldCheck, UserCheck, LineChart, Wifi, WifiOff, LogOut, LogIn, ExternalLink, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({ currentRole, onRoleChange, isOnline }) => {
  const { user, isSuperAdmin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 lg:px-8 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col gap-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand & Project Identity */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-proninez-teal to-proninez-green flex items-center justify-center font-bold text-white shadow-md">
                PNP
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-gray-900 tracking-tight">Proyecto MelaDos</h1>
                  <span className="bg-proninez-teal/10 text-proninez-teal text-xs px-2 py-0.5 rounded-full font-bold border border-proninez-teal/20">
                    Estudio Longitudinal {APP_VERSION_TAG}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Programa CET • Fundación Banco General • One Clik To Go
                </p>
              </div>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Quick link to Mobile Field Portal */}
            <Link
              href="/evaluar"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-proninez-teal/10 text-proninez-teal border border-proninez-teal/20 hover:bg-proninez-teal hover:text-white transition-all shadow-sm"
            >
              <span>Portal Móvil Evaluaciones</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Connection Status */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              isOnline
                ? 'bg-green-50 text-proninez-green border-green-200'
                : 'bg-pink-50 text-proninez-pink border-pink-200'
            }`}>
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 animate-pulse" />
                  <span>ONLINE</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>MODO CAMPO (OFFLINE)</span>
                </>
              )}
            </div>

            {/* Role Switcher */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-medium">
              <span className="text-gray-400 px-2 font-mono text-[10px] uppercase">Simular Rol:</span>

              <button
                onClick={() => onRoleChange('ADMIN')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  currentRole === 'ADMIN'
                    ? 'bg-proninez-pink text-white font-bold shadow-md'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-white'
                }`}
                title="Rol Administrador"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ADMIN</span>
              </button>

              <button
                onClick={() => onRoleChange('EVALUADOR')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  currentRole === 'EVALUADOR'
                    ? 'bg-proninez-green text-white font-bold shadow-md'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-white'
                }`}
                title="Rol Evaluador"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>EVALUADOR</span>
              </button>

              <button
                onClick={() => onRoleChange('VIEWER')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  currentRole === 'VIEWER'
                    ? 'bg-proninez-teal text-white font-bold shadow-md'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-white'
                }`}
                title="Rol Consulta de Impacto / Auditor"
              >
                <LineChart className="w-3.5 h-3.5" />
                <span>REPORTE / AUDITOR</span>
              </button>
            </div>

            {/* User Session & Login/Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              {user || isSuperAdmin ? (
                <div className="flex items-center gap-2">
                  <div className="text-right text-[11px] hidden sm:block">
                    <div className="font-bold text-gray-900 flex items-center gap-1">
                      {isSuperAdmin && <Sparkles className="w-3 h-3 text-proninez-green inline" />}
                      <span>{user?.email || 'Administrador Principal'}</span>
                    </div>
                    <div className="text-gray-400">Sesión Activa</div>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 transition-all"
                    title="Cerrar Sesión"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-proninez-green text-white shadow-sm hover:bg-proninez-green/90 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Ingresar</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Breadcrumbs Navigation Bar */}
        <div className="border-t border-gray-100 pt-1 flex items-center justify-between">
          <Breadcrumbs />
        </div>
      </div>
    </header>
  );
};
