export function Settlements() {
  return (
    <div className="space-y-6 pt-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">精算管理</h1>
      </div>

      <div className="card">
        <div className="text-center py-8 text-gray-500">
          <p>精算がありません</p>
          <p className="text-sm mt-1">立て替えがある場合はここに表示されます</p>
        </div>
      </div>
    </div>
  )
}
