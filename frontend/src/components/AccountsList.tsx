import React, { useState, useEffect } from 'react'
import { Account, AccountInput, AccountType } from '../types'
import { useAccountStore } from '../stores/account'
import { useAccountTypeStore } from '../stores/accountType'

const AccountForm: React.FC<{
  account?: Account
  onSave: (account: AccountInput) => void
  onCancel: () => void
}> = ({ account, onSave, onCancel }) => {
  const { accountTypes } = useAccountTypeStore()
  const [formData, setFormData] = useState<AccountInput>({
    name: account?.name || '',
    type: account?.type || 'cash',
    balance: account?.balance || 0,
    creditLimit: account?.creditLimit || undefined,
    statementDay: account?.statementDay || undefined,
    paymentDay: account?.paymentDay || undefined,
    isActive: account?.isActive ?? true,
    description: account?.description || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleTypeChange = (type: AccountType) => {
    setFormData(prev => ({
      ...prev,
      type,
      // クレジットカード以外の場合は関連フィールドをクリア
      creditLimit: type === 'credit_card' ? prev.creditLimit : undefined,
      statementDay: type === 'credit_card' ? prev.statementDay : undefined,
      paymentDay: type === 'credit_card' ? prev.paymentDay : undefined,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          口座名
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
          口座タイプ
        </label>
        <select
          value={formData.type}
          onChange={(e) => handleTypeChange(e.target.value as AccountType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {accountTypes.filter(type => type.isActive).map(type => (
            <option key={type.id} value={type.type}>
              {type.icon} {type.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          初期残高
        </label>
        <input
          type="number"
          value={formData.balance}
          onChange={(e) => setFormData(prev => ({ ...prev, balance: Number(e.target.value) }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          step="0.01"
        />
      </div>

      {formData.type === 'credit_card' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              利用限度額
            </label>
            <input
              type="number"
              value={formData.creditLimit || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, creditLimit: Number(e.target.value) || undefined }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              step="0.01"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                締め日
              </label>
              <select
                value={formData.statementDay || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, statementDay: Number(e.target.value) || undefined }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}日</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                引き落とし日
              </label>
              <select
                value={formData.paymentDay || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, paymentDay: Number(e.target.value) || undefined }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}日</option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          説明（オプション）
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
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

const AccountsList: React.FC = () => {
  const { accounts, isLoading, initStore, addAccount, updateAccount, deleteAccount } = useAccountStore()
  const { initStore: initAccountTypes } = useAccountTypeStore()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | undefined>()

  useEffect(() => {
    initStore()
    initAccountTypes()
  }, [initStore, initAccountTypes])

  const handleSave = async (accountData: AccountInput) => {
    try {
      if (editingAccount) {
        await updateAccount(editingAccount.id, accountData)
      } else {
        await addAccount(accountData)
      }
      setIsFormOpen(false)
      setEditingAccount(undefined)
    } catch (error) {
      console.error('Failed to save account:', error)
    }
  }

  const handleEdit = (account: Account) => {
    setEditingAccount(account)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('この口座を削除しますか？')) {
      try {
        await deleteAccount(id)
      } catch (error) {
        console.error('Failed to delete account:', error)
      }
    }
  }

  const getAccountTypeIcon = (type: AccountType) => {
    const typeMap = {
      cash: '💵',
      bank: '🏦',
      credit_card: '💳',
      e_money: '📱',
      other: '❓'
    }
    return typeMap[type] || '❓'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount)
  }

  if (isLoading) {
    return <div className="text-center">読み込み中...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">口座管理</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          新しい口座を追加
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">
            {editingAccount ? '口座を編集' : '新しい口座を追加'}
          </h3>
          <AccountForm
            account={editingAccount}
            onSave={handleSave}
            onCancel={() => {
              setIsFormOpen(false)
              setEditingAccount(undefined)
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <div key={account.id} className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{getAccountTypeIcon(account.type)}</span>
                <h3 className="font-medium">{account.name}</h3>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEdit(account)}
                  className="p-1 text-gray-400 hover:text-blue-600"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(account.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  🗑️
                </button>
              </div>
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">残高:</span>
                <span className={account.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(account.balance)}
                </span>
              </div>

              {account.type === 'credit_card' && account.creditLimit && (
                <div className="flex justify-between">
                  <span className="text-gray-600">限度額:</span>
                  <span>{formatCurrency(account.creditLimit)}</span>
                </div>
              )}

              {!account.isActive && (
                <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                  非アクティブ
                </span>
              )}
            </div>

            {account.description && (
              <p className="mt-2 text-xs text-gray-500">{account.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AccountsList
