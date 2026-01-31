# Types

All types are exported from the main package:

```typescript
import type {
  EndpointPath,
  EndpointParams,
  ApiResponse,
  Wiki,
  // ... etc
} from 'lpdb-ts-client'
```

## Core Types

### EndpointPath

Union of all available endpoint paths:

```typescript
type EndpointPath =
  | '/broadcasters'
  | '/company'
  | '/datapoint'
  | '/externalmedialink'
  | '/match'
  | '/placement'
  | '/player'
  | '/series'
  | '/squadplayer'
  | '/standingsentry'
  | '/standingstable'
  | '/team'
  | '/teamtemplate'
  | '/teamtemplatelist'
  | '/tournament'
  | '/transfer'
```

### EndpointParams

Extract the query parameters type for a specific endpoint:

```typescript
type EndpointParams<T extends EndpointPath> = paths[T]['get']['parameters']['query']

// Usage
type PlayerParams = EndpointParams<'/player'>
// { wiki: string; conditions?: string; query?: string; ... }
```

### ApiResponse

Response type from the API:

```typescript
type ApiResponse = SuccessfulResponse | SuccessfulResponseWithWarning

interface SuccessfulResponse {
  result?: Record<string, never>[]
}

interface SuccessfulResponseWithWarning {
  result?: Record<string, never>[]
  warning?: string[]
}
```

### ErrorResponse

Error response from the API:

```typescript
interface ErrorResponse {
  error?: string[]
}
```

## Wiki Type

All supported wiki identifiers:

```typescript
type Wiki =
  | 'ageofempires'
  | 'apexlegends'
  | 'brawlstars'
  | 'callofduty'
  | 'counterstrike'
  | 'deadlock'
  | 'dota2'
  | 'fortnite'
  | 'leagueoflegends'
  | 'overwatch'
  | 'pubg'
  | 'rainbowsix'
  | 'rocketleague'
  | 'starcraft2'
  | 'valorant'
  // ... and 60+ more
```

## Endpoint Category Types

### StandardEndpoint

Endpoints with standard query parameters:

```typescript
type StandardEndpoint =
  | '/broadcasters'
  | '/company'
  | '/datapoint'
  | '/externalmedialink'
  | '/placement'
  | '/player'
  | '/series'
  | '/squadplayer'
  | '/standingsentry'
  | '/standingstable'
  | '/team'
  | '/tournament'
  | '/transfer'
```

## Generated Types

The package also exports types generated from the OpenAPI spec:

```typescript
import type { paths, components } from 'lpdb-ts-client'

// Access raw OpenAPI types
type PlayerEndpoint = paths['/player']
type Schemas = components['schemas']
```
