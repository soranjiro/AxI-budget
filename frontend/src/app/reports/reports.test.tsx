import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Reports } from './reports'

describe('Reports', () => {
  it('renders reports title', () => {
    render(<Reports />)
    expect(screen.getByText('レポート・分析')).toBeInTheDocument()
  })

  it('displays empty state when no data exists', () => {
    render(<Reports />)

    expect(screen.getByText('データが不足しています')).toBeInTheDocument()
    expect(screen.getByText('取引データが蓄積されるとレポートが表示されます')).toBeInTheDocument()
  })
})
