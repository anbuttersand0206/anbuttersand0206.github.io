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

const siteUrl = 'https://anbuttersand0206.github.io'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Hama Portfolio | フルスタックエンジニア',
    template: '%s | Hama Portfolio',
  },
  description:
    '非IT職からエンジニアへ転身した日本人フルスタックエンジニア Hama のポートフォリオ。React / Next.js・TypeScript・AWS・Docker を活用し、フロントエンドからインフラまで一気通貫で開発します。転職活動中。',
  keywords: [
    'フルスタックエンジニア',
    'ポートフォリオ',
    'エンジニア転職',
    '日本人エンジニア',
    'React',
    'Next.js',
    'TypeScript',
    'Vue',
    'Nuxt',
    'Python',
    'FastAPI',
    'PHP',
    'Laravel',
    'Java',
    'Spring Boot',
    'AWS',
    'Docker',
    'Linux',
    'IoT',
    'PoC開発',
    'Full-Stack Developer',
    'Portfolio',
  ],
  authors: [{ name: 'Hama', url: siteUrl }],
  creator: 'Hama',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: siteUrl,
    siteName: 'Hama Portfolio',
    title: 'Hama Portfolio | フルスタックエンジニア',
    description:
      '非IT職からエンジニアへ転身した日本人フルスタックエンジニア Hama のポートフォリオ。フロントエンドからインフラまで一気通貫で開発します。',
    images: [
      {
        url: '/apple-icon.png',
        width: 180,
        height: 180,
        alt: 'Hama Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Hama Portfolio | フルスタックエンジニア',
    description:
      '非IT職からエンジニアへ転身した日本人フルスタックエンジニア Hama のポートフォリオ。React / Next.js・TypeScript・AWS・Docker でフロントからインフラまで対応。',
    images: ['/apple-icon.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8e8f0' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1525' },
  ],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Hama',
  url: siteUrl,
  sameAs: ['https://github.com/anbuttersand0206'],
  jobTitle: 'Full-Stack Developer',
  description:
    '非IT職からエンジニアへ転身した日本人フルスタックエンジニア。フロントエンドからインフラまで一気通貫で担当。',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Saitama',
    addressCountry: 'JP',
  },
  knowsAbout: [
    'React',
    'Next.js',
    'TypeScript',
    'Vue',
    'Nuxt',
    'Python',
    'FastAPI',
    'PHP',
    'Laravel',
    'Java',
    'Spring Boot',
    'AWS',
    'Docker',
    'Linux',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={`${dotGothic16.variable} ${outfit.variable} ${orbitron.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-background">
        {children}
      </body>
    </html>
  )
}
