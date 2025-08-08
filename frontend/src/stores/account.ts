import { create } from 'zustand'
import { Account, AccountInput, AccountBalance, Transaction } from '../types'
import { initDB, accountDB } from '../utils/indexedDB'

interface AccountState {
  accounts: Account[]
  isLoading: boolean
  isInitialized: boolean
  initStore: () => Promise<void>
  addAccount: (account: AccountInput) => Promise<void>
  updateAccount: (id: string, updates: Partial<Account>) => Promise<void>
  deleteAccount: (id: string) => Promise<void>
  getAccountById: (id: string) => Account | undefined
  getActiveAccounts: () => Account[]
  getAccountsByType: (type: string) => Account[]
  calculateAccountBalance: (accountId: string, transactions: Transaction[]) => AccountBalance
  calculateAllBalances: (transactions: Transaction[]) => AccountBalance[]
  loadAccounts: () => Promise<void>
}

export const useAccountStore = create<AccountState>()((set, get) => ({
  accounts: [],
  isLoading: false,
  isInitialized: false,

  initStore: async () => {
    if (get().isInitialized) return

    try {
      await initDB()
      await get().loadAccounts()
      set({ isInitialized: true })
    } catch (error) {
      console.error('Failed to initialize account store:', error)
    }
  },

  loadAccounts: async () => {
    try {
      set({ isLoading: true })
      const accounts = await accountDB.getAll() as Account[]
      set({ accounts, isLoading: false })
    } catch (error) {
      console.error('Failed to load accounts:', error)
      set({ isLoading: false })
    }
  },

  addAccount: async (accountData) => {
    try {
      const newAccount: Account = {
        ...accountData,
        id: `account-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await accountDB.add(newAccount)
      set((state) => ({ accounts: [...state.accounts, newAccount] }))
    } catch (error) {
      console.error('Failed to add account:', error)
      throw error
    }
  },

  updateAccount: async (id, updates) => {
    try {
      const currentAccount = get().accounts.find(a => a.id === id)
      if (!currentAccount) {
        throw new Error('Account not found')
      }

      const updatedAccount = {
        ...currentAccount,
        ...updates,
        updatedAt: new Date().toISOString()
      }

      await accountDB.update(updatedAccount)
      set((state) => ({
        accounts: state.accounts.map((account) =>
          account.id === id ? updatedAccount : account
        ),
      }))
    } catch (error) {
      console.error('Failed to update account:', error)
      throw error
    }
  },

  deleteAccount: async (id) => {
    try {
      await accountDB.delete(id)
      set((state) => ({
        accounts: state.accounts.filter((account) => account.id !== id),
      }))
    } catch (error) {
      console.error('Failed to delete account:', error)
      throw error
    }
  },

  getAccountById: (id) => {
    return get().accounts.find((account) => account.id === id)
  },

  getActiveAccounts: () => {
    return get().accounts.filter((account) => account.isActive)
  },

  getAccountsByType: (type) => {
    return get().accounts.filter((account) => account.type === type)
  },

  calculateAccountBalance: (accountId, transactions) => {
    const account = get().accounts.find(a => a.id === accountId)
    if (!account) {
      return {
        accountId,
        currentBalance: 0,
        availableBalance: 0,
        pendingAmount: 0
      }
    }

    let balance = account.balance

    // トランザクションから残高を計算
    transactions.forEach(tx => {
      if (tx.accountId === accountId) {
        if (tx.type === 'expense') balance -= tx.amount
        if (tx.type === 'income') balance += tx.amount
        if (tx.type === 'transfer') balance -= tx.amount
      }
      if (tx.toAccountId === accountId && tx.type === 'transfer') {
        balance += tx.amount
      }
    })

    // クレジットカードの場合の計算
    if (account.type === 'credit_card') {
      const creditLimit = account.creditLimit || 0
      const pendingAmount = balance < 0 ? Math.abs(balance) : 0
      return {
        accountId,
        currentBalance: balance,
        availableBalance: creditLimit - pendingAmount,
        pendingAmount
      }
    }

    return {
      accountId,
      currentBalance: balance,
      availableBalance: balance,
      pendingAmount: 0
    }
  },

  calculateAllBalances: (transactions) => {
    const accounts = get().getActiveAccounts()
    return accounts.map(account =>
      get().calculateAccountBalance(account.id, transactions)
    )
  },
}))
