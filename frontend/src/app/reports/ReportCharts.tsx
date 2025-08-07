import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { MonthlyData, CategoryData, BudgetAnalysis } from '@/utils/reportAnalyzer'

interface MonthlyChartProps {
  data: MonthlyData[]
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`} />
          <Tooltip
            formatter={(value: number) => [`¥${value.toLocaleString()}`, '']}
            labelStyle={{ color: '#374151' }}
          />
          <Bar dataKey="expense" fill="#EF4444" name="支出" />
          <Bar dataKey="income" fill="#10B981" name="収入" />
          <Bar dataKey="budget" fill="#6B7280" name="予算" fillOpacity={0.3} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

interface CategoryPieChartProps {
  data: CategoryData[]
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        <p>今月の支出データがありません</p>
      </div>
    )
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ category, percentage }) => `${category} ${percentage.toFixed(1)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="amount"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

interface BudgetProgressProps {
  data: BudgetAnalysis[]
}

export function BudgetProgress({ data }: BudgetProgressProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>予算が設定されていません</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {data.map((budget) => (
        <div key={budget.budgetId} className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-gray-900">{budget.budgetName}</h4>
            <span className={`text-sm px-2 py-1 rounded ${
              budget.status === 'safe' ? 'bg-green-100 text-green-700' :
              budget.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {budget.status === 'safe' ? '安全' :
               budget.status === 'warning' ? '注意' : '超過'}
            </span>
          </div>

          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>¥{budget.spent.toLocaleString()} / ¥{budget.budgetAmount.toLocaleString()}</span>
              <span>{budget.percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className={`h-2 rounded-full ${
                  budget.status === 'safe' ? 'bg-green-500' :
                  budget.status === 'warning' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${Math.min(budget.percentage, 100)}%` }}
              />
            </div>
          </div>

          <p className={`text-sm ${budget.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            残り: ¥{budget.remaining.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  )
}

interface DailyTrendChartProps {
  data: Array<{ day: string; amount: number }>
}

export function DailyTrendChart({ data }: DailyTrendChartProps) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
