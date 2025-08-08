import { ReactNode, useState } from 'react'
import { Navigation } from './Navigation'
import { Header } from './Header'
import { MobileNavigation } from './Layout/MobileNavigation'
import { MobileTabNavigation } from './Layout/MobileTabNavigation'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleMenuClose = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Header onMenuToggle={handleMenuToggle} isMobileMenuOpen={isMobileMenuOpen} />

      {/* Mobile Navigation */}
      <MobileNavigation isOpen={isMobileMenuOpen} onClose={handleMenuClose} />

      <div className="flex">
        <Navigation />
        <main className="flex-1 px-4 py-6 pt-20 ml-0 lg:ml-64 pb-24 lg:pb-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileTabNavigation onMenuToggle={handleMenuToggle} />
    </div>
  )
}
