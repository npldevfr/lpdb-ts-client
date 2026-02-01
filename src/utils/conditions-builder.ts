/**
 * Operators for Liquipedia conditions
 * - `::` equals
 * - `::!` not equals
 * - `::<` lower than
 * - `::>` greater than
 */
export const Operator = {
  EQUALS: '::',
  NOT_EQUALS: '::!',
  LESS_THAN: '::<',
  GREATER_THAN: '::>',
} as const

export type OperatorValue = (typeof Operator)[keyof typeof Operator]

/**
 * A fluent builder for constructing Liquipedia API condition strings.
 *
 * @example
 * ```ts
 * // Simple condition
 * const conditions = ConditionsBuilder
 *   .create('nationality', '::', 'France')
 *   .and('team', '::', 'Team Liquid')
 *   .toString()
 * // => "([[nationality::France]]) AND ([[team::Team Liquid]])"
 *
 * // Date range
 * const dateRange = ConditionsBuilder
 *   .create('date', '::>', '2017-11-14')
 *   .and('date', '::<', '2017-12-14')
 *   .toString()
 *
 * // Using subkeys
 * const withSubkey = ConditionsBuilder
 *   .create('extradata_key', '::', 'test')
 *   .toString()
 *
 * // Date functions
 * const birthYear = ConditionsBuilder
 *   .create('birthdate_year', '::', '1995')
 *   .and('birthdate_month', '::', '2')
 *   .toString()
 *
 * // Complex conditions with OR
 * const complex = ConditionsBuilder
 *   .create('liquipediatier', '::', '1')
 *   .orManyOr('type', '::!', ['online', 'showmatch'])
 *   .toString()
 * ```
 */
export class ConditionsBuilder {
  private raw: string

  private constructor(raw: string = '') {
    this.raw = raw
  }

  /**
   * Create a new ConditionsBuilder instance
   */
  static create(): ConditionsBuilder
  static create(key: string, operator: OperatorValue, value: string | number): ConditionsBuilder
  static create(
    key?: string,
    operator?: OperatorValue,
    value?: string | number
  ): ConditionsBuilder {
    if (key === undefined && operator === undefined && value === undefined) {
      return new ConditionsBuilder()
    }

    if (key !== undefined && operator !== undefined && value !== undefined) {
      ConditionsBuilder.ensureValidOperator(operator)
      return new ConditionsBuilder(`([[${key}${operator}${value}]])`)
    }

    throw new Error(
      '[ConditionsBuilder] Invalid arguments: you must provide all parameters (key, operator, value) or none.'
    )
  }

  /**
   * Create a ConditionsBuilder from a raw condition string
   */
  static raw(condition: string): ConditionsBuilder {
    return new ConditionsBuilder(condition)
  }

  private static ensureValidOperator(operator: string): void {
    const validOperators = Object.values(Operator) as string[]
    if (!validOperators.includes(operator)) {
      throw new Error(
        `[ConditionsBuilder] Invalid operator "${operator}". Valid operators: ${validOperators.join(', ')}`
      )
    }
  }

  private isEmpty(): boolean {
    return this.raw === ''
  }

  /**
   * Add an AND condition
   */
  and(key: string, operator: OperatorValue, value: string | number): this {
    ConditionsBuilder.ensureValidOperator(operator)
    const prefix = this.isEmpty() ? '' : ' AND '
    this.raw += `${prefix}([[${key}${operator}${value}]])`
    return this
  }

  /**
   * Add an OR condition
   */
  or(key: string, operator: OperatorValue, value: string | number): this {
    ConditionsBuilder.ensureValidOperator(operator)
    const prefix = this.isEmpty() ? '' : ' OR '
    this.raw += `${prefix}([[${key}${operator}${value}]])`
    return this
  }

  /**
   * Add multiple values joined with AND, grouped together, connected with AND
   * Example: AND ([[key::value1]] AND [[key::value2]])
   */
  andManyAnd(key: string, operator: OperatorValue, values: (string | number)[]): this {
    ConditionsBuilder.ensureValidOperator(operator)
    const conditions = values.map((v) => `[[${key}${operator}${v}]]`)
    const prefix = this.isEmpty() ? '' : ' AND '
    this.raw += `${prefix}(${conditions.join(' AND ')})`
    return this
  }

  /**
   * Add multiple values joined with OR, grouped together, connected with AND
   * Example: AND ([[key::value1]] OR [[key::value2]])
   */
  andManyOr(key: string, operator: OperatorValue, values: (string | number)[]): this {
    ConditionsBuilder.ensureValidOperator(operator)
    const conditions = values.map((v) => `[[${key}${operator}${v}]]`)
    const prefix = this.isEmpty() ? '' : ' AND '
    this.raw += `${prefix}(${conditions.join(' OR ')})`
    return this
  }

  /**
   * Add multiple values joined with AND, grouped together, connected with OR
   * Example: OR ([[key::value1]] AND [[key::value2]])
   */
  orManyAnd(key: string, operator: OperatorValue, values: (string | number)[]): this {
    ConditionsBuilder.ensureValidOperator(operator)
    const conditions = values.map((v) => `[[${key}${operator}${v}]]`)
    const prefix = this.isEmpty() ? '' : ' OR '
    this.raw += `${prefix}(${conditions.join(' AND ')})`
    return this
  }

  /**
   * Add multiple values joined with OR, grouped together, connected with OR
   * Example: OR ([[key::value1]] OR [[key::value2]])
   */
  orManyOr(key: string, operator: OperatorValue, values: (string | number)[]): this {
    ConditionsBuilder.ensureValidOperator(operator)
    const conditions = values.map((v) => `[[${key}${operator}${v}]]`)
    const prefix = this.isEmpty() ? '' : ' OR '
    this.raw += `${prefix}(${conditions.join(' OR ')})`
    return this
  }

  /**
   * Add a nested group of conditions with AND
   */
  andGroup(builder: ConditionsBuilder): this {
    const prefix = this.isEmpty() ? '' : ' AND '
    this.raw += `${prefix}(${builder.toString()})`
    return this
  }

  /**
   * Add a nested group of conditions with OR
   */
  orGroup(builder: ConditionsBuilder): this {
    const prefix = this.isEmpty() ? '' : ' OR '
    this.raw += `${prefix}(${builder.toString()})`
    return this
  }

  /**
   * Get the built condition string
   */
  toString(): string {
    return this.raw
  }

  /**
   * Alias for toString()
   */
  toValue(): string {
    return this.raw
  }
}
