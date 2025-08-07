import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Transaction {
  id: string
  description: string
  amount: number
  category: string
  type: 'expense' | 'income'
  transactionType: 'personal' | 'advance' // 実支出 or 立て替え
  date: string
  tags: string[]
  budgetId?: string
  createdAt: string
  updatedAt: string
}

interface TransactionState {
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  getTransactionById: (id: string) => Transaction | undefined
  getTransactionsByBudget: (budgetId: string) => Transaction[]
  getTransactionsByDateRange: (startDate: string, endDate: string) => Transaction[]
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],

      addTransaction: (transactionData) => {
        const newTransaction: Transaction = {
          ...transactionData,
          id: `transaction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({ transactions: [...state.transactions, newTransaction] }))
      },

      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.id === id
              ? { ...transaction, ...updates, updatedAt: new Date().toISOString() }
              : transaction
          ),
        }))
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((transaction) => transaction.id !== id),
        }))
      },

      getTransactionById: (id) => {
        return get().transactions.find((transaction) => transaction.id === id)
      },

      getTransactionsByBudget: (budgetId) => {
        return get().transactions.filter((transaction) => transaction.budgetId === budgetId)
      },

      getTransactionsByDateRange: (startDate, endDate) => {
        return get().transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.date)
          return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate)
        })
      },
    }),
    {
      name: 'axi-budget-transactions',
      version: 1,
    }
  )
)
