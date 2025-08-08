/**
 * 共通型定義
 */

// 基本的な取引種別
export type TransactionType = 'expense' | 'income' | 'transfer'
export type TransactionSubType = 'personal' | 'advance'

// 口座種別
export type AccountType = 'cash' | 'bank' | 'credit_card' | 'e_money' | 'other'

// 期間
export type BudgetPeriod = 'monthly' | 'yearly'

/**
 * 口座エンティティ
 */
export interface Account {
  id: string
  name: string
  type: AccountType
  balance: number
  creditLimit?: number
  statementDay?: number
  paymentDay?: number
  isActive: boolean
  description?: string
  createdAt: string
  updatedAt: string
}

/**
 * 取引エンティティ（拡張版）
 */
export interface Transaction {
  id: string
  description: string
  amount: number
  category: string
  type: TransactionType
  transactionType: TransactionSubType
  accountId?: string
  toAccountId?: string
  date: string
  tags: string[]
  budgetId?: string
  isIncludedInBudget: boolean
  creditCardStatementDate?: string
  createdAt: string
  updatedAt: string
}

/**
 * 予算エンティティ
 */
export interface Budget {
  id: string
  name: string
  amount: number
  category: string
  period: BudgetPeriod
  spent: number
  createdAt: string
  updatedAt: string
}

/**
 * カテゴリ設定
 */
export interface Category {
  id: string
  name: string
  icon?: string
  color?: string
  isDefault: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * 口座タイプ設定
 */
export interface AccountTypeConfig {
  id: string
  name: string
  type: AccountType
  icon?: string
  color?: string
  isDefault: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * 口座残高計算結果
 */
export interface AccountBalance {
  accountId: string
  currentBalance: number
  availableBalance: number
  pendingAmount: number
}

/**
 * 入力用型（IDや作成日時を除く）
 */
export type TransactionInput = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
export type AccountInput = Omit<Account, 'id' | 'createdAt' | 'updatedAt'>
export type BudgetInput = Omit<Budget, 'id' | 'spent' | 'createdAt' | 'updatedAt'>
export type CategoryInput = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
export type AccountTypeInput = Omit<AccountTypeConfig, 'id' | 'createdAt' | 'updatedAt'>

/**
 * デフォルトカテゴリリスト
 */
export const DEFAULT_CATEGORIES: CategoryInput[] = [
  { name: '食費', icon: '🍽️', color: '#FF6B6B', isDefault: true, isActive: true },
  { name: '交通費', icon: '🚗', color: '#4ECDC4', isDefault: true, isActive: true },
  { name: '娯楽費', icon: '🎮', color: '#45B7D1', isDefault: true, isActive: true },
  { name: '生活費', icon: '🏠', color: '#96CEB4', isDefault: true, isActive: true },
  { name: '医療費', icon: '🏥', color: '#FFEAA7', isDefault: true, isActive: true },
  { name: '教育費', icon: '📚', color: '#DDA0DD', isDefault: true, isActive: true },
  { name: '衣服費', icon: '👕', color: '#FFB6C1', isDefault: true, isActive: true },
  { name: 'その他', icon: '📝', color: '#95A5A6', isDefault: true, isActive: true },
]

/**
 * デフォルト口座タイプリスト
 */
export const DEFAULT_ACCOUNT_TYPES: AccountTypeInput[] = [
  { name: '現金', type: 'cash', icon: '💵', color: '#2ECC71', isDefault: true, isActive: true },
  { name: '銀行口座', type: 'bank', icon: '🏦', color: '#3498DB', isDefault: true, isActive: true },
  { name: 'クレジットカード', type: 'credit_card', icon: '💳', color: '#E74C3C', isDefault: true, isActive: true },
  { name: '電子マネー', type: 'e_money', icon: '📱', color: '#9B59B6', isDefault: true, isActive: true },
  { name: 'その他', type: 'other', icon: '❓', color: '#95A5A6', isDefault: true, isActive: true },
]
