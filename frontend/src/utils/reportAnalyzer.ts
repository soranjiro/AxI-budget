import { Transaction, Budget } from '@/types'

export interface MonthlyData {
  month: string
  expense: number
  income: number
  budget: number
}

export interface CategoryData {
  category: string
  amount: number
  percentage: number
  color: string
}

export interface BudgetAnalysis {
  budgetId: string
  budgetName: string
  budgetAmount: number
  spent: number
  remaining: number
  percentage: number
  status: 'safe' | 'warning' | 'over'
}

export interface MonthlyComparison {
  month: string
  thisYear: number
  lastYear?: number
}

const CATEGORY_COLORS = {
  '食費': '#FF6384',
  '交通費': '#36A2EB',
  '娯楽費': '#FFCE56',
  '生活費': '#4BC0C0',
  'その他': '#9966FF',
}

export class ReportAnalyzer {
  constructor(
    private transactions: Transaction[],
    private budgets: Budget[]
  ) {}

  // 月次データの生成（過去12ヶ月）
  getMonthlyData(): MonthlyData[] {
    const monthlyData: MonthlyData[] = []
    const now = new Date()

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = date.toISOString().slice(0, 7) // YYYY-MM

      const monthTransactions = this.transactions.filter(t =>
        t.date.startsWith(monthKey)
      )

      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

      // 月次予算の合計
      const budget = this.budgets
        .filter(b => b.period === 'monthly')
        .reduce((sum, b) => sum + b.amount, 0)

      monthlyData.push({
        month: date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short' }),
        expense,
        income,
        budget,
      })
    }

    return monthlyData
  }

  // カテゴリ別支出分析（今月）
  getCategoryAnalysis(): CategoryData[] {
    const currentMonth = new Date().toISOString().slice(0, 7)
    const thisMonthExpenses = this.transactions.filter(t =>
      t.date.startsWith(currentMonth) && t.type === 'expense'
    )

    const categoryTotals = thisMonthExpenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)

    const totalExpense = Object.values(categoryTotals).reduce((sum: number, amount: number) => sum + amount, 0)

    return Object.entries(categoryTotals)
      .map(([category, amount]: [string, number]) => ({
        category,
        amount,
        percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
        color: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || '#gray',
      }))
      .sort((a, b) => b.amount - a.amount)
  }

  // 予算分析
  getBudgetAnalysis(): BudgetAnalysis[] {
    const currentMonth = new Date().toISOString().slice(0, 7)

    return this.budgets.map(budget => {
      const budgetTransactions = this.transactions.filter(t =>
        t.date.startsWith(currentMonth) &&
        t.type === 'expense' &&
        (t.budgetId === budget.id || t.category === budget.category)
      )

      const spent = budgetTransactions.reduce((sum, t) => sum + t.amount, 0)
      const remaining = budget.amount - spent
      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0

      let status: 'safe' | 'warning' | 'over' = 'safe'
      if (percentage >= 100) status = 'over'
      else if (percentage >= 80) status = 'warning'

      return {
        budgetId: budget.id,
        budgetName: budget.name,
        budgetAmount: budget.amount,
        spent,
        remaining,
        percentage,
        status,
      }
    })
  }

  // 日次支出トレンド（今月）
  getDailyTrend() {
    const currentMonth = new Date().toISOString().slice(0, 7)
    const thisMonthTransactions = this.transactions.filter(t =>
      t.date.startsWith(currentMonth) && t.type === 'expense'
    )

    const dailyData = thisMonthTransactions.reduce((acc, t) => {
      const day = parseInt(t.date.split('-')[2])
      acc[day] = (acc[day] || 0) + t.amount
      return acc
    }, {} as Record<number, number>)

    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
    const result = []

    for (let day = 1; day <= daysInMonth; day++) {
      result.push({
        day: day.toString(),
        amount: dailyData[day] || 0,
      })
    }

    return result
  }

  // 立て替え分析
  getAdvanceAnalysis() {
    const advanceTransactions = this.transactions.filter(t => t.transactionType === 'advance')

    const totalAdvance = advanceTransactions.reduce((sum, t) => sum + t.amount, 0)
    const monthlyAdvances = advanceTransactions.reduce((acc, t) => {
      const month = t.date.slice(0, 7)
      acc[month] = (acc[month] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)

    return {
      totalAdvance,
      monthlyAdvances: Object.entries(monthlyAdvances)
        .map(([month, amount]) => ({
          month: new Date(month + '-01').toLocaleDateString('ja-JP', { year: 'numeric', month: 'short' }),
          amount,
        }))
        .sort((a, b) => a.month.localeCompare(b.month)),
      count: advanceTransactions.length,
    }
  }

  // 統計サマリー
  getStatsSummary() {
    const currentMonth = new Date().toISOString().slice(0, 7)
    const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7)

    const thisMonthExpenses = this.transactions.filter(t =>
      t.date.startsWith(currentMonth) && t.type === 'expense'
    )
    const lastMonthExpenses = this.transactions.filter(t =>
      t.date.startsWith(lastMonth) && t.type === 'expense'
    )

    const thisMonthTotal = thisMonthExpenses.reduce((sum, t) => sum + t.amount, 0)
    const lastMonthTotal = lastMonthExpenses.reduce((sum, t) => sum + t.amount, 0)
    const changePercentage = lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0

    const avgDailyExpense = thisMonthTotal / new Date().getDate()
    const totalBudget = this.budgets.reduce((sum, b) => sum + b.amount, 0)

    return {
      thisMonthTotal,
      lastMonthTotal,
      changePercentage,
      avgDailyExpense,
      totalBudget,
      budgetUsagePercentage: totalBudget > 0 ? (thisMonthTotal / totalBudget) * 100 : 0,
    }
  }
}
