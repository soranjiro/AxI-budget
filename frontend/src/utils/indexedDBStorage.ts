import { PersistStorage } from 'zustand/middleware'
import { initDB, authDB } from './indexedDB'

/**
 * IndexedDB storage adapter for Zustand persist middleware
 */
export const indexedDBStorage: PersistStorage<any> = {
  getItem: async (name: string) => {
    try {
      await initDB()
      const result = await authDB.get(name) as any
      return result ? result.data : null
    } catch (error) {
      console.error('Failed to get item from IndexedDB:', error)
      return null
    }
  },

  setItem: async (name: string, value: any): Promise<void> => {
    try {
      await initDB()
      await authDB.put(name, { data: value })
    } catch (error) {
      console.error('Failed to set item in IndexedDB:', error)
    }
  },

  removeItem: async (name: string): Promise<void> => {
    try {
      await initDB()
      await authDB.delete(name)
    } catch (error) {
      console.error('Failed to remove item from IndexedDB:', error)
    }
  }
}

/**
 * Custom IndexedDB storage for direct data operations
 * This bypasses Zustand's persist middleware and directly uses IndexedDB
 */
export const createIndexedDBStore = <T extends { id: string }>(storeName: string) => {
  const getDbOperations = () => {
    if (storeName === 'transactions') {
      return require('./indexedDB').transactionDB
    } else if (storeName === 'budgets') {
      return require('./indexedDB').budgetDB
    }
    throw new Error(`Unknown store: ${storeName}`)
  }

  return {
    async getAll(): Promise<T[]> {
      try {
        await initDB()
        const db = getDbOperations()
        return await db.getAll()
      } catch (error) {
        console.error(`Failed to get all ${storeName}:`, error)
        return []
      }
    },

    async add(item: T): Promise<T> {
      try {
        await initDB()
        const db = getDbOperations()
        return await db.add(item)
      } catch (error) {
        console.error(`Failed to add ${storeName}:`, error)
        throw error
      }
    },

    async update(item: T): Promise<T> {
      try {
        await initDB()
        const db = getDbOperations()
        return await db.update(item)
      } catch (error) {
        console.error(`Failed to update ${storeName}:`, error)
        throw error
      }
    },

    async delete(id: string): Promise<void> {
      try {
        await initDB()
        const db = getDbOperations()
        await db.delete(id)
      } catch (error) {
        console.error(`Failed to delete ${storeName}:`, error)
        throw error
      }
    },

    async get(id: string): Promise<T | undefined> {
      try {
        await initDB()
        const db = getDbOperations()
        return await db.get(id)
      } catch (error) {
        console.error(`Failed to get ${storeName}:`, error)
        return undefined
      }
    },

    async clear(): Promise<void> {
      try {
        await initDB()
        const db = getDbOperations()
        await db.clear()
      } catch (error) {
        console.error(`Failed to clear ${storeName}:`, error)
      }
    }
  }
}
