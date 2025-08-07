import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { signInWithRedirect, getCurrentUser, signOut } from 'aws-amplify/auth'
import '@/config/aws'
import { indexedDBStorage } from '../utils/indexedDBStorage'

interface User {
  userId: string
  username: string
  attributes?: Record<string, any>
  isGuest?: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  signInWithOAuth: () => Promise<void>
  signInAsGuest: () => void
  signOut: () => Promise<void>
  initializeAuth: () => Promise<void>
  setUser: (user: User) => void
  clearUser: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      signInWithOAuth: async () => {
        try {
          await signInWithRedirect({ provider: 'Google' })
        } catch (error) {
          console.error('OAuth sign in error:', error)
          throw error
        }
      },

      signInAsGuest: () => {
        const guestUser: User = {
          userId: `guest-${Date.now()}`,
          username: 'ゲストユーザー',
          isGuest: true,
        }
        set({
          user: guestUser,
          isAuthenticated: true,
          isLoading: false
        })
      },

      signOut: async () => {
        try {
          await signOut()
          set({ user: null, isAuthenticated: false, isLoading: false })
        } catch (error) {
          console.error('Sign out error:', error)
          throw error
        }
      },

      initializeAuth: async () => {
        try {
          const currentUser = await getCurrentUser()
          set({
            user: {
              userId: currentUser.userId,
              username: currentUser.username,
              isGuest: false,
            },
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          console.error('Auth initialization error:', error)
          // 認証に失敗した場合は、ゲストとして続行するかユーザーに選択を促す
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true })
      },

      clearUser: () => {
        set({ user: null, isAuthenticated: false })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
    }),
    {
      name: 'axi-budget-auth',
      storage: indexedDBStorage,
      version: 1,
    }
  )
)
