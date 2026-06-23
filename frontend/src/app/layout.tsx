import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import LayoutWrapper from '../components/layout/LayoutWrapper'

const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'LearnScape - Discover Top Colleges & Universities | Higher Education Platform',
  description:
    'Find the perfect college for your future with LearnScape. Explore 500+ top colleges and universities across India. Get expert guidance, scholarships, and admission support for engineering, medical, MBA, and more.',
  keywords: [
    'colleges India',
    'universities',
    'higher education',
    'college admissions',
    'engineering colleges',
    'medical colleges',
    'MBA colleges',
    'scholarships',
    'career guidance',
    'education consultancy',
    'LearnScape',
    'college search',
    'university rankings',
    'admission guidance',
  ],
  authors: [{ name: 'LearnScape Team' }],
  creator: 'LearnScape',
  publisher: 'LearnScape Education Platform',
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
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://learnscapeedu.com',
    title: 'LearnScape - Find Your Perfect College | Top Universities in India',
    description:
      'Discover 500+ top colleges and universities across India. Get expert guidance for engineering, medical, MBA admissions and scholarships.',
    siteName: 'LearnScape',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LearnScape - Top Colleges and Universities Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LearnScape - Find Your Perfect College',
    description:
      'Discover top colleges and universities across India with expert guidance and scholarship support.',
    images: ['/twitter-image.jpg'],
    creator: '@learnscapeedu',
  },
  alternates: {
    canonical: 'https://learnscapeedu.com',
  },
  category: 'education',
  classification: 'Education Technology Platform',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://learnscapeedu.com'),
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.className} ${poppins.variable}`}
    >
      <body className="min-h-screen bg-white">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}