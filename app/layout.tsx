import type { Metadata, Viewport } from 'next'
import { DotGothic16, Outfit, Orbitron } from 'next/font/google'
import './globals.css'

const dotGothic16 = DotGothic16({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-dotgothic',
  preload: false,
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-outfit',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-orbitron',
})

export const metadata: Metadata = {
  title: 'Hama Portfolio | Full-Stack Developer',
  description: 'フロントエンドからインフラまで対応するフルスタックエンジニア Hama のポートフォリオサイト',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8e8f0' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1525' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={`${dotGothic16.variable} ${outfit.variable} ${orbitron.variable}`}>
      <body className="font-sans antialiased bg-background">
        {children}
      </body>
    </html>
  )
}
