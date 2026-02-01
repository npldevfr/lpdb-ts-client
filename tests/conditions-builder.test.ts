import { describe, expect, it } from 'vitest'
import { ConditionsBuilder, Operator } from '../src/utils/conditions-builder'

describe('ConditionsBuilder', () => {
  describe('create', () => {
    it('should create an empty builder', () => {
      const builder = ConditionsBuilder.create()
      expect(builder.toString()).toBe('')
    })

    it('should create a builder with initial condition', () => {
      const builder = ConditionsBuilder.create('nationality', Operator.EQUALS, 'France')
      expect(builder.toString()).toBe('([[nationality::France]])')
    })

    it('should throw error for invalid operator', () => {
      expect(() => {
        ConditionsBuilder.create('key', '::?' as never, 'value')
      }).toThrow('[ConditionsBuilder] Invalid operator')
    })

    it('should throw error for partial arguments', () => {
      expect(() => {
        // @ts-expect-error - testing runtime error
        ConditionsBuilder.create('key', Operator.EQUALS)
      }).toThrow('[ConditionsBuilder] Invalid arguments')
    })
  })

  describe('raw', () => {
    it('should create a builder from raw string', () => {
      const builder = ConditionsBuilder.raw('[[date::>2017-11-14]]')
      expect(builder.toString()).toBe('[[date::>2017-11-14]]')
    })
  })

  describe('and', () => {
    it('should add AND condition', () => {
      const builder = ConditionsBuilder.create('nationality', Operator.EQUALS, 'France').and(
        'team',
        Operator.EQUALS,
        'Team Liquid'
      )
      expect(builder.toString()).toBe('([[nationality::France]]) AND ([[team::Team Liquid]])')
    })

    it('should handle first condition without prefix', () => {
      const builder = ConditionsBuilder.create().and('nationality', Operator.EQUALS, 'France')
      expect(builder.toString()).toBe('([[nationality::France]])')
    })
  })

  describe('or', () => {
    it('should add OR condition', () => {
      const builder = ConditionsBuilder.create('liquipediatier', Operator.EQUALS, '1').or(
        'liquipediatier',
        Operator.EQUALS,
        '2'
      )
      expect(builder.toString()).toBe('([[liquipediatier::1]]) OR ([[liquipediatier::2]])')
    })
  })

  describe('operators', () => {
    it('should handle EQUALS operator', () => {
      const builder = ConditionsBuilder.create('name', Operator.EQUALS, 'test')
      expect(builder.toString()).toBe('([[name::test]])')
    })

    it('should handle NOT_EQUALS operator', () => {
      const builder = ConditionsBuilder.create('type', Operator.NOT_EQUALS, 'online')
      expect(builder.toString()).toBe('([[type::!online]])')
    })

    it('should handle LESS_THAN operator', () => {
      const builder = ConditionsBuilder.create('date', Operator.LESS_THAN, '2017-12-14')
      expect(builder.toString()).toBe('([[date::<2017-12-14]])')
    })

    it('should handle GREATER_THAN operator', () => {
      const builder = ConditionsBuilder.create('date', Operator.GREATER_THAN, '2017-11-14')
      expect(builder.toString()).toBe('([[date::>2017-11-14]])')
    })
  })

  describe('andManyAnd', () => {
    it('should join multiple values with AND', () => {
      const builder = ConditionsBuilder.create().andManyAnd('status', Operator.NOT_EQUALS, [
        'cancelled',
        'postponed',
      ])
      expect(builder.toString()).toBe('([[status::!cancelled]] AND [[status::!postponed]])')
    })
  })

  describe('andManyOr', () => {
    it('should join multiple values with OR', () => {
      const builder = ConditionsBuilder.create().andManyOr('liquipediatier', Operator.EQUALS, [
        '1',
        '2',
        '3',
      ])
      expect(builder.toString()).toBe(
        '([[liquipediatier::1]] OR [[liquipediatier::2]] OR [[liquipediatier::3]])'
      )
    })

    it('should add AND prefix when not empty', () => {
      const builder = ConditionsBuilder.create('wiki', Operator.EQUALS, 'dota2').andManyOr(
        'liquipediatier',
        Operator.EQUALS,
        ['1', '2']
      )
      expect(builder.toString()).toBe(
        '([[wiki::dota2]]) AND ([[liquipediatier::1]] OR [[liquipediatier::2]])'
      )
    })
  })

  describe('orManyAnd', () => {
    it('should join multiple values with AND connected by OR', () => {
      const builder = ConditionsBuilder.create('type', Operator.EQUALS, 'online').orManyAnd(
        'status',
        Operator.EQUALS,
        ['finished', 'live']
      )
      expect(builder.toString()).toBe(
        '([[type::online]]) OR ([[status::finished]] AND [[status::live]])'
      )
    })
  })

  describe('orManyOr', () => {
    it('should join multiple values with OR connected by OR', () => {
      const builder = ConditionsBuilder.create('region', Operator.EQUALS, 'EU').orManyOr(
        'region',
        Operator.EQUALS,
        ['NA', 'SA']
      )
      expect(builder.toString()).toBe('([[region::EU]]) OR ([[region::NA]] OR [[region::SA]])')
    })
  })

  describe('andGroup / orGroup', () => {
    it('should add nested group with AND', () => {
      const inner = ConditionsBuilder.create('liquipediatier', Operator.EQUALS, '1').or(
        'type',
        Operator.NOT_EQUALS,
        'online'
      )
      const builder = ConditionsBuilder.create('date', Operator.GREATER_THAN, '2017-11-14')
        .and('date', Operator.LESS_THAN, '2017-12-14')
        .andGroup(inner)

      expect(builder.toString()).toBe(
        '([[date::>2017-11-14]]) AND ([[date::<2017-12-14]]) AND (([[liquipediatier::1]]) OR ([[type::!online]]))'
      )
    })

    it('should add nested group with OR', () => {
      const inner = ConditionsBuilder.create('region', Operator.EQUALS, 'EU')
      const builder = ConditionsBuilder.create('region', Operator.EQUALS, 'NA').orGroup(inner)

      expect(builder.toString()).toBe('([[region::NA]]) OR (([[region::EU]]))')
    })
  })

  describe('subkeys and date functions', () => {
    it('should handle extradata subkeys', () => {
      const builder = ConditionsBuilder.create('extradata_key', Operator.EQUALS, 'test')
      expect(builder.toString()).toBe('([[extradata_key::test]])')
    })

    it('should handle date year function', () => {
      const builder = ConditionsBuilder.create('birthdate_year', Operator.EQUALS, '1995')
      expect(builder.toString()).toBe('([[birthdate_year::1995]])')
    })

    it('should handle date month function', () => {
      const builder = ConditionsBuilder.create('birthdate_month', Operator.EQUALS, '2')
      expect(builder.toString()).toBe('([[birthdate_month::2]])')
    })

    it('should combine date functions', () => {
      const builder = ConditionsBuilder.create('birthdate_year', Operator.EQUALS, '1995').and(
        'birthdate_month',
        Operator.EQUALS,
        '2'
      )
      expect(builder.toString()).toBe('([[birthdate_year::1995]]) AND ([[birthdate_month::2]])')
    })
  })

  describe('complex example from documentation', () => {
    it('should build the example condition', () => {
      // [[date::>2017-11-14]] AND [[date::<2017-12-14]] AND ([[liquipediatier::1]] OR [[type::!online]]) AND [[extradata_key::test]]
      const tierOrType = ConditionsBuilder.create('liquipediatier', Operator.EQUALS, '1').or(
        'type',
        Operator.NOT_EQUALS,
        'online'
      )

      const builder = ConditionsBuilder.create('date', Operator.GREATER_THAN, '2017-11-14')
        .and('date', Operator.LESS_THAN, '2017-12-14')
        .andGroup(tierOrType)
        .and('extradata_key', Operator.EQUALS, 'test')

      expect(builder.toString()).toBe(
        '([[date::>2017-11-14]]) AND ([[date::<2017-12-14]]) AND (([[liquipediatier::1]]) OR ([[type::!online]])) AND ([[extradata_key::test]])'
      )
    })
  })

  describe('toValue', () => {
    it('should be an alias for toString', () => {
      const builder = ConditionsBuilder.create('key', Operator.EQUALS, 'value')
      expect(builder.toValue()).toBe(builder.toString())
    })
  })

  describe('numeric values', () => {
    it('should handle numeric values', () => {
      const builder = ConditionsBuilder.create('liquipediatier', Operator.EQUALS, 1)
      expect(builder.toString()).toBe('([[liquipediatier::1]])')
    })

    it('should handle numeric values in andManyOr', () => {
      const builder = ConditionsBuilder.create().andManyOr(
        'liquipediatier',
        Operator.EQUALS,
        [1, 2, 3]
      )
      expect(builder.toString()).toBe(
        '([[liquipediatier::1]] OR [[liquipediatier::2]] OR [[liquipediatier::3]])'
      )
    })
  })
})
