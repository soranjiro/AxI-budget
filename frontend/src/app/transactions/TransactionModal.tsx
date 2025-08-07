import { useState } from 'react'
import { useTransactionStore } from '@/stores/transaction'
import { useBudgetStore } from '@/stores/budget'

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TransactionModal({ isOpen, onClose }: TransactionModalProps) {
  const { addTransaction } = useTransactionStore()
  const { budgets } = useBudgetStore()
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense' as 'expense' | 'income',
    transactionType: 'personal' as 'personal' | 'advance',
    date: new Date().toISOString().split('T')[0],
    budgetId: '',
    tags: [] as string[],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.description || !formData.amount || !formData.category) {
      return
    }

    try {
      await addTransaction({
        description: formData.description,
        amount: Number(formData.amount),
        category: formData.category,
        type: formData.type,
        transactionType: formData.transactionType,
        date: formData.date,
        budgetId: formData.budgetId || undefined,
        tags: formData.tags,
      })

      // フォームをリセット
      setFormData({
        description: '',
        amount: '',
        category: '',
        type: 'expense',
        transactionType: 'personal',
        date: new Date().toISOString().split('T')[0],
        budgetId: '',
        tags: [],
      })
      onClose()
    } catch (error) {
      console.error('Failed to add transaction:', error)
      // TODO: エラーメッセージを表示
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">新しい取引を追加</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">取引内容</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input w-full"
              placeholder="例: ランチ代、電車代"
              required
            />
          </div>

          <div>
            <label className="label">金額</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="input w-full"
              placeholder="1000"
              min="0"
              required
            />
          </div>

          <div>
            <label className="label">種別</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="input w-full"
            >
              <option value="expense">支出</option>
              <option value="income">収入</option>
            </select>
          </div>

          <div>
            <label className="label">取引タイプ</label>
            <select
              name="transactionType"
              value={formData.transactionType}
              onChange={handleChange}
              className="input w-full"
            >
              <option value="personal">実支出</option>
              <option value="advance">立て替え</option>
            </select>
          </div>

          <div>
            <label className="label">カテゴリ</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input w-full"
              required
            >
              <option value="">カテゴリを選択</option>
              <option value="食費">食費</option>
              <option value="交通費">交通費</option>
              <option value="娯楽費">娯楽費</option>
              <option value="生活費">生活費</option>
              <option value="その他">その他</option>
            </select>
          </div>

          <div>
            <label className="label">日付</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>

          {budgets.length > 0 && (
            <div>
              <label className="label">関連予算（任意）</label>
              <select
                name="budgetId"
                value={formData.budgetId}
                onChange={handleChange}
                className="input w-full"
              >
                <option value="">予算を選択</option>
                {budgets.map((budget) => (
                  <option key={budget.id} value={budget.id}>
                    {budget.name} ({budget.category})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              追加
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
