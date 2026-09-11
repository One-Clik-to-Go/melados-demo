'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  customItems?: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ customItems }) => {
  const pathname = usePathname();

  const getDefaultItems = (): BreadcrumbItem[] => {
    if (pathname === '/evaluar') {
      return [
        { label: 'Inicio', href: '/' },
        { label: 'Evaluación de Campo (EGRA / EGMA)' },
      ];
    }
    if (pathname === '/login') {
      return [
        { label: 'Inicio', href: '/' },
        { label: 'Acceso al Sistema' },
      ];
    }
    return [
      { label: 'Inicio', href: '/' },
      { label: 'Panel Principal de Impacto' },
    ];
  };

  const items = customItems || getDefaultItems();

  return (
    <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1.5" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-proninez-teal flex items-center gap-1 transition-colors font-medium"
              >
                {index === 0 && <Home className="w-3.5 h-3.5 text-proninez-teal" />}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className={`font-semibold ${isLast ? 'text-gray-800' : 'text-gray-500'} flex items-center gap-1`}>
                {index === 0 && <Home className="w-3.5 h-3.5 text-proninez-teal" />}
                <span>{item.label}</span>
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
