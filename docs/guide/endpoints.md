# Endpoints

## Standard Endpoints

These endpoints support all common parameters (`wiki`, `conditions`, `query`, `limit`, `offset`, `order`, `groupby`):

| Endpoint             | Description                   |
| -------------------- | ----------------------------- |
| `/player`            | Player information            |
| `/team`              | Team information              |
| `/match`             | Match data (has extra params) |
| `/tournament`        | Tournament information        |
| `/transfer`          | Player transfers              |
| `/placement`         | Tournament placements         |
| `/series`            | Series/leagues                |
| `/squadplayer`       | Team rosters                  |
| `/broadcasters`      | Stream broadcasters           |
| `/company`           | Organizations/companies       |
| `/datapoint`         | Custom data points            |
| `/externalmedialink` | External media links          |
| `/standingsentry`    | Standing entries              |
| `/standingstable`    | Standing tables               |

## Special Endpoints

### /match

The match endpoint has additional parameters for stream data:

```typescript
const matches = await client
  .endpoint('/match')
  .wiki('counterstrike')
  .rawstreams('true') // Get raw stream data
  .streamurls('true') // Get stream URLs
  .limit(10)
  .execute()
```

| Parameter    | Type                | Description             |
| ------------ | ------------------- | ----------------------- |
| `rawstreams` | `'true' \| 'false'` | Include raw stream data |
| `streamurls` | `'true' \| 'false'` | Include stream URLs     |

### /teamtemplate

Get a single team template:

```typescript
const template = await client
  .endpoint('/teamtemplate')
  .wiki('dota2')
  .template('teamliquid') // Required: template name
  .date('2020-01-01') // Optional: for historical logos
  .execute()
```

| Parameter  | Type     | Required | Description                            |
| ---------- | -------- | -------- | -------------------------------------- |
| `wiki`     | `string` | Yes      | Wiki name                              |
| `template` | `string` | Yes      | Team template name                     |
| `date`     | `string` | No       | Date for historical logos (YYYY-MM-DD) |

### /teamtemplatelist

Get a paginated list of team templates:

```typescript
const templates = await client
  .endpoint('/teamtemplatelist')
  .wiki('leagueoflegends')
  .pagination(1) // Page number (200 per page)
  .execute()
```

| Parameter    | Type     | Required | Description |
| ------------ | -------- | -------- | ----------- |
| `wiki`       | `string` | Yes      | Wiki name   |
| `pagination` | `number` | No       | Page number |

## Type Safety

The client is fully typed. Parameters that don't exist on an endpoint will cause TypeScript errors:

```typescript
// This will cause a TypeScript error
client.endpoint('/player').rawstreams('true')
//                         ^^^^^^^^^^
// Property 'rawstreams' does not exist on QueryBuilder<'/player'>

// This works correctly
client.endpoint('/match').rawstreams('true')
```

## Available Wikis

The `Wiki` type includes all supported wikis:

```typescript
import type { Wiki } from '@npldev/lpdb-ts-client'

const wiki: Wiki = 'dota2' // Type-safe wiki names
```

Some popular wikis:

- `dota2`
- `counterstrike`
- `leagueoflegends`
- `valorant`
- `overwatch`
- `starcraft2`
- `rocketleague`
- `fortnite`

See the full list in the [Types](/api/types) reference.
