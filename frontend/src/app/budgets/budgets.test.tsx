import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Budgets } from './budgets'

describe('Budgets', () => {
  it('renders budgets title', () => {
    render(<Budgets />)
    expect(screen.getByText('予算管理')).toBeInTheDocument()
  })

  it('renders add budget button', () => {
    render(<Budgets />)
    expect(screen.getByText('➕ 新しい予算')).toBeInTheDocument()
  })

  it('displays empty state when no budgets exist', () => {
    render(<Budgets />)

    expect(screen.getByText('予算が設定されていません')).toBeInTheDocument()
    expect(screen.getByText('予算を設定して支出を管理しましょう')).toBeInTheDocument()
  })
})
