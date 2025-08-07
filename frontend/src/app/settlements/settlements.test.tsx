import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Settlements } from './settlements'

describe('Settlements', () => {
  it('renders settlements title', () => {
    render(<Settlements />)
    expect(screen.getByText('精算管理')).toBeInTheDocument()
  })

  it('displays empty state when no settlements exist', () => {
    render(<Settlements />)

    expect(screen.getByText('精算がありません')).toBeInTheDocument()
    expect(screen.getByText('立て替えがある場合はここに表示されます')).toBeInTheDocument()
  })
})
