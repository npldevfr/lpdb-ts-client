import { describe, it, expect } from 'vitest'
import { buildQueryString } from '../src/utils/query-builder'

describe('buildQueryString', () => {
  it('should return empty string for empty params', () => {
    expect(buildQueryString({})).toBe('')
  })

  it('should build query string from single param', () => {
    expect(buildQueryString({ wiki: 'dota2' })).toBe('?wiki=dota2')
  })

  it('should build query string from multiple params', () => {
    const result = buildQueryString({ wiki: 'dota2', limit: 10 })
    expect(result).toBe('?wiki=dota2&limit=10')
  })

  it('should ignore undefined values', () => {
    const result = buildQueryString({ wiki: 'dota2', conditions: undefined, limit: 5 })
    expect(result).toBe('?wiki=dota2&limit=5')
  })

  it('should convert numbers to strings', () => {
    const result = buildQueryString({ limit: 100, offset: 50 })
    expect(result).toBe('?limit=100&offset=50')
  })

  it('should handle special characters', () => {
    const result = buildQueryString({ conditions: '[[pagename::Test/Page]]' })
    expect(result).toContain('conditions=')
    expect(result).toContain(encodeURIComponent('[[pagename::Test/Page]]'))
  })
})
