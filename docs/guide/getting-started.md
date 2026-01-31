# Getting Started

## Installation

::: code-group

```bash [bun]
bun add lpdb-ts-client
```

```bash [pnpm]
pnpm add lpdb-ts-client
```

```bash [npm]
npm install lpdb-ts-client
```

```bash [yarn]
yarn add lpdb-ts-client
```

:::

## Prerequisites

You need a Liquipedia API key to use this client. You can request one at [Liquipedia API Portal](https://liquipedia.net/api/).

## Quick Start

```typescript
import { LPDBClient } from 'lpdb-ts-client'

// Create a client instance
const client = new LPDBClient({
  apiKey: 'your-api-key'
})

// Query players from Dota 2
const response = await client
  .endpoint('/player')
  .wiki('dota2')
  .limit(10)
  .execute()

console.log(response.result)
```

## Basic Example

Here's a more complete example showing various features:

```typescript
import { LPDBClient, LPDBError } from 'lpdb-ts-client'

const client = new LPDBClient({
  apiKey: process.env.LIQUIPEDIA_API_KEY!
})

async function main() {
  try {
    // Get French Valorant players
    const players = await client
      .endpoint('/player')
      .wiki('valorant')
      .conditions('[[nationality::France]]')
      .query('id, name, team')
      .limit(20)
      .order('name ASC')
      .execute()

    console.log('Players:', players.result)

    // Get upcoming CS2 matches with stream URLs
    const matches = await client
      .endpoint('/match')
      .wiki('counterstrike')
      .conditions('[[finished::0]]')
      .streamurls('true')
      .limit(5)
      .execute()

    console.log('Matches:', matches.result)

  } catch (error) {
    if (error instanceof LPDBError) {
      console.error(`API Error (${error.status}):`, error.message)
    }
  }
}

main()
```

## Next Steps

- Learn about [Configuration](/guide/configuration) options
- Explore [Basic Queries](/guide/basic-queries) in depth
- See all available [Endpoints](/guide/endpoints)
