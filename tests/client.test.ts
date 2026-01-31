import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { LPDBClient, LPDBError } from '../src'

describe('LPDBClient', () => {
  const mockApiKey = 'test-api-key'

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('constructor', () => {
    it('should create client with default base URL', () => {
      const client = new LPDBClient({ apiKey: mockApiKey })
      expect(client).toBeInstanceOf(LPDBClient)
    })

    it('should create client with custom base URL', () => {
      const client = new LPDBClient({
        apiKey: mockApiKey,
        baseUrl: 'https://custom.api.com'
      })
      expect(client).toBeInstanceOf(LPDBClient)
    })
  })

  describe('endpoint', () => {
    it('should return a QueryBuilder instance', () => {
      const client = new LPDBClient({ apiKey: mockApiKey })
      const builder = client.endpoint('/player')
      expect(builder).toBeDefined()
      expect(typeof builder.wiki).toBe('function')
      expect(typeof builder.execute).toBe('function')
    })
  })

  describe('executeQuery', () => {
    it('should make GET request with correct URL and headers', async () => {
      const mockResponse = { result: [{ id: '1', name: 'Player' }] }
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      } as Response)

      const client = new LPDBClient({ apiKey: mockApiKey })
      const result = await client.endpoint('/player').wiki('dota2').limit(10).execute()

      expect(fetch).toHaveBeenCalledWith(
        'https://api.liquipedia.net/api/v3/player?wiki=dota2&limit=10',
        {
          method: 'GET',
          headers: {
            'Authorization': `Apikey ${mockApiKey}`,
            'Accept': 'application/json'
          }
        }
      )
      expect(result).toEqual(mockResponse)
    })

    it('should throw LPDBError on non-ok response', async () => {
      const errorData = { error: ['Invalid API key'] }
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: () => Promise.resolve(errorData)
      } as Response)

      const client = new LPDBClient({ apiKey: mockApiKey })

      await expect(
        client.endpoint('/player').wiki('dota2').execute()
      ).rejects.toThrow(LPDBError)
    })

    it('should include error data in LPDBError', async () => {
      const errorData = { error: ['Rate limit exceeded'] }
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: () => Promise.resolve(errorData)
      } as Response)

      const client = new LPDBClient({ apiKey: mockApiKey })

      try {
        await client.endpoint('/player').wiki('dota2').execute()
      } catch (error) {
        expect(error).toBeInstanceOf(LPDBError)
        expect((error as LPDBError).status).toBe(429)
        expect((error as LPDBError).data).toEqual(errorData)
      }
    })
  })
})

describe('LPDBError', () => {
  it('should create error with correct properties', () => {
    const error = new LPDBError('Test error', 404, { error: ['Not found'] })

    expect(error.message).toBe('Test error')
    expect(error.name).toBe('LPDBError')
    expect(error.status).toBe(404)
    expect(error.data).toEqual({ error: ['Not found'] })
  })

  it('should be instanceof Error', () => {
    const error = new LPDBError('Test', 500, {})
    expect(error).toBeInstanceOf(Error)
  })
})
