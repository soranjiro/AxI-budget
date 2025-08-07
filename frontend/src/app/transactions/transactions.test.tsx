import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Transactions } from './transactions'

describe('Transactions', () => {
  it('renders transactions title', () => {
    render(<Transactions />)
    expect(screen.getByText('取引管理')).toBeInTheDocument()
  })

  it('renders add transaction button', () => {
    render(<Transactions />)
    expect(screen.getByText('➕ 新しい取引')).toBeInTheDocument()
  })

  it('renders filter controls', () => {
    render(<Transactions />)

    expect(screen.getByText('期間')).toBeInTheDocument()
    expect(screen.getByText('種別')).toBeInTheDocument()
    expect(screen.getByText('カテゴリ')).toBeInTheDocument()
    expect(screen.getByText('検索')).toBeInTheDocument()
  })

  it('displays empty state when no transactions exist', () => {
    render(<Transactions />)

    expect(screen.getByText('取引がありません')).toBeInTheDocument()
    expect(screen.getByText('新しい取引を追加してみましょう')).toBeInTheDocument()
  })
})
