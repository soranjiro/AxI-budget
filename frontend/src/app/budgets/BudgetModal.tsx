import { useState } from 'react'
import { useBudgetStore } from '@/stores/budget'

interface BudgetModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BudgetModal({ isOpen, onClose }: BudgetModalProps) {
  const { addBudget } = useBudgetStore()
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '',
    period: 'monthly' as 'monthly' | 'yearly',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.amount || !formData.category) {
      return
    }

    try {
      await addBudget({
        name: formData.name,
        amount: Number(formData.amount),
        category: formData.category,
        period: formData.period,
      })

      // フォームをリセット
      setFormData({
        name: '',
        amount: '',
        category: '',
        period: 'monthly',
      })
      onClose()
    } catch (error) {
      console.error('Failed to add budget:', error)
      // TODO: エラーメッセージを表示
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">新しい予算を作成</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">予算名</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input w-full"
              placeholder="例: 食費、交通費"
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
              placeholder="10000"
              min="0"
              required
            />
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
            <label className="label">期間</label>
            <select
              name="period"
              value={formData.period}
              onChange={handleChange}
              className="input w-full"
            >
              <option value="monthly">月次</option>
              <option value="yearly">年次</option>
            </select>
          </div>

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
              作成
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
