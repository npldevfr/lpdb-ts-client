import { describe, it, expect } from 'vitest'
import { LPDBClient, QueryBuilder } from '../src'

describe('QueryBuilder', () => {
  const mockApiKey = 'test-api-key'
  const client = new LPDBClient({ apiKey: mockApiKey })

  describe('method chaining', () => {
    it('should support chaining multiple methods', () => {
      const builder = client
        .endpoint('/player')
        .wiki('dota2')
        .conditions('[[nationality::Sweden]]')
        .limit(10)
        .offset(20)
        .order('id ASC')

      expect(builder).toBeInstanceOf(QueryBuilder)
    })

    it('should build correct params object', () => {
      const { params } = client
        .endpoint('/player')
        .wiki('dota2')
        .conditions('[[id::TaeJa]]')
        .limit(5)
        .build()

      expect(params).toEqual({
        wiki: 'dota2',
        conditions: '[[id::TaeJa]]',
        limit: 5
      })
    })
  })

  describe('standard endpoint params', () => {
    it('should accept all standard params on /player', () => {
      const { params } = client
        .endpoint('/player')
        .wiki('starcraft2')
        .conditions('[[race::Terran]]')
        .query('id, name, nationality')
        .limit(50)
        .offset(100)
        .order('name ASC')
        .groupby('nationality')
        .build()

      expect(params).toEqual({
        wiki: 'starcraft2',
        conditions: '[[race::Terran]]',
        query: 'id, name, nationality',
        limit: 50,
        offset: 100,
        order: 'name ASC',
        groupby: 'nationality'
      })
    })
  })

  describe('/match endpoint specific params', () => {
    it('should accept rawstreams param', () => {
      const { params } = client
        .endpoint('/match')
        .wiki('counterstrike')
        .rawstreams('true')
        .build()

      expect(params.rawstreams).toBe('true')
    })

    it('should accept streamurls param', () => {
      const { params } = client
        .endpoint('/match')
        .wiki('valorant')
        .streamurls('true')
        .build()

      expect(params.streamurls).toBe('true')
    })

    it('should accept both stream params together', () => {
      const { params } = client
        .endpoint('/match')
        .wiki('dota2')
        .rawstreams('true')
        .streamurls('false')
        .limit(10)
        .build()

      expect(params).toEqual({
        wiki: 'dota2',
        rawstreams: 'true',
        streamurls: 'false',
        limit: 10
      })
    })
  })

  describe('/teamtemplate endpoint specific params', () => {
    it('should accept template param', () => {
      const { params } = client
        .endpoint('/teamtemplate')
        .wiki('dota2')
        .template('teamliquid')
        .build()

      expect(params).toEqual({
        wiki: 'dota2',
        template: 'teamliquid'
      })
    })

    it('should accept date param for historical logos', () => {
      const { params } = client
        .endpoint('/teamtemplate')
        .wiki('leagueoflegends')
        .template('t1')
        .date('2020-01-01')
        .build()

      expect(params).toEqual({
        wiki: 'leagueoflegends',
        template: 't1',
        date: '2020-01-01'
      })
    })
  })

  describe('/teamtemplatelist endpoint specific params', () => {
    it('should accept pagination param', () => {
      const { params } = client
        .endpoint('/teamtemplatelist')
        .wiki('counterstrike')
        .pagination(2)
        .build()

      expect(params).toEqual({
        wiki: 'counterstrike',
        pagination: 2
      })
    })
  })

  describe('wikis method', () => {
    it('should join multiple wikis with pipe separator', () => {
      const { params } = client
        .endpoint('/player')
        .wikis(['dota2', 'counterstrike', 'valorant'])
        .limit(10)
        .build()

      expect(params.wikis).toBe('dota2|counterstrike|valorant')
    })
  })

  describe('build method', () => {
    it('should return path and params', () => {
      const result = client
        .endpoint('/tournament')
        .wiki('leagueoflegends')
        .limit(5)
        .build()

      expect(result).toEqual({
        path: '/tournament',
        params: {
          wiki: 'leagueoflegends',
          limit: 5
        }
      })
    })
  })
})
