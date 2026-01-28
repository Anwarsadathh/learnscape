'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface LayoutWrapperProps {
  children: React.ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  
  // Hide header/footer on admin and maintenance pages
  const hideLayoutPages = [
    '/admin/login',
    '/admin/dashboard', 
    '/admin/colleges',
    '/admin/contacts',
    '/admin/reports',
    '/admin/settings',
    '/admin/enquiries',
    '/admin/scholarships', // ✅ Add this line
    '/maintenance', // ✅ Add this line
  ]
  
  const shouldHideLayout = hideLayoutPages.some(page => pathname.startsWith(page))

  return (
    <>
      {!shouldHideLayout && <Header />}
      <main>{children}</main>
      {!shouldHideLayout && <Footer />}
    </>
  )
}
