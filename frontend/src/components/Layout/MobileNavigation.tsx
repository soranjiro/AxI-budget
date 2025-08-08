import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const navigation = [
  { name: 'ダッシュボード', href: '/', icon: '📊', gradient: 'from-blue-500 to-purple-600' },
  { name: '取引管理', href: '/transactions', icon: '💰', gradient: 'from-green-500 to-emerald-600' },
  { name: '予算管理', href: '/budgets', icon: '📈', gradient: 'from-orange-500 to-red-600' },
  { name: 'レポート', href: '/reports', icon: '📋', gradient: 'from-purple-500 to-pink-600' },
  { name: 'グループ', href: '/groups', icon: '👥', gradient: 'from-indigo-500 to-blue-600' },
  { name: '精算管理', href: '/settlements', icon: '💸', gradient: 'from-teal-500 to-cyan-600' },
]

interface MobileNavigationProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const location = useLocation()

  // Close menu when route changes
  useEffect(() => {
    if (isOpen) {
      onClose()
    }
  }, [location.pathname, onClose, isOpen])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[65]"
        onClick={onClose}
      />

      {/* Mobile Navigation Panel */}
      <nav className={`fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white/95 backdrop-blur-xl shadow-2xl z-[70] lg:hidden transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-800 bg-clip-text text-transparent">
                AxI Budget
              </h1>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <span className="text-gray-600 text-xl">✕</span>
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto p-6">
            <ul className="space-y-3">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`
                        group relative flex items-center px-4 py-4 rounded-2xl text-base font-semibold transition-all duration-300
                        ${
                          isActive
                            ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-${item.gradient.split('-')[1]}-500/25`
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }
                      `}
                    >
                      <span className={`mr-4 text-2xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {item.icon}
                      </span>
                      <span className="relative">
                        {item.name}
                        {isActive && (
                          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-white/30 rounded-full"></div>
                        )}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200/50">
            <div className="text-center text-sm text-gray-500">
              <p className="font-medium">AxI Budget</p>
              <p>次世代スマート家計簿</p>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
