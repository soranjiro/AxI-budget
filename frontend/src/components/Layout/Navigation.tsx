import { Link, useLocation } from 'react-router-dom'

const navigation = [
  { name: 'ダッシュボード', href: '/', icon: '📊' },
  { name: '取引管理', href: '/transactions', icon: '💰' },
  { name: '予算管理', href: '/budgets', icon: '📈' },
  { name: 'レポート', href: '/reports', icon: '📋' },
  { name: 'グループ', href: '/groups', icon: '👥' },
  { name: '精算管理', href: '/settlements', icon: '💸' },
]

export function Navigation() {
  const location = useLocation()

  return (
    <nav className="bg-white shadow-sm border-r border-gray-200 fixed left-0 top-16 bottom-0 w-64 overflow-y-auto">
      <div className="p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`
                    flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
