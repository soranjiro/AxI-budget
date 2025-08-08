import { Link, useLocation } from 'react-router-dom'

const tabNavigation = [
  { name: 'ホーム', href: '/', icon: '🏠', shortName: 'ホーム' },
  { name: '取引', href: '/transactions', icon: '💰', shortName: '取引' },
  { name: '予算', href: '/budgets', icon: '📈', shortName: '予算' },
  { name: 'レポート', href: '/reports', icon: '📊', shortName: 'レポート' },
]

interface MobileTabNavigationProps {
  onMenuToggle?: () => void
}

export function MobileTabNavigation({ onMenuToggle }: MobileTabNavigationProps) {
  const location = useLocation()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-lg z-40">
      <div className="grid grid-cols-5 h-16">
        {tabNavigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                isActive
                  ? 'text-blue-600 transform scale-105'
                  : 'text-gray-500 hover:text-gray-700 active:scale-95'
              }`}
            >
              <span className={`text-lg transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                {item.icon}
              </span>
              <span className={`text-xs font-medium transition-all duration-200 ${
                isActive ? 'text-blue-600 font-semibold' : 'text-gray-500'
              }`}>
                {item.shortName}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-b-full"></div>
              )}
            </Link>
          )
        })}

        {/* メニューボタン */}
        <button
          onClick={onMenuToggle}
          className="flex flex-col items-center justify-center space-y-1 transition-all duration-200 text-gray-500 hover:text-gray-700 active:scale-95"
        >
          <span className="text-lg">☰</span>
          <span className="text-xs font-medium">メニュー</span>
        </button>
      </div>
    </nav>
  )
}
