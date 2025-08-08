import { GuestNotice } from '@/components/GuestNotice'
import { useTransactionStore } from '@/stores/transaction'
import { useBudgetStore } from '@/stores/budget'

export function Dashboard() {
  const { transactions } = useTransactionStore()
  const { budgets } = useBudgetStore()

  // 今月のデータを計算
  const currentMonth = new Date().toISOString().slice(0, 7)
  const thisMonthTransactions = transactions.filter(t => t.date.startsWith(currentMonth))

  const monthlyExpense = thisMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)
  const budgetRemaining = totalBudget - monthlyExpense

  const advanceBalance = thisMonthTransactions
    .filter(t => t.transactionType === 'advance')
    .reduce((sum, t) => sum + t.amount, 0)

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const budgetUsagePercentage = totalBudget > 0 ? (monthlyExpense / totalBudget) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-800 bg-clip-text text-transparent">
            ダッシュボード
          </h1>
          <p className="text-gray-600 mt-1">財務状況を一目で確認</p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short'
          })}
        </div>
      </div>

      <GuestNotice />

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-glass group hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">今月の支出</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">¥{monthlyExpense.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-2 flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                {thisMonthTransactions.filter(t => t.type === 'expense').length}件の取引
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">💳</span>
            </div>
          </div>
        </div>

        <div className="card-glass group hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">今月の予算</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">¥{totalBudget.toLocaleString()}</p>
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className={budgetRemaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                    残り ¥{budgetRemaining.toLocaleString()}
                  </span>
                  <span className="text-gray-500">{budgetUsagePercentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      budgetUsagePercentage > 90 ? 'bg-gradient-to-r from-red-400 to-red-600' :
                      budgetUsagePercentage > 70 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                      'bg-gradient-to-r from-green-400 to-green-600'
                    }`}
                    style={{ width: `${Math.min(budgetUsagePercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">📈</span>
            </div>
          </div>
        </div>

        <div className="card-glass group hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">立て替え残高</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">¥{advanceBalance.toLocaleString()}</p>
              <p className="text-sm mt-2 flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${advanceBalance > 0 ? 'bg-orange-400' : 'bg-green-400'}`}></span>
                <span className={advanceBalance > 0 ? 'text-orange-600' : 'text-green-600'}>
                  {advanceBalance > 0 ? '未精算' : '精算済み'}
                </span>
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">💸</span>
            </div>
          </div>
        </div>

        <div className="card-glass group hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">グループ精算</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">0件</p>
              <p className="text-sm text-gray-500 mt-2 flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                待機中
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">👥</span>
            </div>
          </div>
        </div>
      </div>

      {/* 最近の取引 */}
      <div className="card-glass">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <span className="w-6 h-6 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg mr-3"></span>
            最近の取引
          </h2>
          <a
            href="/transactions"
            className="text-primary-600 hover:text-primary-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200"
          >
            すべて表示 →
          </a>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:shadow-md transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                    transaction.type === 'income' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                    transaction.transactionType === 'advance' ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                    'bg-gradient-to-br from-gray-400 to-gray-600'
                  }`}>
                    <span className="text-white text-lg">
                      {transaction.type === 'income' ? '💰' :
                       transaction.transactionType === 'advance' ? '💸' : '💳'}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-lg inline-block">
                      {transaction.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-lg ${transaction.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                    {transaction.type === 'income' ? '+' : '-'}¥{transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">💰</span>
            </div>
            <p className="text-gray-500 text-lg font-medium">まだ取引がありません</p>
            <p className="text-sm text-gray-400 mt-1">取引を追加してみましょう</p>
            <a
              href="/transactions"
              className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              取引を追加
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
