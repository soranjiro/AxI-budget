import { create } from 'zustand'
import { AccountTypeConfig, AccountTypeInput, DEFAULT_ACCOUNT_TYPES } from '../types'
import { initDB, accountTypeDB } from '../utils/indexedDB'

interface AccountTypeState {
  accountTypes: AccountTypeConfig[]
  isLoading: boolean
  isInitialized: boolean
  initStore: () => Promise<void>
  addAccountType: (accountType: AccountTypeInput) => Promise<void>
  updateAccountType: (id: string, updates: Partial<AccountTypeConfig>) => Promise<void>
  deleteAccountType: (id: string) => Promise<void>
  getAccountTypeById: (id: string) => AccountTypeConfig | undefined
  getActiveAccountTypes: () => AccountTypeConfig[]
  initializeDefaultAccountTypes: () => Promise<void>
  loadAccountTypes: () => Promise<void>
}

export const useAccountTypeStore = create<AccountTypeState>()((set, get) => ({
  accountTypes: [],
  isLoading: false,
  isInitialized: false,

  initStore: async () => {
    if (get().isInitialized) return

    try {
      await initDB()
      await get().loadAccountTypes()

      // データが空の場合、デフォルト口座タイプを初期化
      if (get().accountTypes.length === 0) {
        await get().initializeDefaultAccountTypes()
      }

      set({ isInitialized: true })
    } catch (error) {
      console.error('Failed to initialize account type store:', error)
    }
  },

  loadAccountTypes: async () => {
    try {
      set({ isLoading: true })
      const accountTypes = await accountTypeDB.getAll() as AccountTypeConfig[]
      set({ accountTypes, isLoading: false })
    } catch (error) {
      console.error('Failed to load account types:', error)
      set({ isLoading: false })
    }
  },

  initializeDefaultAccountTypes: async () => {
    try {
      const defaultAccountTypes = DEFAULT_ACCOUNT_TYPES.map(accountTypeData => ({
        ...accountTypeData,
        id: `accountType-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))

      for (const accountType of defaultAccountTypes) {
        await accountTypeDB.add(accountType)
      }

      set({ accountTypes: defaultAccountTypes })
    } catch (error) {
      console.error('Failed to initialize default account types:', error)
      throw error
    }
  },

  addAccountType: async (accountTypeData) => {
    try {
      const newAccountType: AccountTypeConfig = {
        ...accountTypeData,
        id: `accountType-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await accountTypeDB.add(newAccountType)
      set((state) => ({ accountTypes: [...state.accountTypes, newAccountType] }))
    } catch (error) {
      console.error('Failed to add account type:', error)
      throw error
    }
  },

  updateAccountType: async (id, updates) => {
    try {
      const currentAccountType = get().accountTypes.find(at => at.id === id)
      if (!currentAccountType) {
        throw new Error('Account type not found')
      }

      const updatedAccountType = {
        ...currentAccountType,
        ...updates,
        updatedAt: new Date().toISOString()
      }

      await accountTypeDB.update(updatedAccountType)
      set((state) => ({
        accountTypes: state.accountTypes.map((accountType) =>
          accountType.id === id ? updatedAccountType : accountType
        ),
      }))
    } catch (error) {
      console.error('Failed to update account type:', error)
      throw error
    }
  },

  deleteAccountType: async (id) => {
    try {
      // デフォルト口座タイプは削除できない
      const accountType = get().accountTypes.find(at => at.id === id)
      if (accountType?.isDefault) {
        throw new Error('Default account types cannot be deleted')
      }

      await accountTypeDB.delete(id)
      set((state) => ({
        accountTypes: state.accountTypes.filter((accountType) => accountType.id !== id),
      }))
    } catch (error) {
      console.error('Failed to delete account type:', error)
      throw error
    }
  },

  getAccountTypeById: (id) => {
    return get().accountTypes.find((accountType) => accountType.id === id)
  },

  getActiveAccountTypes: () => {
    return get().accountTypes.filter((accountType) => accountType.isActive)
  },
}))
