import { useEffect } from 'react'
import { useTransactionStore } from '../stores/transaction'
import { useBudgetStore } from '../stores/budget'

/**
 * Hook to initialize all IndexedDB stores
 * Should be called at the app root level
 */
export const useInitializeStores = () => {
  const initTransactionStore = useTransactionStore(state => state.initStore)
  const initBudgetStore = useBudgetStore(state => state.initStore)

  useEffect(() => {
    const initializeAllStores = async () => {
      try {
        await Promise.all([
          initTransactionStore(),
          initBudgetStore(),
        ])
        console.log('All stores initialized successfully')
      } catch (error) {
        console.error('Failed to initialize stores:', error)
      }
    }

    initializeAllStores()
  }, [initTransactionStore, initBudgetStore])
}

/**
 * Hook to check if stores are loading
 */
export const useStoresStatus = () => {
  const transactionLoading = useTransactionStore(state => state.isLoading)
  const budgetLoading = useBudgetStore(state => state.isLoading)
  const transactionInitialized = useTransactionStore(state => state.isInitialized)
  const budgetInitialized = useBudgetStore(state => state.isInitialized)

  return {
    isLoading: transactionLoading || budgetLoading,
    isInitialized: transactionInitialized && budgetInitialized,
  }
}
