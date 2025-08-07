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
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="text-orange-600">ℹ️</span>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-orange-700">
            {feature ? (
              <>この機能（{feature}）はログインユーザーのみ利用できます。</>
            ) : (
              <>ゲストモードでは一部機能が制限されています。</>
            )}
          </p>
        </div>
        <div className="ml-3">
          <button
            onClick={signInWithOAuth}
            className="text-sm bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 transition-colors"
          >
            ログイン
          </button>
        </div>
      </div>
    </div>
  )
}
