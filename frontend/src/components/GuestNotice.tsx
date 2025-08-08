import { useAuthStore } from '@/stores/auth'

interface GuestNoticeProps {
  feature?: string
}

export function GuestNotice({ feature }: GuestNoticeProps) {
  const { user, signInWithOAuth } = useAuthStore()

  if (!user?.isGuest) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl p-6 mb-6 shadow-lg">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white text-lg">💡</span>
          </div>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-orange-800 font-semibold">
            {feature ? (
              <>この機能（{feature}）はログインユーザーのみ利用できます。</>
            ) : (
              <>ゲストモードで体験中です。すべての機能をローカルで利用できます。</>
            )}
          </p>
          <p className="text-orange-600 text-sm mt-1">
            ログインするとクラウド同期機能も利用できるようになります。
          </p>
        </div>
        <div className="ml-4">
          <button
            onClick={signInWithOAuth}
            className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
          >
            ログイン
          </button>
        </div>
      </div>
    </div>
  )
}
