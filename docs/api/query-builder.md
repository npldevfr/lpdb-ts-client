# QueryBuilder

A fluent builder for constructing API queries. The available methods depend on the endpoint type.

## Creating a QueryBuilder

Query builders are created via `LPDBClient.endpoint()`:

```typescript
const builder = client.endpoint('/player')
```

## Common Methods

These methods are available on all endpoints:

### wiki

Set a single wiki to query.

```typescript
wiki(value: Wiki): this
```

```typescript
client.endpoint('/player').wiki('dota2')
```

### wikis

Set multiple wikis to query (pipe-separated).

```typescript
wikis(value: Wiki[]): this
```

```typescript
client.endpoint('/player').wikis(['dota2', 'counterstrike'])
```

### execute

Execute the query and return results.

```typescript
execute(): Promise<ApiResponse>
```

```typescript
const response = await client
  .endpoint('/player')
  .wiki('dota2')
  .execute()
```

### build

Return the query parameters without executing.

```typescript
build(): { path: T; params: Record<string, string | number | undefined> }
```

```typescript
const query = client
  .endpoint('/player')
  .wiki('dota2')
  .limit(10)
  .build()

// { path: '/player', params: { wiki: 'dota2', limit: 10 } }
```

## Standard Query Methods

Available on most endpoints (not `/teamtemplate` or `/teamtemplatelist`):

### conditions

```typescript
conditions(value: string): this
```

Filter results using Liquipedia's condition syntax.

```typescript
.conditions('[[nationality::France]] AND [[team::!]]')
```

### query

```typescript
query(value: string): this
```

Select specific fields to return.

```typescript
.query('id, name, nationality')
```

### limit

```typescript
limit(value: number): this
```

Maximum number of results.

```typescript
.limit(50)
```

### offset

```typescript
offset(value: number): this
```

Number of results to skip (for pagination).

```typescript
.offset(100)
```

### order

```typescript
order(value: string): this
```

Sort order for results.

```typescript
.order('name ASC')
```

### groupby

```typescript
groupby(value: string): this
```

Group results by field.

```typescript
.groupby('nationality')
```

## Match-Specific Methods

Only available on `/match` endpoint:

### rawstreams

```typescript
rawstreams(value: 'true' | 'false'): this
```

Include raw stream data.

### streamurls

```typescript
streamurls(value: 'true' | 'false'): this
```

Include stream URLs.

## TeamTemplate-Specific Methods

Only available on `/teamtemplate` endpoint:

### template

```typescript
template(value: string): this
```

The team template name (required).

### date

```typescript
date(value: string): this
```

Date for historical logos (YYYY-MM-DD format).

## TeamTemplateList-Specific Methods

Only available on `/teamtemplatelist` endpoint:

### pagination

```typescript
pagination(value: number): this
```

Page number (200 results per page).
