import React, { useState } from 'react'
import AccountsList from '../../components/AccountsList'
import CategoriesList from '../../components/CategoriesList'

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'categories'>('accounts')

  const tabs = [
    { id: 'accounts' as const, label: '口座管理', icon: '🏦' },
    { id: 'categories' as const, label: 'カテゴリ管理', icon: '📝' },
  ]

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">設定</h1>
        <p className="text-gray-600">口座やカテゴリを管理できます</p>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* タブコンテンツ */}
      <div className="tab-content">
        {activeTab === 'accounts' && <AccountsList />}
        {activeTab === 'categories' && <CategoriesList />}
      </div>
    </div>
  )
}

export default Settings
