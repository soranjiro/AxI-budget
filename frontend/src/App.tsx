import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import Dashboard from '@/app/dashboard/page'
import Transactions from '@/app/transactions/page'
import Budgets from '@/app/budgets/page'
import Settlements from '@/app/settlements/page'
import Groups from '@/app/groups/page'
import Reports from '@/app/reports/page'
import Settings from '@/app/settings/page'
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
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-2">
              AxI-budget
            </h1>
            <p className="text-gray-600 mb-8">
              データベースを初期化中...
            </p>
          </div>
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary-200 animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-2">
                AxI-budget
              </h1>
              <p className="text-gray-600 mb-8">
                認証中...
              </p>
            </div>
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary-600 mx-auto"></div>
              <div className="absolute inset-0 rounded-full border-4 border-primary-200 animate-pulse"></div>
            </div>
          </div>
        </div>
      )
    }

    // 認証が必要な画面
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="card-glass text-center">
            <div className="mb-8">
              <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-6 animate-bounce-in">
                <span className="text-white font-bold text-xl sm:text-2xl">A</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-800 bg-clip-text text-transparent mb-3 animate-fade-in">
                AxI-budget
              </h1>
              <p className="text-gray-600 text-base sm:text-lg animate-slide-up">
                流れを捉える、次世代スマート家計簿
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={signInWithOAuth}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-3 text-sm sm:text-base"
              >
                <span className="text-xl">🔗</span>
                <span>Googleアカウントでログイン</span>
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">または</span>
                </div>
              </div>

              <button
                onClick={signInAsGuest}
                className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center space-x-3 text-sm sm:text-base"
              >
                <span className="text-xl">👤</span>
                <span>ゲストとして体験する</span>
              </button>
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200 animate-float">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl">💡</span>
                <div className="text-left">
                  <p className="text-sm text-orange-700 font-medium">
                    ゲストモードでは全機能をローカルで体験できます
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    データは安全にお使いのデバイスに保存されます
                  </p>
                </div>
              </div>
            </div>
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
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}

export default App
