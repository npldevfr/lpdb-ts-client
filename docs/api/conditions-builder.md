# ConditionsBuilder

A fluent builder for constructing Liquipedia API condition strings with type safety.

## Importing

```typescript
import { ConditionsBuilder, Operator } from '@npldev/lpdb-ts-client'
```

## Operator

An object containing valid operators for conditions.

```typescript
const Operator = {
  EQUALS: '::',
  NOT_EQUALS: '::!',
  LESS_THAN: '::<',
  GREATER_THAN: '::>',
} as const
```

| Operator       | Value | Description  |
| -------------- | ----- | ------------ |
| `EQUALS`       | `::`  | Equals       |
| `NOT_EQUALS`   | `::!` | Not equals   |
| `LESS_THAN`    | `::<` | Less than    |
| `GREATER_THAN` | `::>` | Greater than |

## Static Methods

### create

Create a new ConditionsBuilder instance.

```typescript
// Empty builder
ConditionsBuilder.create(): ConditionsBuilder

// With initial condition
ConditionsBuilder.create(
  key: string,
  operator: OperatorValue,
  value: string | number
): ConditionsBuilder
```

#### Parameters

| Parameter  | Type               | Required | Description                  |
| ---------- | ------------------ | -------- | ---------------------------- |
| `key`      | `string`           | No       | The field name to filter on  |
| `operator` | `OperatorValue`    | No       | The comparison operator      |
| `value`    | `string \| number` | No       | The value to compare against |

#### Example

```typescript
// Empty builder
const builder = ConditionsBuilder.create()

// With initial condition
const conditions = ConditionsBuilder.create('nationality', Operator.EQUALS, 'France')
```

### raw

Create a ConditionsBuilder from a raw condition string.

```typescript
ConditionsBuilder.raw(condition: string): ConditionsBuilder
```

#### Parameters

| Parameter   | Type     | Description                       |
| ----------- | -------- | --------------------------------- |
| `condition` | `string` | A raw Liquipedia condition string |

#### Example

```typescript
const conditions = ConditionsBuilder.raw('[[nationality::France]]')
```

## Instance Methods

### and

Add an AND condition.

```typescript
and(key: string, operator: OperatorValue, value: string | number): this
```

#### Example

```typescript
const conditions = ConditionsBuilder.create('nationality', Operator.EQUALS, 'France')
  .and('team', Operator.NOT_EQUALS, '')
  .toString()
// => "([[nationality::France]]) AND ([[team::!]])"
```

### or

Add an OR condition.

```typescript
or(key: string, operator: OperatorValue, value: string | number): this
```

#### Example

```typescript
const conditions = ConditionsBuilder.create('nationality', Operator.EQUALS, 'France')
  .or('nationality', Operator.EQUALS, 'Germany')
  .toString()
// => "([[nationality::France]]) OR ([[nationality::Germany]])"
```

### andManyAnd

Add multiple values joined with AND, grouped together, connected with AND.

```typescript
andManyAnd(key: string, operator: OperatorValue, values: (string | number)[]): this
```

#### Example

```typescript
const conditions = ConditionsBuilder.create('status', Operator.EQUALS, 'active')
  .andManyAnd('role', Operator.NOT_EQUALS, ['coach', 'analyst'])
  .toString()
// => "([[status::active]]) AND ([[role::!coach]] AND [[role::!analyst]])"
```

### andManyOr

Add multiple values joined with OR, grouped together, connected with AND.

```typescript
andManyOr(key: string, operator: OperatorValue, values: (string | number)[]): this
```

#### Example

```typescript
const conditions = ConditionsBuilder.create('status', Operator.EQUALS, 'active')
  .andManyOr('nationality', Operator.EQUALS, ['France', 'Germany', 'Spain'])
  .toString()
// => "([[status::active]]) AND ([[nationality::France]] OR [[nationality::Germany]] OR [[nationality::Spain]])"
```

### orManyAnd

Add multiple values joined with AND, grouped together, connected with OR.

```typescript
orManyAnd(key: string, operator: OperatorValue, values: (string | number)[]): this
```

#### Example

```typescript
const conditions = ConditionsBuilder.create('team', Operator.EQUALS, 'Team Liquid')
  .orManyAnd('role', Operator.EQUALS, ['captain', 'igl'])
  .toString()
// => "([[team::Team Liquid]]) OR ([[role::captain]] AND [[role::igl]])"
```

### orManyOr

Add multiple values joined with OR, grouped together, connected with OR.

```typescript
orManyOr(key: string, operator: OperatorValue, values: (string | number)[]): this
```

#### Example

```typescript
const conditions = ConditionsBuilder.create('liquipediatier', Operator.EQUALS, '1')
  .orManyOr('type', Operator.NOT_EQUALS, ['online', 'showmatch'])
  .toString()
// => "([[liquipediatier::1]]) OR ([[type::!online]] OR [[type::!showmatch]])"
```

### andGroup

Add a nested group of conditions with AND.

```typescript
andGroup(builder: ConditionsBuilder): this
```

#### Example

```typescript
const tierConditions = ConditionsBuilder.create('liquipediatier', Operator.EQUALS, '1').or(
  'liquipediatier',
  Operator.EQUALS,
  '2'
)

const conditions = ConditionsBuilder.create('date', Operator.GREATER_THAN, '2024-01-01')
  .andGroup(tierConditions)
  .toString()
// => "([[date::>2024-01-01]]) AND (([[liquipediatier::1]]) OR ([[liquipediatier::2]]))"
```

### orGroup

Add a nested group of conditions with OR.

```typescript
orGroup(builder: ConditionsBuilder): this
```

#### Example

```typescript
const premiumConditions = ConditionsBuilder.create('liquipediatier', Operator.EQUALS, '1').and(
  'prizepool',
  Operator.GREATER_THAN,
  '100000'
)

const conditions = ConditionsBuilder.create('featured', Operator.EQUALS, 'true')
  .orGroup(premiumConditions)
  .toString()
// => "([[featured::true]]) OR (([[liquipediatier::1]]) AND ([[prizepool::>100000]]))"
```

### toString

Get the built condition string.

```typescript
toString(): string
```

#### Example

```typescript
const conditionString = ConditionsBuilder.create(
  'nationality',
  Operator.EQUALS,
  'France'
).toString()
// => "([[nationality::France]])"
```

### toValue

Alias for `toString()`.

```typescript
toValue(): string
```

## Type Exports

```typescript
import type { OperatorValue } from '@npldev/lpdb-ts-client'
```

## Usage with QueryBuilder

```typescript
const conditions = ConditionsBuilder.create('date', Operator.GREATER_THAN, '2024-01-01')
  .and('date', Operator.LESS_THAN, '2024-12-31')
  .andGroup(
    ConditionsBuilder.create('liquipediatier', Operator.EQUALS, '1').or(
      'liquipediatier',
      Operator.EQUALS,
      '2'
    )
  )
  .toString()

const tournaments = await client
  .endpoint('/tournament')
  .wiki('dota2')
  .conditions(conditions)
  .execute()
```
