import { initDB, transactionDB, budgetDB, authDB } from './indexedDB'

/**
 * Development utilities for IndexedDB debugging
 * Only available in development mode
 */

export const indexedDBUtils = {
  /**
   * Log all data in IndexedDB to console
   */
  async logAllData() {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('IndexedDB utils are only available in development mode')
      return
    }

    try {
      await initDB()

      console.group('📊 IndexedDB Data')

      const transactions = await transactionDB.getAll()
      console.log('📝 Transactions:', transactions)

      const budgets = await budgetDB.getAll()
      console.log('💰 Budgets:', budgets)

      const authKeys = ['axi-budget-auth']
      for (const key of authKeys) {
        const authData = await authDB.get(key)
        console.log(`🔐 Auth (${key}):`, authData)
      }

      console.groupEnd()
    } catch (error) {
      console.error('Failed to log IndexedDB data:', error)
    }
  },

  /**
   * Clear all data in IndexedDB
   */
  async clearAllData() {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('IndexedDB utils are only available in development mode')
      return
    }

    try {
      await initDB()

      await Promise.all([
        transactionDB.clear(),
        budgetDB.clear(),
        authDB.clear(),
      ])

      console.log('🗑️ All IndexedDB data cleared')
    } catch (error) {
      console.error('Failed to clear IndexedDB data:', error)
    }
  },

  /**
   * Export all data as JSON
   */
  async exportData() {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('IndexedDB utils are only available in development mode')
      return
    }

    try {
      await initDB()

      const data = {
        transactions: await transactionDB.getAll(),
        budgets: await budgetDB.getAll(),
        auth: await authDB.get('axi-budget-auth'),
        exportedAt: new Date().toISOString(),
      }

      console.log('📤 Exported data:', data)
      return data
    } catch (error) {
      console.error('Failed to export IndexedDB data:', error)
    }
  },

  /**
   * Import sample data for testing
   */
  async importSampleData() {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('IndexedDB utils are only available in development mode')
      return
    }

    try {
      await initDB()

      // Sample transactions
      const sampleTransactions = [
        {
          id: 'sample-tx-1',
          description: 'サンプル取引 - ランチ',
          amount: 1200,
          category: '食費',
          type: 'expense' as const,
          transactionType: 'personal' as const,
          date: new Date().toISOString().split('T')[0],
          tags: ['ランチ'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'sample-tx-2',
          description: 'サンプル取引 - 電車代',
          amount: 300,
          category: '交通費',
          type: 'expense' as const,
          transactionType: 'personal' as const,
          date: new Date().toISOString().split('T')[0],
          tags: ['通勤'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]

      // Sample budgets
      const sampleBudgets = [
        {
          id: 'sample-budget-1',
          name: 'サンプル予算 - 食費',
          amount: 50000,
          category: '食費',
          period: 'monthly' as const,
          spent: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]

      for (const transaction of sampleTransactions) {
        await transactionDB.add(transaction)
      }

      for (const budget of sampleBudgets) {
        await budgetDB.add(budget)
      }

      console.log('📥 Sample data imported successfully')
    } catch (error) {
      console.error('Failed to import sample data:', error)
    }
  }
}

// Make utils available globally in development
if (process.env.NODE_ENV === 'development') {
  ;(window as any).indexedDBUtils = indexedDBUtils
}
