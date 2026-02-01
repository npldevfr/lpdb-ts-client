# Conditions Builder

The `ConditionsBuilder` class provides a fluent API for building Liquipedia query conditions.

## Condition Syntax

Liquipedia uses a specific syntax for conditions:

- `[[columnname::columnvalue]]` - Basic condition
- `::` equals, `::!` not equals, `::<` lower than, `::>` greater than
- Conditions can be combined with `AND` or `OR`
- Conditions can be grouped with parentheses

## Basic Usage

```typescript
import { ConditionsBuilder, Operator } from '@npldev/lpdb-ts-client'

const conditions = ConditionsBuilder.create('nationality', Operator.EQUALS, 'France')
  .and('team', Operator.EQUALS, 'Team Liquid')
  .toString()

// Result: "([[nationality::France]]) AND ([[team::Team Liquid]])"
```

## Operators

| Operator                | Symbol | Description  |
| ----------------------- | ------ | ------------ |
| `Operator.EQUALS`       | `::`   | Equals       |
| `Operator.NOT_EQUALS`   | `::!`  | Not equals   |
| `Operator.LESS_THAN`    | `::<`  | Lower than   |
| `Operator.GREATER_THAN` | `::>`  | Greater than |

## Methods

### create

Create a new builder, optionally with an initial condition:

```typescript
// Empty builder
const builder = ConditionsBuilder.create()

// With initial condition
const builder = ConditionsBuilder.create('name', Operator.EQUALS, 'value')
```

### raw

Create a builder from a raw condition string:

```typescript
const builder = ConditionsBuilder.raw('[[date::>2024-01-01]]')
```

### and / or

Add a simple condition:

```typescript
const conditions = ConditionsBuilder.create('region', Operator.EQUALS, 'EU')
  .and('liquipediatier', Operator.EQUALS, '1')
  .or('liquipediatier', Operator.EQUALS, '2')
  .toString()
```

### andManyOr / andManyAnd

Add multiple values for the same key:

```typescript
// Match tier 1, 2, or 3 tournaments
const conditions = ConditionsBuilder.create()
  .andManyOr('liquipediatier', Operator.EQUALS, ['1', '2', '3'])
  .toString()

// Result: "([[liquipediatier::1]] OR [[liquipediatier::2]] OR [[liquipediatier::3]])"
```

```typescript
// Exclude both cancelled and postponed
const conditions = ConditionsBuilder.create()
  .andManyAnd('status', Operator.NOT_EQUALS, ['cancelled', 'postponed'])
  .toString()

// Result: "([[status::!cancelled]] AND [[status::!postponed]])"
```

### orManyOr / orManyAnd

Same as above, but connected with OR:

```typescript
const conditions = ConditionsBuilder.create('region', Operator.EQUALS, 'EU')
  .orManyOr('region', Operator.EQUALS, ['NA', 'SA'])
  .toString()
```

### andGroup / orGroup

Add nested conditions:

```typescript
const tierCondition = ConditionsBuilder.create('liquipediatier', Operator.EQUALS, '1').or(
  'type',
  Operator.NOT_EQUALS,
  'online'
)

const conditions = ConditionsBuilder.create('date', Operator.GREATER_THAN, '2024-01-01')
  .andGroup(tierCondition)
  .toString()

// Result: "([[date::>2024-01-01]]) AND (([[liquipediatier::1]]) OR ([[type::!online]]))"
```

## Date Ranges

Query matches within a date range:

```typescript
const conditions = ConditionsBuilder.create('date', Operator.GREATER_THAN, '2024-01-01')
  .and('date', Operator.LESS_THAN, '2024-12-31')
  .toString()
```

## Date Functions

Use date functions on date columns:

```typescript
// Players born in February 1995
const conditions = ConditionsBuilder.create('birthdate_year', Operator.EQUALS, '1995')
  .and('birthdate_month', Operator.EQUALS, '2')
  .toString()
```

## Subkeys

Access JSON subkeys with underscore notation:

```typescript
const conditions = ConditionsBuilder.create('extradata_key', Operator.EQUALS, 'value').toString()
```

## Complete Example

```typescript
import { LPDBClient, ConditionsBuilder, Operator } from '@npldev/lpdb-ts-client'

const client = new LPDBClient({ apiKey: 'your-api-key' })

// Build complex conditions
const conditions = ConditionsBuilder.create('date', Operator.GREATER_THAN, '2024-01-01')
  .and('date', Operator.LESS_THAN, '2024-06-01')
  .andGroup(
    ConditionsBuilder.create('liquipediatier', Operator.EQUALS, '1').or(
      'liquipediatier',
      Operator.EQUALS,
      '2'
    )
  )
  .and('status', Operator.NOT_EQUALS, 'cancelled')

// Use with the client
const tournaments = await client
  .endpoint('/tournament')
  .wiki('dota2')
  .conditions(conditions.toString())
  .limit(50)
  .execute()
```
