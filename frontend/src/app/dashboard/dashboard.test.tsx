import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Dashboard } from './dashboard'

describe('Dashboard', () => {
  it('renders dashboard title', () => {
    render(<Dashboard />)
    expect(screen.getByText('ダッシュボード')).toBeInTheDocument()
  })

  it('renders all dashboard sections', () => {
    render(<Dashboard />)

    expect(screen.getByText('今月の支出')).toBeInTheDocument()
    expect(screen.getByText('今月の予算')).toBeInTheDocument()
    expect(screen.getByText('立て替え残高')).toBeInTheDocument()
    expect(screen.getByText('グループ精算')).toBeInTheDocument()
  })

  it('renders stats cards', () => {
    render(<Dashboard />)

    // 統計カードの表示を確認
    expect(screen.getByText('今月の支出')).toBeInTheDocument()
    expect(screen.getByText('今月の予算')).toBeInTheDocument()
    expect(screen.getByText('立て替え残高')).toBeInTheDocument()
    expect(screen.getByText('グループ精算')).toBeInTheDocument()
  })

  it('displays placeholder amounts', () => {
    render(<Dashboard />)

    // 各カードに¥0が表示されることを確認
    const amounts = screen.getAllByText('¥0')
    expect(amounts).toHaveLength(3)

    // 0件が表示されることを確認
    expect(screen.getByText('0件')).toBeInTheDocument()
  })

  it('renders recent transactions section', () => {
    render(<Dashboard />)

    expect(screen.getByText('最近の取引')).toBeInTheDocument()
    expect(screen.getByText('すべて表示')).toBeInTheDocument()
    expect(screen.getByText('まだ取引がありません')).toBeInTheDocument()
  })
})
