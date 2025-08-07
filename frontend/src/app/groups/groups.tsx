export function Groups() {
  return (
    <div className="space-y-6 pt-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">グループ管理</h1>
        <div className="flex gap-2">
          <button className="btn-secondary">
            🔗 グループに参加
          </button>
          <button className="btn-primary">
            ➕ グループ作成
          </button>
        </div>
      </div>

      <div className="card">
        <div className="text-center py-8 text-gray-500">
          <p>参加しているグループがありません</p>
          <p className="text-sm mt-1">グループを作成するか、参加コードで参加しましょう</p>
        </div>
      </div>
    </div>
  )
}
