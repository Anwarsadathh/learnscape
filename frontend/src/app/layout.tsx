import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import LayoutWrapper from '../components/layout/LayoutWrapper'

const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins'
})

// ✅ This works - metadata in server component
export const metadata: Metadata = {
  title: 'WhatsNext - Your Educational Journey Starts Here | Top Colleges & Universities',
  description: 'Discover the best colleges and universities for your higher education. Get personalized guidance, scholarships, and career counseling with WhatsNext - India\'s leading educational consultancy.',
  keywords: 'colleges, universities, higher education, career guidance, scholarships, admissions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.className} ${poppins.variable}`}>
      <body className="min-h-screen bg-white">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}
