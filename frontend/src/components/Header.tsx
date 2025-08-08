interface HeaderProps {
  onMenuToggle?: () => void
  isMobileMenuOpen?: boolean
}

export function Header({ onMenuToggle, isMobileMenuOpen }: HeaderProps) {
  return (
    <header className="bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-200/50 fixed top-0 left-0 right-0 z-[60]">
      <div className="px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-800 bg-clip-text text-transparent truncate">
              AxI Budget
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-sm text-gray-600">
              次世代スマート家計簿
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden w-10 h-10 bg-gray-100/80 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-gray-200/80 transition-all duration-200 shadow-sm relative z-[70]"
              aria-label="メニューを開く"
            >
              <div className="w-5 h-5 flex flex-col justify-center items-center space-y-1">
                <span className={`block w-4 h-0.5 bg-gray-600 transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}></span>
                <span className={`block w-4 h-0.5 bg-gray-600 transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}></span>
                <span className={`block w-4 h-0.5 bg-gray-600 transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
