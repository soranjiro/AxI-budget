export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AxI</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-900">
              AxI-budget
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-sm text-gray-600">
              次世代スマート家計簿
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
