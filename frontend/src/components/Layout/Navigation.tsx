import { Link, useLocation } from 'react-router-dom'

const navigation = [
  { name: 'ダッシュボード', href: '/', icon: '📊', gradient: 'from-blue-500 to-purple-600' },
  { name: '取引管理', href: '/transactions', icon: '💰', gradient: 'from-green-500 to-emerald-600' },
  { name: '予算管理', href: '/budgets', icon: '📈', gradient: 'from-orange-500 to-red-600' },
  { name: 'レポート', href: '/reports', icon: '📋', gradient: 'from-purple-500 to-pink-600' },
  { name: 'グループ', href: '/groups', icon: '👥', gradient: 'from-indigo-500 to-blue-600' },
  { name: '精算管理', href: '/settlements', icon: '💸', gradient: 'from-teal-500 to-cyan-600' },
]

export function Navigation() {
  const location = useLocation()

  return (
    <nav className="hidden lg:block glass-bg shadow-xl border-r border-white/30 fixed left-0 top-16 bottom-0 w-64 overflow-y-auto backdrop-blur-xl">
      <div className="p-6">
        <ul className="space-y-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`
                    group relative flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105
                    ${
                      isActive
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-${item.gradient.split('-')[1]}-500/25`
                        : 'text-gray-700 hover:bg-white/50 hover:text-gray-900 hover:shadow-md'
                    }
                  `}
                >
                  <span className={`mr-3 text-lg transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </span>
                  <span className="relative">
                    {item.name}
                    {isActive && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white/30 rounded-full"></div>
                    )}
                  </span>
                  {isActive && (
                    <div className="absolute -right-1 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-8 bg-white/30 rounded-l-full"></div>
                    </div>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
