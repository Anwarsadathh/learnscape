'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ChatWidget from '@/components/chat/ChatWidget'

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
  '/admin/scholarships',
  '/maintenance',
]

const shouldHideLayout = hideLayoutPages.some(page => pathname.startsWith(page))
  
  // Hide chat widget on admin pages and maintenance
  const hideChatWidget = pathname?.startsWith('/admin') || pathname === '/maintenance'

  return (
    <>
      {!shouldHideLayout && <Header />}
      <main>{children}</main>
      {!shouldHideLayout && <Footer />}
      {!hideChatWidget && <ChatWidget />}
    </>
  )
}
