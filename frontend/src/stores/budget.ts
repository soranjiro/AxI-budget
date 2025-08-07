import { create } from 'zustand'
import { initDB, budgetDB } from '../utils/indexedDB'

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
  isLoading: boolean
  isInitialized: boolean
  initStore: () => Promise<void>
  addBudget: (budget: Omit<Budget, 'id' | 'spent' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateBudget: (id: string, updates: Partial<Budget>) => Promise<void>
  deleteBudget: (id: string) => Promise<void>
  getBudgetById: (id: string) => Budget | undefined
  loadBudgets: () => Promise<void>
}

export const useBudgetStore = create<BudgetState>()((set, get) => ({
  budgets: [],
  isLoading: false,
  isInitialized: false,

  initStore: async () => {
    if (get().isInitialized) return

    try {
      await initDB()
      await get().loadBudgets()
      set({ isInitialized: true })
    } catch (error) {
      console.error('Failed to initialize budget store:', error)
    }
  },

  loadBudgets: async () => {
    try {
      set({ isLoading: true })
      const budgets = await budgetDB.getAll() as Budget[]
      set({ budgets, isLoading: false })
    } catch (error) {
      console.error('Failed to load budgets:', error)
      set({ isLoading: false })
    }
  },

  addBudget: async (budgetData) => {
    try {
      const newBudget: Budget = {
        ...budgetData,
        id: `budget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        spent: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await budgetDB.add(newBudget)
      set((state) => ({ budgets: [...state.budgets, newBudget] }))
    } catch (error) {
      console.error('Failed to add budget:', error)
      throw error
    }
  },

  updateBudget: async (id, updates) => {
    try {
      const currentBudget = get().budgets.find(b => b.id === id)
      if (!currentBudget) {
        throw new Error('Budget not found')
      }

      const updatedBudget = {
        ...currentBudget,
        ...updates,
        updatedAt: new Date().toISOString()
      }

      await budgetDB.update(updatedBudget)
      set((state) => ({
        budgets: state.budgets.map((budget) =>
          budget.id === id ? updatedBudget : budget
        ),
      }))
    } catch (error) {
      console.error('Failed to update budget:', error)
      throw error
    }
  },

  deleteBudget: async (id) => {
    try {
      await budgetDB.delete(id)
      set((state) => ({
        budgets: state.budgets.filter((budget) => budget.id !== id),
      }))
    } catch (error) {
      console.error('Failed to delete budget:', error)
      throw error
    }
  },

  getBudgetById: (id) => {
    return get().budgets.find((budget) => budget.id === id)
  },
}))
