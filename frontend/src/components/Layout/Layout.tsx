import { ReactNode, useState } from 'react'
import { Header } from './Header'
import { Navigation } from './Navigation'
import { MobileNavigation } from './MobileNavigation'
import { MobileTabNavigation } from './MobileTabNavigation'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Desktop Header */}
      <Header
        onMobileMenuClick={handleMobileMenuToggle}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Desktop Navigation */}
      <Navigation />

      {/* Mobile Navigation */}
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      />

      {/* Main Content */}
      <main className="lg:ml-64 transition-all duration-300">
        {/* Mobile-first padding with responsive adjustments */}
        <div className="px-4 sm:px-6 lg:px-8 pt-20 pb-20 lg:pb-8">
          {children}
        </div>
      </main>

      {/* Mobile Tab Navigation */}
      <MobileTabNavigation onMenuClick={handleMobileMenuToggle} />
    </div>
  )
}
