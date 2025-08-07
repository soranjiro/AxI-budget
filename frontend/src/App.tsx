import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import Dashboard from '@/app/dashboard/page'
import Transactions from '@/app/transactions/page'
import Budgets from '@/app/budgets/page'
import Settlements from '@/app/settlements/page'
import Groups from '@/app/groups/page'
import Reports from '@/app/reports/page'
import { useAuthStore } from '@/stores/auth'
import { useInitializeStores, useStoresStatus } from '@/hooks/useStores'
import { useEffect } from 'react'

// Import IndexedDB utils for development debugging
if (process.env.NODE_ENV === 'development') {
  import('@/utils/indexedDBUtils')
}

function App() {
  const { initializeAuth, isAuthenticated, isLoading, signInWithOAuth, signInAsGuest } = useAuthStore()

  // Initialize IndexedDB stores
  useInitializeStores()
  const { isLoading: storesLoading, isInitialized: storesInitialized } = useStoresStatus()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  // Show loading screen while stores are initializing
  if (storesLoading || !storesInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            AxI-budget
          </h1>
          <p className="text-gray-600 mb-8">
            データベースを初期化中...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              AxI-budget
            </h1>
            <p className="text-gray-600 mb-8">
              認証中...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        </div>
      )
    }

    // 認証が必要な画面
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white shadow-lg rounded-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AxI-budget
            </h1>
            <p className="text-gray-600 mb-8">
              家計簿・グループ精算アプリ
            </p>

            <div className="space-y-4">
              <button
                onClick={signInWithOAuth}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                🔗 Googleアカウントでログイン
              </button>

              <div className="text-gray-500 text-sm">または</div>

              <button
                onClick={signInAsGuest}
                className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                👤 ゲストとして体験する
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              ゲストモードでは一部機能が制限されます
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/settlements" element={<Settlements />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Layout>
  )
}

export default App
