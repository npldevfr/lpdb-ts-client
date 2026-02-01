<h1 align="center">@npldev/lpdb-ts-client</h1>

<p align="center">
  A fully typed TypeScript client for the Liquipedia API v3
</p>

<p align="center">
  <em>This is an unofficial library and is not affiliated with or endorsed by Liquipedia.</em>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@npldev/lpdb-ts-client">
    <img src="https://img.shields.io/npm/v/@npldev/lpdb-ts-client?color=blue&label=npm" alt="npm version" />
  </a>
  <a href="https://github.com/npldevfr/lpdb-ts-client/actions/workflows/ci.yml">
    <img src="https://github.com/npldevfr/lpdb-ts-client/actions/workflows/ci.yml/badge.svg" alt="CI" />
  </a>
  <a href="https://codecov.io/gh/npldevfr/lpdb-ts-client">
    <img src="https://codecov.io/gh/npldevfr/lpdb-ts-client/branch/main/graph/badge.svg" alt="codecov" />
  </a>
  <a href="https://github.com/npldevfr/lpdb-ts-client/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@npldev/lpdb-ts-client" alt="license" />
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript&logoColor=white" alt="TypeScript" />
  </a>
</p>

<p align="center">
  <a href="https://npldevfr.github.io/lpdb-ts-client/">Documentation</a> ·
  <a href="https://github.com/npldevfr/lpdb-ts-client/issues">Report Bug</a> ·
  <a href="https://liquipedia.net/api/">Liquipedia API</a>
</p>

---

## Features

- **Type-Safe** - Full TypeScript support with types generated from the OpenAPI spec
- **Fluent Builder API** - Chain methods together for readable and maintainable code
- **Conditions Builder** - Build complex query conditions with a fluent, type-safe API
- **All Wikis Supported** - Access data from 70+ esports wikis (Dota 2, CS2, LoL, Valorant...)
- **Lightweight** - Zero runtime dependencies, uses native fetch API

## Installation

```bash
# npm
npm install @npldev/lpdb-ts-client

# pnpm
pnpm add @npldev/lpdb-ts-client

# yarn
yarn add @npldev/lpdb-ts-client

# bun
bun add @npldev/lpdb-ts-client
```

## Quick Start

```typescript
import { LPDBClient } from '@npldev/lpdb-ts-client'

const client = new LPDBClient({
  apiKey: 'your-api-key',
})

// Query players from Dota 2
const response = await client
  .endpoint('/player')
  .wiki('dota2')
  .conditions('[[nationality::France]]')
  .limit(10)
  .execute()

console.log(response.result)
```

## Usage Examples

### Get upcoming matches with stream URLs

```typescript
const matches = await client
  .endpoint('/match')
  .wiki('counterstrike')
  .conditions('[[finished::0]]')
  .streamurls('true')
  .limit(5)
  .execute()
```

### Get team information

```typescript
const teams = await client
  .endpoint('/team')
  .wiki('leagueoflegends')
  .query('name, region, createdate')
  .order('createdate DESC')
  .limit(20)
  .execute()
```

### Conditions Builder

Build complex query conditions with a fluent API:

```typescript
import { ConditionsBuilder, Operator } from '@npldev/lpdb-ts-client'

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

### Error handling

```typescript
import { LPDBClient, LPDBError } from '@npldev/lpdb-ts-client'

try {
  const response = await client.endpoint('/player').wiki('valorant').execute()
} catch (error) {
  if (error instanceof LPDBError) {
    console.error(`API Error (${error.status}):`, error.message)
  }
}
```

## Documentation

Full documentation is available at [npldevfr.github.io/lpdb-ts-client](https://npldevfr.github.io/lpdb-ts-client/)

- [Getting Started](https://npldevfr.github.io/lpdb-ts-client/guide/getting-started)
- [Configuration](https://npldevfr.github.io/lpdb-ts-client/guide/configuration)
- [Conditions Builder](https://npldevfr.github.io/lpdb-ts-client/guide/conditions-builder)
- [Endpoints](https://npldevfr.github.io/lpdb-ts-client/guide/endpoints)
- [API Reference](https://npldevfr.github.io/lpdb-ts-client/api/client)

## Requirements

- Node.js 18+ (for native fetch support)
- A [Liquipedia API key](https://liquipedia.net/api/)

## License

[MIT](LICENSE)
