interface AdvanceAnalysisProps {
  totalAdvance: number
  monthlyAdvances: Array<{ month: string; amount: number }>
  count: number
}

export function AdvanceAnalysis({ totalAdvance, monthlyAdvances, count }: AdvanceAnalysisProps) {
  const formatCurrency = (amount: number) => `¥${amount.toLocaleString()}`

  if (count === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">立て替え分析</h3>
        <div className="text-center py-8 text-gray-500">
          <p>立て替え履歴がありません</p>
          <p className="text-sm mt-1">立て替えた支出があるとここに表示されます</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">立て替え分析</h3>

      {/* サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalAdvance)}</p>
          <p className="text-sm text-orange-700">総立て替え額</p>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{count}</p>
          <p className="text-sm text-blue-700">立て替え回数</p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalAdvance / count)}</p>
          <p className="text-sm text-green-700">平均立て替え額</p>
        </div>
      </div>

      {/* 月次履歴 */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">月次立て替え履歴</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {monthlyAdvances.map(({ month, amount }) => (
            <div key={month} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">{month}</span>
              <span className="text-sm font-semibold text-orange-600">{formatCurrency(amount)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          💡 立て替えた金額は精算管理で管理できます
        </p>
      </div>
    </div>
  )
}
