/**
 * IndexedDB utility for AxI-budget PWA
 * Provides a simple interface for storing and retrieving data
 */

interface DBConfig {
  name: string
  version: number
  stores: {
    name: string
    keyPath: string
    indexes?: { name: string; keyPath: string | string[]; unique?: boolean }[]
  }[]
}

const DB_CONFIG: DBConfig = {
  name: 'AxiBudgetDB',
  version: 1,
  stores: [
    {
      name: 'transactions',
      keyPath: 'id',
      indexes: [
        { name: 'date', keyPath: 'date' },
        { name: 'category', keyPath: 'category' },
        { name: 'type', keyPath: 'type' },
        { name: 'transactionType', keyPath: 'transactionType' },
        { name: 'accountId', keyPath: 'accountId' },
        { name: 'budgetId', keyPath: 'budgetId' },
        { name: 'createdAt', keyPath: 'createdAt' }
      ]
    },
    {
      name: 'budgets',
      keyPath: 'id',
      indexes: [
        { name: 'category', keyPath: 'category' },
        { name: 'period', keyPath: 'period' },
        { name: 'createdAt', keyPath: 'createdAt' }
      ]
    },
    {
      name: 'accounts',
      keyPath: 'id',
      indexes: [
        { name: 'type', keyPath: 'type' },
        { name: 'isActive', keyPath: 'isActive' },
        { name: 'createdAt', keyPath: 'createdAt' }
      ]
    },
    {
      name: 'categories',
      keyPath: 'id',
      indexes: [
        { name: 'name', keyPath: 'name' },
        { name: 'isActive', keyPath: 'isActive' },
        { name: 'createdAt', keyPath: 'createdAt' }
      ]
    },
    {
      name: 'accountTypes',
      keyPath: 'id',
      indexes: [
        { name: 'type', keyPath: 'type' },
        { name: 'isActive', keyPath: 'isActive' },
        { name: 'createdAt', keyPath: 'createdAt' }
      ]
    },
    {
      name: 'auth',
      keyPath: 'key'
    }
  ]
}

class IndexedDBManager {
  private db: IDBDatabase | null = null
  private readonly dbName = DB_CONFIG.name
  private readonly version = DB_CONFIG.version

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => {
        reject(new Error(`Failed to open database: ${request.error}`))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object stores
        DB_CONFIG.stores.forEach(storeConfig => {
          if (!db.objectStoreNames.contains(storeConfig.name)) {
            const store = db.createObjectStore(storeConfig.name, {
              keyPath: storeConfig.keyPath
            })

            // Create indexes
            if (storeConfig.indexes) {
              storeConfig.indexes.forEach(index => {
                store.createIndex(index.name, index.keyPath, {
                  unique: index.unique || false
                })
              })
            }
          }
        })
      }
    })
  }

  private ensureDB(): IDBDatabase {
    if (!this.db) {
      throw new Error('Database not initialized. Call init() first.')
    }
    return this.db
  }

  async add<T>(storeName: string, data: T): Promise<T> {
    const db = this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.add(data)

      request.onsuccess = () => resolve(data)
      request.onerror = () => reject(new Error(`Failed to add data: ${request.error}`))
    })
  }

  async put<T>(storeName: string, data: T): Promise<T> {
    const db = this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put(data)

      request.onsuccess = () => resolve(data)
      request.onerror = () => reject(new Error(`Failed to put data: ${request.error}`))
    })
  }

  async get<T>(storeName: string, key: string): Promise<T | undefined> {
    const db = this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(key)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(new Error(`Failed to get data: ${request.error}`))
    })
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    const db = this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(new Error(`Failed to get all data: ${request.error}`))
    })
  }

  async delete(storeName: string, key: string): Promise<void> {
    const db = this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(key)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error(`Failed to delete data: ${request.error}`))
    })
  }

  async clear(storeName: string): Promise<void> {
    const db = this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error(`Failed to clear store: ${request.error}`))
    })
  }

  async getByIndex<T>(
    storeName: string,
    indexName: string,
    value: string | number
  ): Promise<T[]> {
    const db = this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const index = store.index(indexName)
      const request = index.getAll(value)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(new Error(`Failed to get by index: ${request.error}`))
    })
  }

  async getByRange<T>(
    storeName: string,
    indexName: string,
    lowerBound: string | number,
    upperBound: string | number
  ): Promise<T[]> {
    const db = this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const index = store.index(indexName)
      const range = IDBKeyRange.bound(lowerBound, upperBound)
      const request = index.getAll(range)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(new Error(`Failed to get by range: ${request.error}`))
    })
  }

  async count(storeName: string): Promise<number> {
    const db = this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.count()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(new Error(`Failed to count: ${request.error}`))
    })
  }
}

// Singleton instance
export const dbManager = new IndexedDBManager()

// Initialize DB on module load
let initPromise: Promise<void> | null = null

export const initDB = (): Promise<void> => {
  if (!initPromise) {
    initPromise = dbManager.init()
  }
  return initPromise
}

// Utility functions for specific data types
export const transactionDB = {
  add: (transaction: any) => dbManager.add('transactions', transaction),
  update: (transaction: any) => dbManager.put('transactions', transaction),
  get: (id: string) => dbManager.get('transactions', id),
  getAll: () => dbManager.getAll('transactions'),
  delete: (id: string) => dbManager.delete('transactions', id),
  getByBudget: (budgetId: string) => dbManager.getByIndex('transactions', 'budgetId', budgetId),
  getByDateRange: (startDate: string, endDate: string) =>
    dbManager.getByRange('transactions', 'date', startDate, endDate),
  getByCategory: (category: string) => dbManager.getByIndex('transactions', 'category', category),
  getByType: (type: string) => dbManager.getByIndex('transactions', 'type', type),
  clear: () => dbManager.clear('transactions')
}

export const budgetDB = {
  add: (budget: any) => dbManager.add('budgets', budget),
  update: (budget: any) => dbManager.put('budgets', budget),
  get: (id: string) => dbManager.get('budgets', id),
  getAll: () => dbManager.getAll('budgets'),
  delete: (id: string) => dbManager.delete('budgets', id),
  getByCategory: (category: string) => dbManager.getByIndex('budgets', 'category', category),
  clear: () => dbManager.clear('budgets')
}

export const authDB = {
  put: (key: string, data: any) => dbManager.put('auth', { key, ...data }),
  get: (key: string) => dbManager.get('auth', key),
  delete: (key: string) => dbManager.delete('auth', key),
  clear: () => dbManager.clear('auth')
}

export const accountDB = {
  add: (account: any) => dbManager.add('accounts', account),
  update: (account: any) => dbManager.put('accounts', account),
  get: (id: string) => dbManager.get('accounts', id),
  getAll: () => dbManager.getAll('accounts'),
  delete: (id: string) => dbManager.delete('accounts', id),
  getByType: (type: string) => dbManager.getByIndex('accounts', 'type', type),
  getActive: () => dbManager.getByIndex('accounts', 'isActive', 'true'),
  clear: () => dbManager.clear('accounts')
}

export const categoryDB = {
  add: (category: any) => dbManager.add('categories', category),
  update: (category: any) => dbManager.put('categories', category),
  get: (id: string) => dbManager.get('categories', id),
  getAll: () => dbManager.getAll('categories'),
  delete: (id: string) => dbManager.delete('categories', id),
  getActive: () => dbManager.getByIndex('categories', 'isActive', 'true'),
  clear: () => dbManager.clear('categories')
}

export const accountTypeDB = {
  add: (accountType: any) => dbManager.add('accountTypes', accountType),
  update: (accountType: any) => dbManager.put('accountTypes', accountType),
  get: (id: string) => dbManager.get('accountTypes', id),
  getAll: () => dbManager.getAll('accountTypes'),
  delete: (id: string) => dbManager.delete('accountTypes', id),
  getActive: () => dbManager.getByIndex('accountTypes', 'isActive', 'true'),
  clear: () => dbManager.clear('accountTypes')
}
