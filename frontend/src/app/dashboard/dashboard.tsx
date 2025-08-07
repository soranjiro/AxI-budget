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

  return (
    <div className="space-y-6 pt-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
      </div>

      <GuestNotice />

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">今月の支出</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">¥{monthlyExpense.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">
            {thisMonthTransactions.filter(t => t.type === 'expense').length}件の取引
          </p>
        </div>

        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">今月の予算</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">¥{totalBudget.toLocaleString()}</p>
          <p className={`text-xs mt-1 ${budgetRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            残り ¥{budgetRemaining.toLocaleString()}
          </p>
        </div>

        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">立て替え残高</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">¥{advanceBalance.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">
            {advanceBalance > 0 ? '未精算' : '精算済み'}
          </p>
        </div>

        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">グループ精算</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">0件</p>
          <p className="text-xs text-gray-500 mt-1">待機中</p>
        </div>
      </div>

      {/* 最近の取引 */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">最近の取引</h2>
          <a href="/transactions" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            すべて表示
          </a>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">
                    {transaction.type === 'income' ? '💰' :
                     transaction.transactionType === 'advance' ? '💸' : '💳'}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
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
          <div className="text-center py-8 text-gray-500">
            <p>まだ取引がありません</p>
            <p className="text-sm mt-1">取引を追加してみましょう</p>
          </div>
        )}
      </div>
    </div>
  )
}
