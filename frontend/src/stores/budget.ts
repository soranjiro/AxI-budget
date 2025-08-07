import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Budget {
  id: string
  name: string
  amount: number
  category: string
  period: 'monthly' | 'yearly'
  spent: number
  createdAt: string
  updatedAt: string
}

interface BudgetState {
  budgets: Budget[]
  addBudget: (budget: Omit<Budget, 'id' | 'spent' | 'createdAt' | 'updatedAt'>) => void
  updateBudget: (id: string, updates: Partial<Budget>) => void
  deleteBudget: (id: string) => void
  getBudgetById: (id: string) => Budget | undefined
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      budgets: [],

      addBudget: (budgetData) => {
        const newBudget: Budget = {
          ...budgetData,
          id: `budget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          spent: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({ budgets: [...state.budgets, newBudget] }))
      },

      updateBudget: (id, updates) => {
        set((state) => ({
          budgets: state.budgets.map((budget) =>
            budget.id === id
              ? { ...budget, ...updates, updatedAt: new Date().toISOString() }
              : budget
          ),
        }))
      },

      deleteBudget: (id) => {
        set((state) => ({
          budgets: state.budgets.filter((budget) => budget.id !== id),
        }))
      },

      getBudgetById: (id) => {
        return get().budgets.find((budget) => budget.id === id)
      },
    }),
    {
      name: 'axi-budget-budgets',
      version: 1,
    }
  )
)
