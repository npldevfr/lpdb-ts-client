# Configuration

## Client Options

The `LPDBClient` constructor accepts a configuration object:

```typescript
import { LPDBClient } from '@npldev/lpdb-ts-client'

const client = new LPDBClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.liquipedia.net/api/v3', // optional
})
```

### Options

| Option    | Type     | Required | Default                             | Description             |
| --------- | -------- | -------- | ----------------------------------- | ----------------------- |
| `apiKey`  | `string` | Yes      | -                                   | Your Liquipedia API key |
| `baseUrl` | `string` | No       | `https://api.liquipedia.net/api/v3` | API base URL            |

## Environment Variables

We recommend storing your API key in environment variables:

```bash
# .env
LIQUIPEDIA_API_KEY=your-api-key
```

```typescript
const client = new LPDBClient({
  apiKey: process.env.LIQUIPEDIA_API_KEY!,
})
```

## Custom Base URL

You can override the base URL for testing or proxying:

```typescript
const client = new LPDBClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://your-proxy.com/api/v3',
})
```
