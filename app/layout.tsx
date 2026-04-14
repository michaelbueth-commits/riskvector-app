import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import PWAProvider from './components/PWAProvider'
import OfflineBanner from './components/OfflineBanner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RiskVector — Wie sicher ist dein Reiseziel?',
  description: 'Prüfe sofort das Sicherheitsrisiko von 195 Ländern. Sicherheitsampel, Reise-Checklisten, Echtzeit-Alerts. Kostenlos testen.',
  keywords: 'Reisesicherheit, Risiko-Check, Reisewarnung, Länderbewertung, Sicherheitsampel, Travel Safety',
  manifest: '/manifest.json',
  themeColor: '#6366f1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={"https://www.googletagmanager.com/gtag/js?id=" + process.env.NEXT_PUBLIC_GA_ID} />
            <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');` }} />
          </>
        )}
      </head>
      <body className={`${inter.className} bg-[#030714] text-slate-100 antialiased`} suppressHydrationWarning>
        <OfflineBanner />
        {children}
        <PWAProvider />
      </body>
    </html>
  )
}
