import React, { useState, useEffect } from 'react'
import { Category, CategoryInput } from '../types'
import { useCategoryStore } from '../stores/category'

const CategoryForm: React.FC<{
  category?: Category
  onSave: (category: CategoryInput) => void
  onCancel: () => void
}> = ({ category, onSave, onCancel }) => {
  const [formData, setFormData] = useState<CategoryInput>({
    name: category?.name || '',
    icon: category?.icon || '📝',
    color: category?.color || '#95A5A6',
    isDefault: category?.isDefault || false,
    isActive: category?.isActive ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const defaultIcons = ['🍽️', '🚗', '🎮', '🏠', '🏥', '📚', '👕', '💊', '⚡', '📱', '🎬', '✈️', '📝', '❓']
  const defaultColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB6C1', '#95A5A6']

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          カテゴリ名
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          アイコン
        </label>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {defaultIcons.map(icon => (
            <button
              key={icon}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, icon }))}
              className={`p-2 text-xl border rounded-md hover:bg-gray-50 ${
                formData.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={formData.icon}
          onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="カスタムアイコン"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          色
        </label>
        <div className="grid grid-cols-4 gap-2 mb-2">
          {defaultColors.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, color }))}
              className={`h-8 rounded-md border-2 ${
                formData.color === color ? 'border-gray-800' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <input
          type="color"
          value={formData.color}
          onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
          className="w-full h-10 border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
          アクティブ
        </label>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          保存
        </button>
      </div>
    </form>
  )
}

const CategoriesList: React.FC = () => {
  const { categories, isLoading, initStore, addCategory, updateCategory, deleteCategory } = useCategoryStore()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>()

  useEffect(() => {
    initStore()
  }, [initStore])

  const handleSave = async (categoryData: CategoryInput) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryData)
      } else {
        await addCategory(categoryData)
      }
      setIsFormOpen(false)
      setEditingCategory(undefined)
    } catch (error) {
      console.error('Failed to save category:', error)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('このカテゴリを削除しますか？')) {
      try {
        await deleteCategory(id)
      } catch (error) {
        console.error('Failed to delete category:', error)
        alert('デフォルトカテゴリは削除できません。')
      }
    }
  }

  if (isLoading) {
    return <div className="text-center">読み込み中...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">カテゴリ管理</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          新しいカテゴリを追加
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">
            {editingCategory ? 'カテゴリを編集' : '新しいカテゴリを追加'}
          </h3>
          <CategoryForm
            category={editingCategory}
            onSave={handleSave}
            onCancel={() => {
              setIsFormOpen(false)
              setEditingCategory(undefined)
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{category.icon}</span>
                <h3 className="font-medium">{category.name}</h3>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEdit(category)}
                  className="p-1 text-gray-400 hover:text-blue-600"
                >
                  ✏️
                </button>
                {!category.isDefault && (
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <div className="flex space-x-1 text-xs">
                {category.isDefault && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded">
                    デフォルト
                  </span>
                )}
                {!category.isActive && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">
                    非アクティブ
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoriesList
