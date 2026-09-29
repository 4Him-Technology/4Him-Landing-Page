import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => cleanup())

// jsdom nao implementa IntersectionObserver nem matchMedia; o site usa os dois
// para as animacoes de entrada. Aqui tudo entra "visivel" na hora.
class IO {
  constructor(cb) { this.cb = cb }
  observe(el) { this.cb([{ isIntersecting: true, target: el }]) }
  disconnect() {}
  unobserve() {}
}
globalThis.IntersectionObserver = IO
window.matchMedia = window.matchMedia || ((q) => ({
  matches: q.includes('reduce'), media: q,
  addEventListener() {}, removeEventListener() {},
}))
Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || function () {}
