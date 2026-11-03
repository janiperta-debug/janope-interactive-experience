import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'The Manor — Unwritten',
    short_name: 'The Manor',
    description: 'Enter a living archive of the almost-known.',
    start_url: '/',
    display: 'standalone',
    background_color: '#090b0b',
    theme_color: '#0b0d0d',
    orientation: 'landscape',
    icons: [
      {
        src: '/apple-icon.png',
        sizes: '1440x1200',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  }
}
