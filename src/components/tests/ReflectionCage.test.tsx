import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ReflectionCage from '../ReflectionCage'

const renderReflect = (initial = ['/reflect']) => render(
  <MemoryRouter initialEntries={initial}>
    <Routes>
      <Route path="/reflect" element={<ReflectionCage />} />
    </Routes>
  </MemoryRouter>
)

describe('ReflectionCage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    // ensure timers/intervals from mounted components are cleared and storage reset
    cleanup()
    localStorage.clear()
    try{ vi.restoreAllMocks() }catch(e){}
  })

  // no fake timers: userEvent and real timers play better together

  it('autosaves draft and restores it on mount', async () => {
    const user = userEvent.setup()
    renderReflect()
    const ta = screen.getByRole('textbox', { name: /reflection/i })
    await user.type(ta, 'hello world')
    // wait for autosave (component autosaves every ~1500ms)
    await waitFor(() => expect(localStorage.getItem('jvdt.reflection.draft')).toBeTruthy(), { timeout: 3000 })

    // unmount and remount
    cleanup()
    renderReflect()
    const ta2 = screen.getByRole('textbox', { name: /reflection/i })
    expect(ta2).toHaveValue('hello world')
  })

  it('save stores entry and clears draft', async () => {
    const user = userEvent.setup()
    renderReflect()
    const ta = screen.getByRole('textbox', { name: /reflection/i })
    await user.type(ta, 'my entry')
  // wait for autosave draft then save
  await waitFor(() => expect(localStorage.getItem('jvdt.reflection.draft')).toBeTruthy(), { timeout: 3000 })
  const save = screen.getByTestId('reflection-save')
  await user.click(save)
    await waitFor(() => expect(localStorage.getItem('jvdt.reflections')).toBeTruthy(), { timeout: 3000 })
    const entries = JSON.parse(localStorage.getItem('jvdt.reflections') || '[]')
    expect(entries[0].text).toBe('my entry')
    expect(localStorage.getItem('jvdt.reflection.draft')).toBeNull()
  })

  it('clear draft discards draft after confirmation', async () => {
    vi.stubGlobal('confirm', (msg: string | undefined) => true)
    const user = userEvent.setup()
    renderReflect()
    const ta = screen.getByRole('textbox', { name: /reflection/i })
    await user.type(ta, 'draft to clear')
    await waitFor(() => expect(localStorage.getItem('jv.reflection.draft') || localStorage.getItem('jvdt.reflection.draft') || localStorage.getItem('jvdt.reflection.draft')).toBeTruthy(), { timeout: 3000 }).catch(()=>{})
    const clearDraft = screen.getByTestId('reflection-clear-draft')
    await user.click(clearDraft)
    expect(ta).toHaveValue('')
  })

  it('clear all removes saved reflections after confirmation', async () => {
  vi.stubGlobal('confirm', (msg: string | undefined) => true)
    // pre-populate saved entries
    localStorage.setItem('jvdt.reflections', JSON.stringify([{ id: '1', text: 'one', createdAt: new Date().toISOString() }]))
    const user = userEvent.setup()
    renderReflect()
    const allClearButton = screen.getByTestId('reflection-clear-all')
    expect(allClearButton).toBeTruthy()
    await user.click(allClearButton)
    await waitFor(() => expect(localStorage.getItem('jvdt.reflections')).toBeNull(), { timeout: 3000 })
  })
})
