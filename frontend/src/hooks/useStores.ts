import { useEffect } from 'react'
import { useTransactionStore } from '../stores/transaction'
import { useBudgetStore } from '../stores/budget'
import { useAccountStore } from '../stores/account'
import { useCategoryStore } from '../stores/category'
import { useAccountTypeStore } from '../stores/accountType'

/**
 * Hook to initialize all IndexedDB stores
 * Should be called at the app root level
 */
export const useInitializeStores = () => {
  const initTransactionStore = useTransactionStore(state => state.initStore)
  const initBudgetStore = useBudgetStore(state => state.initStore)
  const initAccountStore = useAccountStore(state => state.initStore)
  const initCategoryStore = useCategoryStore(state => state.initStore)
  const initAccountTypeStore = useAccountTypeStore(state => state.initStore)

  useEffect(() => {
    const initializeAllStores = async () => {
      try {
        await Promise.all([
          initTransactionStore(),
          initBudgetStore(),
          initAccountStore(),
          initCategoryStore(),
          initAccountTypeStore(),
        ])
        console.log('All stores initialized successfully')
      } catch (error) {
        console.error('Failed to initialize stores:', error)
      }
    }

    initializeAllStores()
  }, [initTransactionStore, initBudgetStore, initAccountStore, initCategoryStore, initAccountTypeStore])
}

/**
 * Hook to check if stores are loading
 */
export const useStoresStatus = () => {
  const transactionLoading = useTransactionStore(state => state.isLoading)
  const budgetLoading = useBudgetStore(state => state.isLoading)
  const accountLoading = useAccountStore(state => state.isLoading)
  const categoryLoading = useCategoryStore(state => state.isLoading)
  const accountTypeLoading = useAccountTypeStore(state => state.isLoading)

  const transactionInitialized = useTransactionStore(state => state.isInitialized)
  const budgetInitialized = useBudgetStore(state => state.isInitialized)
  const accountInitialized = useAccountStore(state => state.isInitialized)
  const categoryInitialized = useCategoryStore(state => state.isInitialized)
  const accountTypeInitialized = useAccountTypeStore(state => state.isInitialized)

  return {
    isLoading: transactionLoading || budgetLoading || accountLoading || categoryLoading || accountTypeLoading,
    isInitialized: transactionInitialized && budgetInitialized && accountInitialized && categoryInitialized && accountTypeInitialized,
  }
}
