import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Groups } from './groups'

describe('Groups', () => {
  it('renders groups title', () => {
    render(<Groups />)
    expect(screen.getByText('グループ管理')).toBeInTheDocument()
  })

  it('renders group action buttons', () => {
    render(<Groups />)

    expect(screen.getByText('🔗 グループに参加')).toBeInTheDocument()
    expect(screen.getByText('➕ グループ作成')).toBeInTheDocument()
  })

  it('displays empty state when no groups exist', () => {
    render(<Groups />)

    expect(screen.getByText('参加しているグループがありません')).toBeInTheDocument()
    expect(screen.getByText('グループを作成するか、参加コードで参加しましょう')).toBeInTheDocument()
  })
})
