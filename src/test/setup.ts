import '@testing-library/jest-dom/vitest'

Object.defineProperty(window, 'scrollTo', {
  value: () => undefined,
  writable: true,
})

Object.defineProperty(document, 'execCommand', {
  configurable: true,
  value: () => true,
})

Object.defineProperty(window, 'indexedDB', {
  configurable: true,
  value: {
    open: () => undefined,
  },
})

Object.defineProperty(window, 'fetch', {
  configurable: true,
  value: () => Promise.resolve(new Response()),
})
