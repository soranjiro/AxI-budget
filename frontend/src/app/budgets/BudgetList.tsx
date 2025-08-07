import { useBudgetStore, Budget } from '@/stores/budget'
import { useTransactionStore } from '@/stores/transaction'

interface BudgetListProps {
  budgets: Budget[]
}

export function BudgetList({ budgets }: BudgetListProps) {
  const { deleteBudget } = useBudgetStore()
  const { transactions } = useTransactionStore()

  const calculateSpent = (budget: Budget) => {
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    const budgetTransactions = transactions.filter(
      t => t.budgetId === budget.id &&
           t.type === 'expense' &&
           t.date.startsWith(currentMonth)
    )
    return budgetTransactions.reduce((sum, t) => sum + t.amount, 0)
  }

  const calculateProgress = (budget: Budget, spent: number) => {
    return budget.amount > 0 ? (spent / budget.amount) * 100 : 0
  }

  const getProgressColor = (progress: number) => {
    if (progress < 70) return 'bg-green-500'
    if (progress < 90) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (budgets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>予算が設定されていません</p>
        <p className="text-sm mt-1">予算を設定して支出を管理しましょう</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {budgets.map((budget) => {
        const spent = calculateSpent(budget)
        const progress = calculateProgress(budget, spent)
        const remaining = budget.amount - spent

        return (
          <div key={budget.id} className="card">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{budget.name}</h3>
                <p className="text-sm text-gray-500">{budget.category} • {budget.period === 'monthly' ? '月次' : '年次'}</p>
              </div>
              <button
                onClick={() => deleteBudget(budget.id)}
                className="text-gray-400 hover:text-red-500 text-sm"
              >
                🗑️
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>使用済み</span>
                <span className="font-medium">¥{spent.toLocaleString()} / ¥{budget.amount.toLocaleString()}</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getProgressColor(progress)}`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>

              <div className="flex justify-between text-sm">
                <span className={remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                  残り: ¥{remaining.toLocaleString()}
                </span>
                <span className="text-gray-500">
                  {progress.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
