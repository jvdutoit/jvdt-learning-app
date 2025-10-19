import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Glossary from '../Glossary'
import PILLARS from '../../data/pillars.json'

const renderGlossary = (initial = ['/glossary']) => render(
  <MemoryRouter initialEntries={initial}>
    <Routes>
      <Route path="/glossary" element={<Glossary />} />
    </Routes>
  </MemoryRouter>
)

function firstSlugFromData(){
  const p0: any = PILLARS[0] || {}
  const term = (p0['term'] || p0['title'] || p0['name'] || '')
  return (term || '').toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

describe('Glossary drawer', () => {
  beforeEach(() => {
    // ensure clipboard.writeText exists and mock it
    if (!('clipboard' in navigator)) {
      ;(navigator as any).clipboard = { writeText: vi.fn().mockResolvedValue(undefined) }
    } else if (!('writeText' in navigator.clipboard)) {
      ;(navigator as any).clipboard.writeText = vi.fn().mockResolvedValue(undefined)
    } else {
      vi.spyOn(navigator.clipboard as any, 'writeText').mockResolvedValue(undefined as any)
    }
    // clear localStorage
    localStorage.clear()
  })

  it('opens a drawer when a term card is clicked and closes with Esc', async () => {
    const user = userEvent.setup()
    renderGlossary()

    const search = screen.getByRole('textbox', { name: /search/i })
    expect(search).toBeInTheDocument()

    // find an article button (the term card) and click it
    const allButtons = await screen.findAllByRole('button')
    const cards = allButtons.filter(b => b.getAttribute('aria-haspopup') === 'dialog')
    expect(cards.length).toBeGreaterThan(0)
    await user.click(cards[0])

    const drawer = await screen.findByTestId('glossary-drawer')
    expect(drawer).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByTestId('glossary-drawer')).not.toBeInTheDocument()
  })

  it('deep-links via ?term= and copy-link works', async () => {
    const slug = firstSlugFromData()
    const user = userEvent.setup()
    renderGlossary([`/glossary?term=${slug}`])

    const drawer = await screen.findByTestId('glossary-drawer')
    expect(drawer).toBeInTheDocument()

    // heading level 2 should be the term
    expect(within(drawer).getByRole('heading', { level: 2 })).toBeTruthy()

    const copy = within(drawer).getByTestId('drawer-copylink')
    await user.click(copy)
    expect(navigator.clipboard.writeText).toHaveBeenCalled()
  })
})
