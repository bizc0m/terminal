import { afterEach, describe, expect, it, vi } from 'vitest'
import { copyText, createTicketText, downloadTicket, generateDemoCodes } from './terminal'

describe('terminal demo utilities', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('generates marked demo codes with a realistic format', () => {
    const codes = generateDemoCodes(6)

    expect(codes).toHaveLength(6)
    expect(new Set(codes).size).toBe(6)
    expect(codes.every((code) => /^DEMO-[0-9A-Z]{2}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code))).toBe(
      true,
    )
  })

  it('rejects invalid demo counts', () => {
    expect(() => generateDemoCodes(-1)).toThrow(RangeError)
    expect(() => generateDemoCodes(25)).toThrow(RangeError)
    expect(() => generateDemoCodes(1.5)).toThrow(RangeError)
  })

  it('copies through the clipboard API when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    await expect(copyText('DEMO-01-AAAA-BBBB-CCCC')).resolves.toBe('clipboard')
    expect(writeText).toHaveBeenCalledWith('DEMO-01-AAAA-BBBB-CCCC')
  })

  it('uses the textarea fallback when clipboard API is missing', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    })
    const execCommand = vi.spyOn(document, 'execCommand').mockReturnValue(true)

    await expect(copyText('DEMO-01-AAAA-BBBB-CCCC')).resolves.toBe('fallback')
    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(document.querySelector('textarea')).toBeNull()
  })

  it('downloads a local txt ticket', () => {
    const click = vi.fn()
    const createObjectURL = vi.fn().mockReturnValue('blob:ticket')
    const revokeObjectURL = vi.fn()
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      const element = document.createElementNS('http://www.w3.org/1999/xhtml', tagName)
      if (tagName === 'a') {
        Object.defineProperty(element, 'click', { value: click })
      }
      return element as HTMLElement
    })
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: createObjectURL })
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revokeObjectURL })

    downloadTicket('ticket.txt', createTicketText('paid', ['DEMO-01-AAAA-BBBB-CCCC']))

    expect(createObjectURL).toHaveBeenCalledOnce()
    expect(click).toHaveBeenCalledOnce()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:ticket')
  })
})
