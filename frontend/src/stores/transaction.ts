import { create } from 'zustand'
import { Transaction, TransactionInput } from '../types'
import { initDB, transactionDB } from '../utils/indexedDB'

interface TransactionState {
  transactions: Transaction[]
  isLoading: boolean
  isInitialized: boolean
  initStore: () => Promise<void>
  addTransaction: (transaction: TransactionInput) => Promise<void>
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  getTransactionById: (id: string) => Transaction | undefined
  getTransactionsByBudget: (budgetId: string) => Transaction[]
  getTransactionsByDateRange: (startDate: string, endDate: string) => Transaction[]
  getTransactionsByAccount: (accountId: string) => Transaction[]
  getIncludedInBudgetTransactions: () => Transaction[]
  loadTransactions: () => Promise<void>
}

export const useTransactionStore = create<TransactionState>()((set, get) => ({
  transactions: [],
  isLoading: false,
  isInitialized: false,

  initStore: async () => {
    if (get().isInitialized) return

    try {
      await initDB()
      await get().loadTransactions()
      set({ isInitialized: true })
    } catch (error) {
      console.error('Failed to initialize transaction store:', error)
    }
  },

  loadTransactions: async () => {
    try {
      set({ isLoading: true })
      const transactions = await transactionDB.getAll() as Transaction[]
      set({ transactions, isLoading: false })
    } catch (error) {
      console.error('Failed to load transactions:', error)
      set({ isLoading: false })
    }
  },

  addTransaction: async (transactionData) => {
    try {
      const newTransaction: Transaction = {
        ...transactionData,
        id: `transaction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await transactionDB.add(newTransaction)
      set((state) => ({ transactions: [...state.transactions, newTransaction] }))
    } catch (error) {
      console.error('Failed to add transaction:', error)
      throw error
    }
  },

  updateTransaction: async (id, updates) => {
    try {
      const currentTransaction = get().transactions.find(t => t.id === id)
      if (!currentTransaction) {
        throw new Error('Transaction not found')
      }

      const updatedTransaction = {
        ...currentTransaction,
        ...updates,
        updatedAt: new Date().toISOString()
      }

      await transactionDB.update(updatedTransaction)
      set((state) => ({
        transactions: state.transactions.map((transaction) =>
          transaction.id === id ? updatedTransaction : transaction
        ),
      }))
    } catch (error) {
      console.error('Failed to update transaction:', error)
      throw error
    }
  },

  deleteTransaction: async (id) => {
    try {
      await transactionDB.delete(id)
      set((state) => ({
        transactions: state.transactions.filter((transaction) => transaction.id !== id),
      }))
    } catch (error) {
      console.error('Failed to delete transaction:', error)
      throw error
    }
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

  getTransactionsByAccount: (accountId) => {
    return get().transactions.filter((transaction) =>
      transaction.accountId === accountId || transaction.toAccountId === accountId
    )
  },

  getIncludedInBudgetTransactions: () => {
    return get().transactions.filter((transaction) => transaction.isIncludedInBudget)
  },
}))
