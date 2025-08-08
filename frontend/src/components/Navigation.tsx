import { NavLink } from 'react-router-dom'

const navigationItems = [
  {
    name: 'ダッシュボード',
    href: '/',
    icon: '📊',
  },
  {
    name: '取引',
    href: '/transactions',
    icon: '💰',
  },
  {
    name: '予算',
    href: '/budgets',
    icon: '📋',
  },
  {
    name: '精算',
    href: '/settlements',
    icon: '🔄',
  },
  {
    name: 'グループ',
    href: '/groups',
    icon: '👥',
  },
  {
    name: 'レポート',
    href: '/reports',
    icon: '📈',
  },
  {
    name: '設定',
    href: '/settings',
    icon: '⚙️',
  },
]

export function Navigation() {
  return (
    <nav className="bg-white shadow-sm border-r border-gray-200 fixed left-0 top-16 bottom-0 w-64 z-40 hidden md:block">
      <div className="p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-primary-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
