import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nítido — Gestión de Negocios',
    short_name: 'Nítido',
    description: 'Plataforma integral para la gestión de servicios, finanzas e inventario de emprendimientos Nítido.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FDFDFD',
    theme_color: '#0F172A',
    orientation: 'portrait',
    categories: ['business', 'finance', 'productivity'],
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
