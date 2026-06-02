import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { inter, playfair, jetbrainsMono } from '@/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cérebro Amigo — Acompanhamento entre consultas para psiquiatria',
  description: 'Acompanhamento entre consultas para psiquiatria: o paciente registra humor, sintomas e áudios no diário; antes do retorno, a IA entrega o briefing pronto.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
    ],
    shortcut: '/favicon-32.png',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable}`}>
      <head>
      </head>
      <body className={`${inter.className} bg-background antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(r => console.log('SW registered:', r.scope))
                    .catch(e => console.error('SW registration failed:', e));
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
