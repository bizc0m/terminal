import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

describe('Terminal app', () => {
  it('opens and closes the Coopro handoff modal', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'OBTENIR LE PACK' }))
    await user.click(screen.getByRole('button', { name: 'OUVRIR COOPRO' }))

    expect(screen.getByRole('dialog', { name: 'Copiez vos codes puis collez-les dans Coopro' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'FERMER' }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('does not use browser storage, cookies, indexedDB, or tracker endpoints during issuing', async () => {
    const user = userEvent.setup()
    const localStorageSet = vi.spyOn(Storage.prototype, 'setItem')
    const cookieSetter = vi.spyOn(Document.prototype, 'cookie', 'set')
    const indexedDBOpen = vi.spyOn(indexedDB, 'open')
    const fetchSpy = vi.spyOn(window, 'fetch')

    render(<App />)
    await user.click(screen.getByRole('button', { name: 'SIGNER SYMBOLIQUEMENT' }))

    expect(localStorageSet).not.toHaveBeenCalled()
    expect(cookieSetter).not.toHaveBeenCalled()
    expect(indexedDBOpen).not.toHaveBeenCalled()
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(screen.getByText('YOU ARE NOT THE PRODUCT.')).toBeInTheDocument()
  })
})
