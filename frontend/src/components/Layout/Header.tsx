import { useAuthStore } from '@/stores/auth'

interface HeaderProps {
  onMobileMenuClick: () => void
  isMobileMenuOpen: boolean
}

export function Header({ onMobileMenuClick, isMobileMenuOpen }: HeaderProps) {
  const { user, signOut, signInWithOAuth } = useAuthStore()

  const handleSignOut = () => {
    signOut()
  }

  const handleSignIn = () => {
    signInWithOAuth()
  }

  const handleMobileMenuClick = () => {
    onMobileMenuClick()
  }

  return (
    <header className="glass-bg shadow-lg border-b border-white/30 fixed top-0 left-0 right-0 z-40 backdrop-blur-xl">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Mobile menu + Logo */}
          <div className="flex items-center space-x-3">
            {/* Mobile hamburger menu */}
            <button
              onClick={handleMobileMenuClick}
              className={`lg:hidden w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg active:scale-95 ${
                isMobileMenuOpen
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-white/90 backdrop-blur-sm hover:bg-white border border-gray-200'
              }`}
              aria-label={isMobileMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
            >
              <div className="w-6 h-5 flex flex-col justify-center">
                <span className={`block h-0.5 w-6 rounded-full transition-all duration-300 ${
                  isMobileMenuOpen
                    ? 'rotate-45 translate-y-1.5 bg-white'
                    : 'bg-gray-700'
                }`}></span>
                <span className={`block h-0.5 w-6 rounded-full transition-all duration-300 mt-1 ${
                  isMobileMenuOpen
                    ? 'opacity-0 bg-white'
                    : 'bg-gray-700'
                }`}></span>
                <span className={`block h-0.5 w-6 rounded-full transition-all duration-300 mt-1 ${
                  isMobileMenuOpen
                    ? '-rotate-45 -translate-y-1.5 bg-white'
                    : 'bg-gray-700'
                }`}></span>
              </div>
            </button>

            {/* Logo - Hidden on small screens when menu is open */}
            <div className={`flex items-center space-x-3 transition-all duration-300 ${isMobileMenuOpen ? 'lg:flex' : 'flex'}`}>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div>
                <h1 className="hidden sm:block text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-800 bg-clip-text text-transparent">
                  AxI Budget
                </h1>
                {/* モバイル用のサブタイトル */}
                <p className="lg:hidden text-xs text-gray-500 mt-0.5">
                  {isMobileMenuOpen ? 'メニューが開いています' : 'メニューはここ →'}
                </p>
              </div>
            </div>
          </div>

          {/* Right side - User info */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user && (
              <div className="flex items-center space-x-2 sm:space-x-3">
                {user.isGuest && (
                  <span className="text-xs bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 px-2 sm:px-3 py-1 rounded-full font-medium shadow-sm">
                    ゲスト
                  </span>
                )}
                <span className="hidden sm:block text-sm text-gray-700 font-medium truncate max-w-24 lg:max-w-none">
                  {user.username || user.userId}
                </span>
                {user.isGuest ? (
                  <button
                    onClick={handleSignIn}
                    className="text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-purple-700 text-white px-3 sm:px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
                  >
                    <span className="hidden sm:inline">ログイン</span>
                    <span className="sm:hidden">🔑</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSignOut}
                    className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 px-2 sm:px-3 py-1 rounded-lg hover:bg-white/50 transition-all duration-200"
                  >
                    <span className="hidden sm:inline">ログアウト</span>
                    <span className="sm:hidden">🚪</span>
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
