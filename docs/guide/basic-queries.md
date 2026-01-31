# Basic Queries

## Query Builder Pattern

The client uses a fluent builder pattern. Each method returns the builder instance, allowing method chaining:

```typescript
const response = await client
  .endpoint('/player')    // Select endpoint
  .wiki('dota2')          // Set wiki
  .conditions('...')      // Add filters
  .limit(10)              // Limit results
  .execute()              // Execute the query
```

## Common Parameters

These parameters are available on most endpoints:

### wiki / wikis

Set the wiki(s) to query:

```typescript
// Single wiki
client.endpoint('/player').wiki('dota2')

// Multiple wikis
client.endpoint('/player').wikis(['dota2', 'counterstrike', 'valorant'])
```

### conditions

Filter results using Liquipedia's condition syntax:

```typescript
// Single condition
.conditions('[[nationality::France]]')

// Multiple conditions with AND
.conditions('[[nationality::France]] AND [[team::!]]')

// Multiple conditions with OR
.conditions('[[nationality::France]] OR [[nationality::Germany]]')
```

### query

Select specific fields to return:

```typescript
.query('id, name, nationality, team')
```

### limit / offset

Paginate results:

```typescript
// Get first 50 results
.limit(50)

// Get results 51-100
.limit(50).offset(50)
```

### order

Sort results:

```typescript
// Ascending
.order('name ASC')

// Descending
.order('earnings DESC')
```

### groupby

Group results (useful with aggregate functions):

```typescript
.groupby('nationality')
```

## Inspecting Queries

Use `build()` instead of `execute()` to inspect the query without executing it:

```typescript
const query = client
  .endpoint('/player')
  .wiki('valorant')
  .conditions('[[nationality::France]]')
  .limit(10)
  .build()

console.log(query)
// { path: '/player', params: { wiki: 'valorant', conditions: '[[nationality::France]]', limit: 10 } }
```

## Response Format

All responses follow this structure:

```typescript
interface ApiResponse {
  result: Record<string, unknown>[]
  warning?: string[]  // Present if there are warnings
}
```

Example:

```typescript
const response = await client
  .endpoint('/player')
  .wiki('dota2')
  .limit(2)
  .execute()

// response.result:
// [
//   { id: 'Arteezy', name: 'Artour Babaev', ... },
//   { id: 'Miracle-', name: 'Amer Al-Barkawi', ... }
// ]
```
