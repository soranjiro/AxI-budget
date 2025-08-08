import { useTransactionStore } from '@/stores/transaction'
import { Transaction } from '@/types'
import { useBudgetStore } from '@/stores/budget'

interface TransactionListProps {
  transactions: Transaction[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  const { deleteTransaction } = useTransactionStore()
  const { getBudgetById } = useBudgetStore()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
    })
  }

  const getBudgetName = (budgetId?: string) => {
    if (!budgetId) return null
    const budget = getBudgetById(budgetId)
    return budget?.name
  }

  const getTypeIcon = (transaction: Transaction) => {
    if (transaction.type === 'income') return '💰'
    if (transaction.transactionType === 'advance') return '💸'
    return '💳'
  }

  const getTypeColor = (transaction: Transaction) => {
    if (transaction.type === 'income') return 'text-green-600'
    if (transaction.transactionType === 'advance') return 'text-orange-600'
    return 'text-gray-900'
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>取引がありません</p>
        <p className="text-sm mt-1">新しい取引を追加してみましょう</p>
      </div>
    )
  }

  // 日付でソート（新しい順）
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="space-y-3">
      {sortedTransactions.map((transaction) => {
        const budgetName = getBudgetName(transaction.budgetId)

        return (
          <div key={transaction.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
            <div className="flex items-center space-x-3">
              <span className="text-xl">{getTypeIcon(transaction)}</span>
              <div>
                <p className="font-medium text-gray-900">{transaction.description}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{transaction.category}</span>
                  {budgetName && (
                    <>
                      <span>•</span>
                      <span className="text-blue-600">{budgetName}</span>
                    </>
                  )}
                  {transaction.transactionType === 'advance' && (
                    <>
                      <span>•</span>
                      <span className="text-orange-600">立て替え</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className={`font-semibold ${getTypeColor(transaction)}`}>
                  {transaction.type === 'income' ? '+' : '-'}¥{transaction.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
              </div>
              <button
                onClick={async () => {
                  try {
                    await deleteTransaction(transaction.id)
                  } catch (error) {
                    console.error('Failed to delete transaction:', error)
                  }
                }}
                className="text-gray-400 hover:text-red-500 p-1"
              >
                🗑️
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
