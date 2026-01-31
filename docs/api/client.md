# LPDBClient

The main client class for interacting with the Liquipedia API.

## Constructor

```typescript
new LPDBClient(options: LPDBClientOptions)
```

### Parameters

```typescript
interface LPDBClientOptions {
  apiKey: string
  baseUrl?: string
}
```

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `apiKey` | `string` | Yes | - | Your Liquipedia API key |
| `baseUrl` | `string` | No | `https://api.liquipedia.net/api/v3` | API base URL |

### Example

```typescript
import { LPDBClient } from 'lpdb-ts-client'

const client = new LPDBClient({
  apiKey: 'your-api-key'
})
```

## Methods

### endpoint

Creates a new query builder for the specified endpoint.

```typescript
endpoint<T extends EndpointPath>(path: T): QueryBuilder<T>
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | `EndpointPath` | The API endpoint path |

#### Returns

A `QueryBuilder` instance typed for the specific endpoint.

#### Example

```typescript
const builder = client.endpoint('/player')
```

### executeQuery

Internal method to execute a query. Usually you should use `QueryBuilder.execute()` instead.

```typescript
executeQuery(
  path: EndpointPath,
  params: Record<string, string | number | undefined>
): Promise<ApiResponse>
```

## Type Exports

```typescript
import type { LPDBClientOptions } from 'lpdb-ts-client'
```
