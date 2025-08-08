import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from './Header'
import { useAuthStore } from '@/stores/auth'

// モック
vi.mock('@/stores/auth')

describe('Header', () => {
  const mockSignOut = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAuthStore).mockReturnValue({
      user: {
        userId: 'test-user',
        username: 'Test User',
      },
      isAuthenticated: true,
      isLoading: false,
      signOut: mockSignOut,
      initializeAuth: vi.fn(),
    })
  })

  it('renders header with app title', () => {
    render(<Header onMobileMenuClick={() => {}} isMobileMenuOpen={false} />)
    expect(screen.getByText('AxI Budget')).toBeInTheDocument()
  })

  it('displays user information when authenticated', () => {
    render(<Header onMobileMenuClick={() => {}} isMobileMenuOpen={false} />)
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('renders logout button', () => {
    render(<Header onMobileMenuClick={() => {}} isMobileMenuOpen={false} />)
    expect(screen.getByText('ログアウト')).toBeInTheDocument()
  })

  it('calls signOut when logout button is clicked', () => {
    render(<Header onMobileMenuClick={() => {}} isMobileMenuOpen={false} />)
    const logoutButton = screen.getByText('ログアウト')
    fireEvent.click(logoutButton)
    expect(mockSignOut).toHaveBeenCalled()
  })
})
