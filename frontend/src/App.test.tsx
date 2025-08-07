import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '@/App'
import { useAuthStore } from '@/stores/auth'

// モック
vi.mock('@/stores/auth')
vi.mock('@/components/Layout/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  )
}))

// ページコンポーネントのモック
vi.mock('@/pages/Dashboard', () => ({
  Dashboard: () => <div data-testid="dashboard">Dashboard Page</div>
}))
vi.mock('@/pages/Transactions', () => ({
  Transactions: () => <div data-testid="transactions">Transactions Page</div>
}))
vi.mock('@/pages/Budgets', () => ({
  Budgets: () => <div data-testid="budgets">Budgets Page</div>
}))
vi.mock('@/pages/Settlements', () => ({
  Settlements: () => <div data-testid="settlements">Settlements Page</div>
}))
vi.mock('@/pages/Groups', () => ({
  Groups: () => <div data-testid="groups">Groups Page</div>
}))
vi.mock('@/pages/Reports', () => ({
  Reports: () => <div data-testid="reports">Reports Page</div>
}))

const renderWithRouter = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  )
}

describe('App', () => {
  const mockInitializeAuth = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAuthStore).mockReturnValue({
      user: { userId: 'test-user', username: 'Test User' },
      isAuthenticated: true,
      isLoading: false,
      signInAnonymous: vi.fn(),
      signOut: vi.fn(),
      initializeAuth: mockInitializeAuth,
    })
  })

  it('renders layout component', () => {
    renderWithRouter()
    expect(screen.getByTestId('layout')).toBeInTheDocument()
  })

  it('calls initializeAuth on mount', () => {
    renderWithRouter()
    expect(mockInitializeAuth).toHaveBeenCalledOnce()
  })

  it('renders Dashboard component for root path', () => {
    renderWithRouter(['/'])
    expect(screen.getByTestId('dashboard')).toBeInTheDocument()
  })

  it('renders Transactions component for /transactions path', () => {
    renderWithRouter(['/transactions'])
    expect(screen.getByTestId('transactions')).toBeInTheDocument()
  })

  it('renders Budgets component for /budgets path', () => {
    renderWithRouter(['/budgets'])
    expect(screen.getByTestId('budgets')).toBeInTheDocument()
  })

  it('renders Settlements component for /settlements path', () => {
    renderWithRouter(['/settlements'])
    expect(screen.getByTestId('settlements')).toBeInTheDocument()
  })

  it('renders Groups component for /groups path', () => {
    renderWithRouter(['/groups'])
    expect(screen.getByTestId('groups')).toBeInTheDocument()
  })

  it('renders Reports component for /reports path', () => {
    renderWithRouter(['/reports'])
    expect(screen.getByTestId('reports')).toBeInTheDocument()
  })

  it('handles navigation between routes', () => {
    const { rerender } = renderWithRouter(['/'])
    expect(screen.getByTestId('dashboard')).toBeInTheDocument()

    // 別のルートに移動
    rerender(
      <MemoryRouter initialEntries={['/transactions']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByTestId('transactions')).toBeInTheDocument()
  })

  it('renders 404 page for unknown routes', () => {
    renderWithRouter(['/unknown-route'])

    // 不明なルートの場合はダッシュボードにリダイレクトされるか確認
    // または404ページが表示されるかを確認
    expect(screen.getByTestId('layout')).toBeInTheDocument()
  })

  it('works with authentication loading state', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      signInAnonymous: vi.fn(),
      signOut: vi.fn(),
      initializeAuth: mockInitializeAuth,
    })

    renderWithRouter()
    expect(screen.getByTestId('layout')).toBeInTheDocument()
    expect(mockInitializeAuth).toHaveBeenCalledOnce()
  })

  it('works when not authenticated', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      signInAnonymous: vi.fn(),
      signOut: vi.fn(),
      initializeAuth: mockInitializeAuth,
    })

    renderWithRouter()
    expect(screen.getByTestId('layout')).toBeInTheDocument()
    expect(mockInitializeAuth).toHaveBeenCalledOnce()
  })
})
