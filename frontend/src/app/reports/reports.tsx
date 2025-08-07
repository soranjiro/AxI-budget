import { useMemo, useState } from 'react'
import { useTransactionStore } from '@/stores/transaction'
import { useBudgetStore } from '@/stores/budget'
import { GuestNotice } from '@/components/GuestNotice'
import { ReportAnalyzer } from '@/utils/reportAnalyzer'
import { MonthlyChart, CategoryPieChart, BudgetProgress, DailyTrendChart } from './ReportCharts'
import { StatsSummary } from './StatsSummary'
import { AdvanceAnalysis } from './AdvanceAnalysis'

export function Reports() {
  const { transactions } = useTransactionStore()
  const { budgets } = useBudgetStore()
  const [activeTab, setActiveTab] = useState<'overview' | 'budget' | 'category' | 'trend' | 'advance'>('overview')

  const analyzer = useMemo(() =>
    new ReportAnalyzer(transactions, budgets),
    [transactions, budgets]
  )

  const monthlyData = useMemo(() => analyzer.getMonthlyData(), [analyzer])
  const categoryData = useMemo(() => analyzer.getCategoryAnalysis(), [analyzer])
  const budgetAnalysis = useMemo(() => analyzer.getBudgetAnalysis(), [analyzer])
  const dailyTrend = useMemo(() => analyzer.getDailyTrend(), [analyzer])
  const advanceAnalysis = useMemo(() => analyzer.getAdvanceAnalysis(), [analyzer])
  const statsSummary = useMemo(() => analyzer.getStatsSummary(), [analyzer])

  const hasData = transactions.length > 0

  const tabs = [
    { id: 'overview', label: '概要', icon: '📊' },
    { id: 'budget', label: '予算分析', icon: '💰' },
    { id: 'category', label: 'カテゴリ分析', icon: '🏷️' },
    { id: 'trend', label: 'トレンド', icon: '📈' },
    { id: 'advance', label: '立て替え', icon: '💸' },
  ] as const

  return (
    <div className="space-y-6 pt-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">レポート・分析</h1>
      </div>

      <GuestNotice />

      {!hasData ? (
        <div className="card">
          <div className="text-center py-12 text-gray-500">
            <span className="text-4xl mb-4 block">📊</span>
            <p className="text-lg font-medium">データが不足しています</p>
            <p className="text-sm mt-2">取引データが蓄積されるとレポートが表示されます</p>
            <div className="mt-6">
              <a
                href="/transactions"
                className="btn-primary inline-flex items-center"
              >
                ➕ 取引を追加する
              </a>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* タブナビゲーション */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* タブコンテンツ */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <>
                <StatsSummary {...statsSummary} />

                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">月次収支推移</h3>
                  <MonthlyChart data={monthlyData} />
                </div>

                {categoryData.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">今月のカテゴリ別支出</h3>
                      <CategoryPieChart data={categoryData} />
                    </div>
                    <div className="card">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">カテゴリ別詳細</h3>
                      <div className="space-y-3">
                        {categoryData.map((item) => (
                          <div key={item.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <div
                                className="w-4 h-4 rounded-full mr-3"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="font-medium">{item.category}</span>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">¥{item.amount.toLocaleString()}</p>
                              <p className="text-sm text-gray-500">{item.percentage.toFixed(1)}%</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'budget' && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">予算達成状況</h3>
                <BudgetProgress data={budgetAnalysis} />
              </div>
            )}

            {activeTab === 'category' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">カテゴリ別支出分布</h3>
                  <CategoryPieChart data={categoryData} />
                </div>
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">カテゴリ別ランキング</h3>
                  <div className="space-y-3">
                    {categoryData.map((item, index) => (
                      <div key={item.category} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-gray-400 mr-3">#{index + 1}</span>
                          <div
                            className="w-4 h-4 rounded-full mr-3"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-medium">{item.category}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">¥{item.amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">{item.percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'trend' && (
              <>
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">今月の日次支出トレンド</h3>
                  <DailyTrendChart data={dailyTrend} />
                </div>
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">月次収支推移</h3>
                  <MonthlyChart data={monthlyData} />
                </div>
              </>
            )}

            {activeTab === 'advance' && (
              <AdvanceAnalysis {...advanceAnalysis} />
            )}
          </div>
        </>
      )}
    </div>
  )
}
