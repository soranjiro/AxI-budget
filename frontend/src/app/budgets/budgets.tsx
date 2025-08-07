import { useState } from 'react'
import { useBudgetStore } from '@/stores/budget'
import { GuestNotice } from '@/components/GuestNotice'
import { BudgetModal } from './BudgetModal'
import { BudgetList } from './BudgetList'

export function Budgets() {
  const { budgets } = useBudgetStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-6 pt-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">予算管理</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
        >
          ➕ 新しい予算
        </button>
      </div>

      <GuestNotice />

      <div className="card">
        <BudgetList budgets={budgets} />
      </div>

      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
