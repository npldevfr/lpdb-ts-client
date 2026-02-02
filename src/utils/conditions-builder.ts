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

type LogicalOperator = 'AND' | 'OR' | null

/**
 * A fluent builder for constructing Liquipedia API condition strings.
 * Optimizes output by minimizing unnecessary parentheses.
 *
 * This is especially useful when we have complex conditions to optmize query length.
 *
 * @example
 * ```ts
 * // Simple condition
 * const conditions = ConditionsBuilder
 *   .create('nationality', '::', 'France')
 *   .and('team', '::', 'Team Liquid')
 *   .toString()
 * // => "[[nationality::France]] AND [[team::Team Liquid]]"
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
  private parts: string[] = []
  private operators: LogicalOperator[] = []

  private constructor() {}

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
    const builder = new ConditionsBuilder()

    if (key === undefined && operator === undefined && value === undefined) {
      return builder
    }

    if (key !== undefined && operator !== undefined && value !== undefined) {
      ConditionsBuilder.ensureValidOperator(operator)
      builder.parts.push(`[[${key}${operator}${value}]]`)
      return builder
    }

    throw new Error(
      '[ConditionsBuilder] Invalid arguments: you must provide all parameters (key, operator, value) or none.'
    )
  }

  /**
   * Create a ConditionsBuilder from a raw condition string
   */
  static raw(condition: string): ConditionsBuilder {
    const builder = new ConditionsBuilder()
    if (condition) {
      builder.parts.push(condition)
    }
    return builder
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
    return this.parts.length === 0
  }

  private hasMixedOperators(): boolean {
    const ops = this.operators.filter((o) => o !== null)
    if (ops.length === 0) return false
    return ops.some((o) => o !== ops[0])
  }

  /**
   * Add an AND condition
   */
  and(key: string, operator: OperatorValue, value: string | number): this {
    ConditionsBuilder.ensureValidOperator(operator)
    if (!this.isEmpty()) {
      this.operators.push('AND')
    }
    this.parts.push(`[[${key}${operator}${value}]]`)
    return this
  }

  /**
   * Add an OR condition
   */
  or(key: string, operator: OperatorValue, value: string | number): this {
    ConditionsBuilder.ensureValidOperator(operator)
    if (!this.isEmpty()) {
      this.operators.push('OR')
    }
    this.parts.push(`[[${key}${operator}${value}]]`)
    return this
  }

  /**
   * Add multiple values joined with AND, grouped together, connected with AND
   * Example: AND ([[key::value1]] AND [[key::value2]])
   */
  andManyAnd(key: string, operator: OperatorValue, values: (string | number)[]): this {
    ConditionsBuilder.ensureValidOperator(operator)
    const conditions = values.map((v) => `[[${key}${operator}${v}]]`)
    if (!this.isEmpty()) {
      this.operators.push('AND')
    }
    this.parts.push(`(${conditions.join(' AND ')})`)
    return this
  }

  /**
   * Add multiple values joined with OR, grouped together, connected with AND
   * Example: AND ([[key::value1]] OR [[key::value2]])
   */
  andManyOr(key: string, operator: OperatorValue, values: (string | number)[]): this {
    ConditionsBuilder.ensureValidOperator(operator)
    const conditions = values.map((v) => `[[${key}${operator}${v}]]`)
    if (!this.isEmpty()) {
      this.operators.push('AND')
    }
    this.parts.push(`(${conditions.join(' OR ')})`)
    return this
  }

  /**
   * Add multiple values joined with AND, grouped together, connected with OR
   * Example: OR ([[key::value1]] AND [[key::value2]])
   */
  orManyAnd(key: string, operator: OperatorValue, values: (string | number)[]): this {
    ConditionsBuilder.ensureValidOperator(operator)
    const conditions = values.map((v) => `[[${key}${operator}${v}]]`)
    if (!this.isEmpty()) {
      this.operators.push('OR')
    }
    this.parts.push(`(${conditions.join(' AND ')})`)
    return this
  }

  /**
   * Add multiple values joined with OR, grouped together, connected with OR
   * Example: OR ([[key::value1]] OR [[key::value2]])
   */
  orManyOr(key: string, operator: OperatorValue, values: (string | number)[]): this {
    ConditionsBuilder.ensureValidOperator(operator)
    const conditions = values.map((v) => `[[${key}${operator}${v}]]`)
    if (!this.isEmpty()) {
      this.operators.push('OR')
    }
    this.parts.push(`(${conditions.join(' OR ')})`)
    return this
  }

  /**
   * Add a nested group of conditions with AND
   */
  andGroup(builder: ConditionsBuilder): this {
    if (!this.isEmpty()) {
      this.operators.push('AND')
    }
    const inner = builder.toString()
    // Only wrap in parentheses if the inner builder has mixed operators
    // or if we're mixing operators at this level
    if (builder.hasMixedOperators() || builder.parts.length > 1) {
      this.parts.push(`(${inner})`)
    } else {
      this.parts.push(inner)
    }
    return this
  }

  /**
   * Add a nested group of conditions with OR
   */
  orGroup(builder: ConditionsBuilder): this {
    if (!this.isEmpty()) {
      this.operators.push('OR')
    }
    const inner = builder.toString()
    // Only wrap in parentheses if the inner builder has mixed operators
    // or if we're mixing operators at this level
    if (builder.hasMixedOperators() || builder.parts.length > 1) {
      this.parts.push(`(${inner})`)
    } else {
      this.parts.push(inner)
    }
    return this
  }

  /**
   * Get the built condition string
   */
  toString(): string {
    if (this.parts.length === 0) return ''
    if (this.parts.length === 1) return this.parts[0]!

    let result = this.parts[0]!
    for (let i = 1; i < this.parts.length; i++) {
      result += ` ${this.operators[i - 1]} ${this.parts[i]}`
    }
    return result
  }

  /**
   * Alias for toString()
   */
  toValue(): string {
    return this.toString()
  }
}
