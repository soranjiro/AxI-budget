import { useAuthStore } from '@/stores/auth'

export function Header() {
  const { user, signOut, signInWithOAuth } = useAuthStore()

  const handleSignOut = () => {
    signOut()
  }

  const handleSignIn = () => {
    signInWithOAuth()
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              AxI Budget
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-2">
                {user.isGuest && (
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                    ゲスト
                  </span>
                )}
                <span className="text-sm text-gray-700">
                  {user.username || user.userId}
                </span>
                {user.isGuest ? (
                  <button
                    onClick={handleSignIn}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    ログイン
                  </button>
                ) : (
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    ログアウト
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
