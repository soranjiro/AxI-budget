import { create } from 'zustand'
import { Category, CategoryInput, DEFAULT_CATEGORIES } from '../types'
import { initDB, categoryDB } from '../utils/indexedDB'

interface CategoryState {
  categories: Category[]
  isLoading: boolean
  isInitialized: boolean
  initStore: () => Promise<void>
  addCategory: (category: CategoryInput) => Promise<void>
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  getCategoryById: (id: string) => Category | undefined
  getActiveCategories: () => Category[]
  getCategoryNames: () => string[]
  initializeDefaultCategories: () => Promise<void>
  loadCategories: () => Promise<void>
}

export const useCategoryStore = create<CategoryState>()((set, get) => ({
  categories: [],
  isLoading: false,
  isInitialized: false,

  initStore: async () => {
    if (get().isInitialized) return

    try {
      await initDB()
      await get().loadCategories()

      // データが空の場合、デフォルトカテゴリを初期化
      if (get().categories.length === 0) {
        await get().initializeDefaultCategories()
      }

      set({ isInitialized: true })
    } catch (error) {
      console.error('Failed to initialize category store:', error)
    }
  },

  loadCategories: async () => {
    try {
      set({ isLoading: true })
      const categories = await categoryDB.getAll() as Category[]
      set({ categories, isLoading: false })
    } catch (error) {
      console.error('Failed to load categories:', error)
      set({ isLoading: false })
    }
  },

  initializeDefaultCategories: async () => {
    try {
      const defaultCategories = DEFAULT_CATEGORIES.map(categoryData => ({
        ...categoryData,
        id: `category-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))

      for (const category of defaultCategories) {
        await categoryDB.add(category)
      }

      set({ categories: defaultCategories })
    } catch (error) {
      console.error('Failed to initialize default categories:', error)
      throw error
    }
  },

  addCategory: async (categoryData) => {
    try {
      const newCategory: Category = {
        ...categoryData,
        id: `category-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await categoryDB.add(newCategory)
      set((state) => ({ categories: [...state.categories, newCategory] }))
    } catch (error) {
      console.error('Failed to add category:', error)
      throw error
    }
  },

  updateCategory: async (id, updates) => {
    try {
      const currentCategory = get().categories.find(c => c.id === id)
      if (!currentCategory) {
        throw new Error('Category not found')
      }

      const updatedCategory = {
        ...currentCategory,
        ...updates,
        updatedAt: new Date().toISOString()
      }

      await categoryDB.update(updatedCategory)
      set((state) => ({
        categories: state.categories.map((category) =>
          category.id === id ? updatedCategory : category
        ),
      }))
    } catch (error) {
      console.error('Failed to update category:', error)
      throw error
    }
  },

  deleteCategory: async (id) => {
    try {
      // デフォルトカテゴリは削除できない
      const category = get().categories.find(c => c.id === id)
      if (category?.isDefault) {
        throw new Error('Default categories cannot be deleted')
      }

      await categoryDB.delete(id)
      set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
      }))
    } catch (error) {
      console.error('Failed to delete category:', error)
      throw error
    }
  },

  getCategoryById: (id) => {
    return get().categories.find((category) => category.id === id)
  },

  getActiveCategories: () => {
    return get().categories.filter((category) => category.isActive)
  },

  getCategoryNames: () => {
    return get().getActiveCategories().map(category => category.name)
  },
}))
