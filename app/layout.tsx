import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageAnimate from '@/components/common/PageAnimate'

export const metadata: Metadata = {
  title: 'MiCompli — ¿A quién vamos a sorprender hoy?',
  description: 'Plataforma de experiencias emocionales personalizadas. Conectamos personas con cómplices para crear momentos inolvidables.',
  openGraph: {
    title: 'MiCompli',
    description: '¿A quién vamos a sorprender hoy?',
    type: 'website',
  },
  icons: {
    icon: '/images/micompliLOGO.jpeg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main>
          <PageAnimate>
            {children}
          </PageAnimate>
        </main>
        <Footer />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
