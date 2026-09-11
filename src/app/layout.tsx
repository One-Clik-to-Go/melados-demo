import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  metadataBase: new URL('https://proninezpanama.org'),
  title: 'Proyecto MelaDos — Estudio Longitudinal de Impacto',
  description: 'Plataforma del Estudio Longitudinal de Impacto del programa de Estimulación Temprana de la Asociación Proyecto MelaDos Panameña, financiado por Fundación Banco General e implementado por One Clik To Go.',
  keywords: [
    'estimulación temprana panamá',
    'pro niñez panamá',
    'estudio longitudinal',
    'impacto social panamá',
    'fundación banco general',
    'one clik to go',
    'educación primaria panamá',
    'EGRA',
    'EGMA',
    'bienestar infantil'
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Proyecto MelaDos — Estudio Longitudinal de Impacto',
    description: 'Plataforma del Estudio Longitudinal de Impacto del programa de Estimulación Temprana de la Asociación Proyecto MelaDos Panameña, financiado por Fundación Banco General e implementado por One Clik To Go.',
    url: 'https://proninezpanama.org',
    siteName: 'Asociación Proyecto MelaDos Panameña',
    locale: 'es_PA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Proyecto MelaDos — Estudio Longitudinal de Impacto',
    description: 'Evaluación y seguimiento de impacto en la lectoescritura, matemáticas y bienestar socioemocional en comunidades de difícil acceso.',
  },
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#65bec2',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="bg-[#f8f9fb] text-gray-900 min-h-screen antialiased selection:bg-proninez-teal/30">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
