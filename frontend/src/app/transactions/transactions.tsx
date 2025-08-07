import { useState } from 'react'
import { useTransactionStore } from '@/stores/transaction'
import { GuestNotice } from '@/components/GuestNotice'
import { TransactionModal } from './TransactionModal'
import { TransactionList } from './TransactionList'

export function Transactions() {
  const { transactions } = useTransactionStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filter, setFilter] = useState({
    period: 'thisMonth',
    type: 'all',
    category: 'all',
  })

  // フィルター適用
  const filteredTransactions = transactions.filter((transaction) => {
    // 期間フィルター
    if (filter.period === 'thisMonth') {
      const currentMonth = new Date().toISOString().slice(0, 7)
      if (!transaction.date.startsWith(currentMonth)) return false
    } else if (filter.period === 'lastMonth') {
      const lastMonth = new Date()
      lastMonth.setMonth(lastMonth.getMonth() - 1)
      const lastMonthStr = lastMonth.toISOString().slice(0, 7)
      if (!transaction.date.startsWith(lastMonthStr)) return false
    }

    // 種別フィルター
    if (filter.type === 'personal' && transaction.transactionType !== 'personal') return false
    if (filter.type === 'advance' && transaction.transactionType !== 'advance') return false

    // カテゴリフィルター
    if (filter.category !== 'all' && transaction.category !== filter.category) return false

    return true
  })

  return (
    <div className="space-y-6 pt-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">取引管理</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
        >
          ➕ 新しい取引
        </button>
      </div>

      <GuestNotice />

      {/* フィルター */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label">期間</label>
            <select
              className="input"
              value={filter.period}
              onChange={(e) => setFilter(prev => ({ ...prev, period: e.target.value }))}
            >
              <option value="thisMonth">今月</option>
              <option value="lastMonth">先月</option>
              <option value="thisYear">今年</option>
            </select>
          </div>
          <div>
            <label className="label">種別</label>
            <select
              className="input"
              value={filter.type}
              onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="all">すべて</option>
              <option value="personal">実支出</option>
              <option value="advance">立て替え</option>
            </select>
          </div>
          <div>
            <label className="label">カテゴリ</label>
            <select
              className="input"
              value={filter.category}
              onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="all">すべて</option>
              <option value="食費">食費</option>
              <option value="交通費">交通費</option>
              <option value="娯楽費">娯楽費</option>
              <option value="生活費">生活費</option>
              <option value="その他">その他</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              {filteredTransactions.length}件の取引
            </div>
          </div>
        </div>
      </div>

      {/* 取引一覧 */}
      <div className="card">
        <TransactionList transactions={filteredTransactions} />
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
