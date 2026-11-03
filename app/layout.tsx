import type { Metadata, Viewport } from 'next'
import { OrientationGuard } from '@/components/orientation-guard'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Manor — Unwritten',
  description: 'Enter a living archive of the almost-known.',
  generator: 'Janope',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/apple-icon.png',
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0b0d0d',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<OrientationGuard /></body></html>
}
