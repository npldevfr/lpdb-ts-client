# Error Handling

## LPDBError

The client throws `LPDBError` for API errors:

```typescript
import { LPDBClient, LPDBError } from 'lpdb-ts-client'

const client = new LPDBClient({ apiKey: 'your-api-key' })

try {
  const response = await client.endpoint('/player').wiki('dota2').execute()
} catch (error) {
  if (error instanceof LPDBError) {
    console.error('Status:', error.status)
    console.error('Message:', error.message)
    console.error('Data:', error.data)
  }
}
```

## Error Properties

| Property  | Type      | Description                 |
| --------- | --------- | --------------------------- |
| `status`  | `number`  | HTTP status code            |
| `message` | `string`  | Error message               |
| `data`    | `unknown` | Raw error response from API |

## Common Error Codes

| Status | Description         |
| ------ | ------------------- |
| `403`  | Invalid API key     |
| `404`  | Resource not found  |
| `429`  | Rate limit exceeded |

## Handling Rate Limits

Liquipedia has rate limits. Handle 429 errors with retry logic:

```typescript
async function queryWithRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (error instanceof LPDBError && error.status === 429) {
        const delay = Math.pow(2, i) * 1000 // Exponential backoff
        console.log(`Rate limited, retrying in ${delay}ms...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        continue
      }
      throw error
    }
  }
  throw new Error('Max retries exceeded')
}

// Usage
const response = await queryWithRetry(() =>
  client.endpoint('/player').wiki('dota2').limit(100).execute()
)
```

## Network Errors

Network errors (no internet, DNS failure, etc.) will throw standard `Error` objects, not `LPDBError`:

```typescript
try {
  const response = await client.endpoint('/player').wiki('dota2').execute()
} catch (error) {
  if (error instanceof LPDBError) {
    // API returned an error response
    console.error('API Error:', error.status)
  } else if (error instanceof Error) {
    // Network or other error
    console.error('Network Error:', error.message)
  }
}
```
