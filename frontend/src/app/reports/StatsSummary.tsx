interface StatsSummaryProps {
  thisMonthTotal: number
  lastMonthTotal: number
  changePercentage: number
  avgDailyExpense: number
  totalBudget: number
  budgetUsagePercentage: number
}

export function StatsSummary({
  thisMonthTotal,
  lastMonthTotal,
  changePercentage,
  avgDailyExpense,
  totalBudget,
  budgetUsagePercentage,
}: StatsSummaryProps) {
  const formatCurrency = (amount: number) => `¥${amount.toLocaleString()}`

  const getChangeColor = (percentage: number) => {
    if (percentage > 0) return 'text-red-600'
    if (percentage < 0) return 'text-green-600'
    return 'text-gray-600'
  }

  const getChangeIcon = (percentage: number) => {
    if (percentage > 0) return '📈'
    if (percentage < 0) return '📉'
    return '➡️'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 今月の統計 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">今月の支出</h3>
        <div className="space-y-3">
          <div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(thisMonthTotal)}</p>
            <div className="flex items-center mt-1">
              <span className="mr-1">{getChangeIcon(changePercentage)}</span>
              <span className={`text-sm ${getChangeColor(changePercentage)}`}>
                前月比 {changePercentage >= 0 ? '+' : ''}{changePercentage.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="pt-2 border-t">
            <p className="text-sm text-gray-600">1日平均</p>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(avgDailyExpense)}</p>
          </div>
        </div>
      </div>

      {/* 予算との比較 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">予算利用状況</h3>
        <div className="space-y-3">
          <div>
            <p className="text-2xl font-bold text-gray-900">{budgetUsagePercentage.toFixed(1)}%</p>
            <p className="text-sm text-gray-600">予算利用率</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${
                budgetUsagePercentage < 70 ? 'bg-green-500' :
                budgetUsagePercentage < 90 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${Math.min(budgetUsagePercentage, 100)}%` }}
            />
          </div>
          <div className="pt-2 border-t">
            <p className="text-sm text-gray-600">月予算合計</p>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(totalBudget)}</p>
          </div>
        </div>
      </div>

      {/* 前月との比較 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">前月との比較</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">今月</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(thisMonthTotal)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">前月</p>
            <p className="text-xl font-bold text-gray-700">{formatCurrency(lastMonthTotal)}</p>
          </div>
          <div className="pt-2 border-t">
            <p className="text-sm text-gray-600">差額</p>
            <p className={`text-lg font-semibold ${getChangeColor(changePercentage)}`}>
              {thisMonthTotal - lastMonthTotal >= 0 ? '+' : ''}{formatCurrency(thisMonthTotal - lastMonthTotal)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
